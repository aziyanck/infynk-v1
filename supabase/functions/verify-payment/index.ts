import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { PRICING_CONFIG } from "../_shared/pricingConfig.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as crypto from "https://deno.land/std@0.177.0/node/crypto.ts";
// ▼▼▼ 1. Import BOTH templates ▼▼▼
import {
  getWelcomeEmailHtml,
  getTechnicalErrorEmailHtml,
} from "./emailTemplate.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userData,
    } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // [VERIFY SIGNATURE LOGIC]
    const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpaySecret)
      throw new Error("Server Error: Razorpay Secret missing");

    const generated_signature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature)
      throw new Error("Invalid Signature");

    // Calculate Amount
    const selectedConfig =
      PRICING_CONFIG[userData.card_type as keyof typeof PRICING_CONFIG] ||
      PRICING_CONFIG["PVC Card"];
    const planPrice =
      selectedConfig.plans[
        userData.plan as keyof typeof selectedConfig.plans
      ] || 0;
    const extraQty = Math.max(0, userData.qty - 1);
    const amount = planPrice + selectedConfig.single_item * extraQty; // INR

    // [SAVE TO DB LOGIC]
    const { data: paymentRecord, error: dbError } = await supabaseAdmin
      .from("payments")
      .insert([
        {
          full_name: userData.full_name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          account_type: userData.account_type,
          company_name: userData.company_name,
          plan: userData.plan,
          card_type: userData.card_type,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          payment_status: "paid",
          qty: userData.qty,
          amount: amount,
        },
      ])
      .select()
      .single();

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    // [CREATE USER LOGIC]
    const tempPassword = crypto.randomUUID().slice(0, 8);
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { name: userData.full_name },
        app_metadata: { role: "user", plan: userData.plan },
      });

    if (authData.user && paymentRecord) {
      await supabaseAdmin
        .from("payments")
        .update({ user_id: authData.user.id })
        .eq("id", paymentRecord.id);
    }

    // --- HANDLE EMAIL SENDING LOGIC ---
    let emailHtml;
    let subject;
    let responseData;

    // Dynamically determining readable plan name
    // We assume the user has a valid cardType, but verify-payment receives what create-order passed or what the frontend sent.
    // Ideally we should use the cardType from userData to look up.
    // If cardType is missing, default to PVC.

    let readablePlan = userData.plan;
    readablePlan =
      readablePlan
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase()) + " Plan";

    if (authError) {
      // [CASE: Payment Success, User Creation Failed]
      console.error("User Creation Failed:", authError);

      emailHtml = getTechnicalErrorEmailHtml(userData.full_name, readablePlan);
      subject = "Action Required: Payment Received, Account Setup Issue";

      // Return PARTIAL SUCCESS to frontend
      responseData = {
        success: false,
        paymentVerified: true,
        error: "UserCreationError",
        message: "Payment success, user creation failed",
      };
    } else {
      // [CASE: All Success]
      emailHtml = getWelcomeEmailHtml(
        userData.full_name,
        userData.email,
        tempPassword,
        readablePlan,
      );
      subject = "Welcome to Pixiic! Payment Successful";

      responseData = { success: true, message: "Processed successfully" };
    }

    // SEND EMAIL (If Resend Key exists)
    if (RESEND_API_KEY) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Pixiic <onboarding@resend.dev>", // UPDATE THIS
          to: [userData.email],
          subject: subject,
          html: emailHtml,
        }),
      });

      if (!emailRes.ok) console.error("Email failed:", await emailRes.text());
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
