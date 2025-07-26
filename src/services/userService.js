import { supabase } from "../supabaseClient";

export const getUserProfileByRouteId = async (routeId) => {
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .eq("route_id", routeId)
    .single();

  console.log("Supabase data:", data);
  console.log("Supabase error:", error);

  return { data, error };
};

export const fetchUserProfile = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(
    "https://yowckahgoxqfikadirov.supabase.co/functions/v1/get-user-profile",
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch profile");
  }

  const data = await res.json();
  return data.profile;
};

export const updateUserProfile = async (updatedProfile) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updatedProfile)
    .eq("id", updatedProfile.id); // You must include the user ID

  if (error) throw error;
  return data;
};

export const uploadProfileImage = async (
  file,
  userId,
  existingImageUrl = null
) => {
  const fileExt = file.name.split(".").pop();
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:.]/g, "").slice(0, 15); // e.g., 20250720T123045
  const fileName = `${userId}_${timestamp}.${fileExt}`;
  const filePath = `profile-pictures/${fileName}`;

  // Step 1: Delete existing image (if any)
  if (existingImageUrl) {
    const pathParts = existingImageUrl.split("/");
    const oldFileName = pathParts[pathParts.length - 1];
    const { error: deleteError } = await supabase.storage
      .from("profile-pictures")
      .remove([`profile-pictures/${oldFileName}`]);

    if (deleteError) {
      console.warn("Warning: Failed to delete old image", deleteError.message);
      // Continue even if delete fails
    }
  }

  // Step 2: Upload new image
  const { error: uploadError } = await supabase.storage
    .from("profile-pictures")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Step 3: Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("profile-pictures")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
