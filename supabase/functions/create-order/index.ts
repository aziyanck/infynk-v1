import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Razorpay from "npm:razorpay@2.9.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { planName } = await req.json()

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: Deno.env.get('RAZORPAY_KEY_ID') ?? '',
      key_secret: Deno.env.get('RAZORPAY_KEY_SECRET') ?? '',
    })

    // Determine amount based on plan
    let amount = 0
    // Amounts are in paise (100 paise = 1 INR)
    if (planName === '1 Year Plan 999/-') {
        amount = 99900
    } else if (planName === '2 Year Plan 1299/-') {
        amount = 129900
    } else if (planName === '3 Year Plan 1399/-') {
        amount = 139900
    } else {
        throw new Error('Invalid Plan Selected')
    }

    // Create Order
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    })

    return new Response(
      JSON.stringify(order),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})