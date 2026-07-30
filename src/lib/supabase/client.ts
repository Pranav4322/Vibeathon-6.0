"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

/**
 * Creates a Supabase client for use in browser (Client Components).
 * This uses the default cookie handling via document.cookie.
 *
 * Usage:
 *   import { createClient } from "@/lib/supabase/client";
 *   const supabase = createClient();
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
