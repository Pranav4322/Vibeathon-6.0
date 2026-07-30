"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates an untyped Supabase browser client.
 * Use this in Client Components for mutations where the Database generic
 * causes TypeScript inference to resolve as `never`.
 * We handle type safety manually via our own domain types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRawClient() {
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
