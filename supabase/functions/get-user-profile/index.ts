import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization")!,
        },
      },
    }
  );

  if (req.method === "OPTIONS") {
    return new Response("OK", {
      status: 200,
      headers: corsHeaders,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  // ✅ Log the user ID to Supabase logs
  console.log("User ID:", user.id);

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: "Profile not found" }), {
      status: 404,
      headers: corsHeaders,
    });
  }

  if (data.length > 1) {
    return new Response(
      JSON.stringify({ error: "Multiple profiles found for this user" }),
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  // Fetch view-count from analytics table using route_id from the profile
  let viewCount = 0;
  const profileData = data[0];

  if (profileData && profileData.route_id) {
    const { data: analyticsData, error: analyticsError } = await supabase
      .from("analytics")
      .select("view_count")
      .eq("route_id", profileData.route_id)
      .maybeSingle();

    viewCount = analyticsData?.view_count ?? 0;
  }

  return new Response(
    JSON.stringify({ profile: data[0], view_count: viewCount }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
});
