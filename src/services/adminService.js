// src/services/adminService.js
import { supabase } from "../supabaseClient";

export const createNewUser = async (name, email, password) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
    },
    app_metadata: {
      role: "user",
    },
  });

  return { data, error };
};

// Insert a new route and profile for a given user
export const assignRouteToUser = async (userId, routeId) => {
  const session = await supabase.auth.getSession();
  const jwt = session.data.session.access_token;

  const res = await fetch(
    `https://yowckahgoxqfikadirov.supabase.co/functions/v1/assign-route`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ user_id: userId, route_id: routeId }),
    }
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to assign route");

  return result;
};


export const removeRouteFromUser = async (userId) => {
  const session = await supabase.auth.getSession();
  const jwt = session.data.session.access_token;

  const res = await fetch(
    `https://yowckahgoxqfikadirov.supabase.co/functions/v1/remove-route`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ user_id: userId }),
    }
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to remove route");

  return result;
};

