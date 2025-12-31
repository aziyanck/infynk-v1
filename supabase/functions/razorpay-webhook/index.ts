import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

console.log("Razorpay Webhook Function Initialized");

const RAZORPAY_WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // ----------------------------------------------------------------------
    // 1. SECURE VERIFICATION (CRITICAL)
    // We verify that this request actually came from Razorpay and not a hacker.
    // ----------------------------------------------------------------------
    const signature = req.headers.get("x-razorpay-signature");
    const bodyText = await req.text(); // Read raw body for hashing

    if (!RAZORPAY_WEBHOOK_SECRET) {
        console.error("Missing RAZORPAY_WEBHOOK_SECRET");
        return new Response("Server Configuration Error", { status: 500 });
    }

    const generatedSignature = createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(bodyText)
      .digest("hex");

    if (generatedSignature !== signature) {
      console.error("Invalid Signature. Potential attack.");
      return new Response("Invalid signature", { status: 400 });
    }

    // ----------------------------------------------------------------------
    // 2. PROCESS THE EVENT
    // ----------------------------------------------------------------------
    const body = JSON.parse(bodyText);
    const event = body.event;

    // We only care if the payment was successfully captured
    if (event === "payment.captured") {
      const entity = body.payload.payment.entity;
      
      console.log(`Processing Payment ID: ${entity.id}`);

      // Extract user data from the 'notes' field sent from your Frontend
      // Defaults to "N/A" if for some reason notes are missing
      const userName = entity.notes?.user_name || "N/A";
      const userPlan = entity.notes?.user_plan || "N/A";
      
      // --------------------------------------------------------------------
      // 3. INSERT INTO SUPABASE DATABASE
      // --------------------------------------------------------------------
      const { error } = await supabase
        .from("payments")
        .insert({
          payment_id: entity.id,          // e.g., "pay_Hq7..."
          amount: entity.amount / 100,    // Convert paise (50000) to Rupee (500)
          name: userName,                 // Populated from 'notes'
          plan: userPlan,                 // Populated from 'notes'
          paid: true,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error("Supabase Insert Error:", error);
        // Return 200 anyway so Razorpay doesn't retry indefinitely, but log the error.
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 200,
            headers: { "Content-Type": "application/json" } 
        });
      }
      
      console.log(`Successfully recorded payment for ${userName}`);
    }

    // Return 200 OK to Razorpay to acknowledge receipt
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    console.error("Webhook Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});