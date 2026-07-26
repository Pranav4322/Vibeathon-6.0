import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";

/**
 * Creates a Supabase client specifically for the Next.js proxy layer.
 *
 * Next.js 16 renamed `middleware.ts` → `proxy.ts`.
 * This helper handles session refresh by reading/writing cookies
 * on the request/response pair available in proxy context.
 *
 * Usage (inside src/proxy.ts):
 *   import { createClient } from "@/lib/supabase/proxy";
 *   const { supabase, response } = createClient(request);
 */
export function createClient(request: NextRequest) {
  // Start with a NextResponse that continues the chain
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // First update request cookies so downstream handlers see them
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Rebuild the response with updated request headers
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // Set the cookies on the response so the browser receives them
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return { supabase, response };
}
