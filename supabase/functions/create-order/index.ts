import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Razorpay from "npm:razorpay@2.9.2";
import { PRICING_CONFIG } from "../_shared/pricingConfig.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { planName, qty, cardType } = await req.json();

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: Deno.env.get("RAZORPAY_KEY_ID") ?? "",
      key_secret: Deno.env.get("RAZORPAY_KEY_SECRET") ?? "",
    });

    // Validate Card Type
    const selectedConfig =
      PRICING_CONFIG[cardType as keyof typeof PRICING_CONFIG];

    if (!selectedConfig) {
      throw new Error("Invalid Card Type");
    }

    // Determine amount based on plan
    let amount = 0;
    const planPriceINR =
      selectedConfig.plans[planName as keyof typeof selectedConfig.plans];

    if (!planPriceINR) {
      throw new Error("Invalid Plan Selected");
    }

    if (!qty || qty < 1) {
      throw new Error("Invalid Quantity");
    }

    // First card is included in the plan, extra cards are charged
    const extraQty = Math.max(0, qty - 1);
    const extraCardPriceINR = selectedConfig.single_item * extraQty;

    // Convert Total to Paise (INR * 100)
    amount = (planPriceINR + extraCardPriceINR) * 100;

    // Create Order
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return new Response(JSON.stringify(order), {
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
