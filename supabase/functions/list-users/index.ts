import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }

  // 🔐 Get token from header
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  // 🧠 Verify token and get user
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

  // 🔒 Check admin role
  const role = user.app_metadata?.role;
  if (role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  // ✅ List all users
  const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    return new Response(JSON.stringify({ error: listError.message }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  // 🔵 Filter users with app_metadata.role === 'user'
  const filteredUsers = (userList?.users || []).filter(
    (user) => user.app_metadata?.role === "user"
  );

  const userIds = filteredUsers.map((u) => u.id);

  // �� Fetch routes for these users
  const { data: routes, error: routeError } = await supabaseAdmin
    .from("routes")
    .select("route_id, user_id, is_active, expiry_date, last_activated")
    .in("user_id", userIds);

  if (routeError) {
    return new Response(JSON.stringify({ error: routeError.message }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  // 🔗 Merge route data with users
  const usersWithRoutes = filteredUsers.map((user) => {
    const route = routes?.find((r) => r.user_id === user.id);
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || "No name",
      created_at: user.created_at,
      route_id: route?.route_id ?? null,
      route_status: route ? (route.is_active ? "Active" : "Inactive") : null,
      expiry_date: route?.expiry_date ?? null,
      activation_date: route?.last_activated ?? null,
    };
  });

  return new Response(JSON.stringify({ users: usersWithRoutes }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // ✅ Enable CORS
      "Content-Type": "application/json",
    },
  });
});
