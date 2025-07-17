import { supabase } from "../supabaseClient";

export const getUserProfileByRouteId = async (routeId) => {
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("route_id", routeId)
    .single();

  console.log('Supabase data:', data);
  console.log('Supabase error:', error);

  return { data, error };
};

