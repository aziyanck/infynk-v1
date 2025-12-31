// supabase/functions/renew-expiry/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { route_id } = await req.json();

    if (!route_id) {
      throw new Error("Route ID is required");
    }

    // 1. Get current expiry
    const { data: route, error: fetchError } = await supabase
      .from("routes")
      .select("expiry_date")
      .eq("route_id", route_id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Calculate new expiry
    let currentExpiry = route.expiry_date ? new Date(route.expiry_date) : new Date();
    
    if (isNaN(currentExpiry.getTime())) {
        currentExpiry = new Date();
    }

    const newExpiry = new Date(currentExpiry);
    newExpiry.setFullYear(newExpiry.getFullYear() + 1);

    // 3. Update
    const { data: updatedRoute, error: updateError } = await supabase
      .from("routes")
      .update({ expiry_date: newExpiry.toISOString().split('T')[0] })
      .eq("route_id", route_id)
      .select()
      .single();

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, new_expiry: updatedRoute.expiry_date }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
