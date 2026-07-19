"use client";

import { getSupabase } from "@/lib/supabase/client";

export async function signInWithGoogle() {
  await getSupabase().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}`,
    },
  });
}

export async function signUpWithEmail(email: string, password: string) {
  const { error } = await getSupabase().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}`,
    },
  });
  return { error };
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await getSupabase().auth.signInWithPassword({
    email,
    password,
  });
  return { error };
}

export async function signOut() {
  await getSupabase().auth.signOut();
}
