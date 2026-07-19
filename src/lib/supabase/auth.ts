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

export async function signOut() {
  await getSupabase().auth.signOut();
}
