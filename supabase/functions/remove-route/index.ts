import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  const role = user.app_metadata?.role;
  if (role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  const body = await req.json();
  const user_id = body.user_id;

  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id is required" }), {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  // 🔍 Fetch route ID for the user
  const { data: route, error: fetchError } = await supabaseAdmin
    .from("routes")
    .select("route_id")
    .eq("user_id", user_id)
    .single();

  if (fetchError || !route) {
    return new Response(JSON.stringify({ error: "No route found for user" }), {
      status: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  const route_id = route.route_id;

  // 🗑 Delete from profiles
  const { error: profileDeleteError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("route_id", route_id);

  if (profileDeleteError) {
    return new Response(JSON.stringify({ error: "Failed to delete profile" }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  // 🗑 Delete from routes
  const { error: routeDeleteError } = await supabaseAdmin
    .from("routes")
    .delete()
    .eq("route_id", route_id);

  if (routeDeleteError) {
    return new Response(JSON.stringify({ error: "Failed to delete route" }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
});
