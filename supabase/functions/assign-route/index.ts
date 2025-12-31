// supabase/functions/assign-route/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or replace * with your domain
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { user_id, route_id } = await req.json();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const jwt = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(jwt);

    if (authError || user?.app_metadata?.role !== "admin") {
      return new Response("Only admins can assign routes", {
        status: 403,
        headers: corsHeaders,
      });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365); // Add 365 days

    const { data: route, error: routeError } = await supabaseClient
      .from("routes")
      .insert({
        route_id: route_id,
        user_id,
        is_active: true,
        last_activated: new Date().toISOString(),
        expiry_date: expiryDate.toISOString().split("T")[0], // YYYY-MM-DD format
      })
      .select()
      .single();

    if (routeError) {
      return new Response(JSON.stringify(routeError), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { error: profileError } = await supabaseClient
      .from("profiles")
      .insert({
        route_id: route.route_id,
        user_id: user_id,
      });

    if (profileError) {
      return new Response(JSON.stringify(profileError), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true, route }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid Request", detail: err.message }),
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
});
