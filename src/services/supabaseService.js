// src/supabase/supabaseService.js
import { supabase } from "../supabaseClient";

export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export async function loginAsUser({ email, password }) {
  const res = await fetch(
    "https://yowckahgoxqfikadirov.supabase.co/functions/v1/user-login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd2NrYWhnb3hxZmlrYWRpcm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzcxODUsImV4cCI6MjA2NjcxMzE4NX0.tw75tUlGRtnRCNF-5IXzEYd1mUxXwyLLk0NAZRjxsuQ",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.error || "Network error");
  }

  console.log("returned from edge:", payload.session);
  return payload.session; // { access_token, refresh_token, user, ... }
}

export async function loginAsAdmin({ email, password }) {
  const res = await fetch(
    "https://yowckahgoxqfikadirov.supabase.co/functions/v1/admin-login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd2NrYWhnb3hxZmlrYWRpcm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzcxODUsImV4cCI6MjA2NjcxMzE4NX0.tw75tUlGRtnRCNF-5IXzEYd1mUxXwyLLk0NAZRjxsuQ",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const payload = await res.json();

  if (!res.ok) {
    throw new Error(payload.error || "Network error");
  }

  console.log("returned from edge:", payload.session);
  return payload.session; // { access_token, refresh_token, user, ... }
}

export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return { session, error };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// 1. Send the password reset email
export const sendPasswordResetEmail = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`, // Redirects to your new update page
  });
  return { data, error };
};

// 2. Update the user's password (used after they click the email link)
export const updateUserPassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};


