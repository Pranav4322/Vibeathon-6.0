import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/proxy";

/**
 * Next.js 16 Proxy (formerly middleware.ts).
 *
 * Responsibilities:
 * 1. Refresh the Supabase session on every request (keeps cookies alive).
 * 2. Protect staff-only routes — redirect unauthenticated users to /login.
 * 3. Redirect already-authenticated users away from /login and /signup.
 *
 * IMPORTANT: Proxy should only do cookie/session checks — never hit
 * the database. Role-based checks happen in server components / actions.
 */

// Routes that require an active Supabase session
const PROTECTED_PREFIXES = ["/dashboard", "/staff"];

// Routes only for unauthenticated users
const AUTH_ROUTES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Refresh the session — this is the critical step that keeps the
  // auth cookie alive. We use getUser() for a verified session check.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // --- Protect staff routes ---
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- Redirect authenticated users away from auth pages ---
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
