import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

/**
 * Creates a Supabase client for use on the server side (Server Components,
 * Server Actions, Route Handlers).
 *
 * Must be called per-request — never share a client across requests.
 * Uses Next.js `cookies()` (async) for cookie access.
 *
 * Usage:
 *   import { createClient } from "@/lib/supabase/server";
 *   const supabase = await createClient();
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from Server Components where cookies
            // cannot be set. This can be safely ignored if middleware
            // is handling session refresh.
          }
        },
      },
    }
  );
}
