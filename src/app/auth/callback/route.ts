import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback handler.
 *
 * Supabase redirects here after a successful OAuth sign-in (Google) or
 * email link verification. The `code` query param is exchanged for a session.
 *
 * Flow:
 *   1. User signs in via Google OAuth / email magic link
 *   2. Supabase redirects to /auth/callback?code=...
 *   3. This handler exchanges the code for a session
 *   4. Redirects to the intended destination (or /dashboard)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful auth — redirect to intended destination
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // If no code or exchange failed, redirect to login with error
  return NextResponse.redirect(
    new URL("/login?error=auth_callback_failed", origin)
  );
}
