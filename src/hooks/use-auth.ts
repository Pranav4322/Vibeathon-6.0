"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Staff, StaffRole } from "@/lib/types/database";

interface AuthState {
  user: User | null;
  staff: Staff | null;
  isLoading: boolean;
  isStaff: boolean;
  role: StaffRole | null;
}

/**
 * Client-side auth hook that provides the current user, their staff record
 * (if any), and loading state. Subscribes to Supabase auth state changes
 * so the UI stays in sync.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    staff: null,
    isLoading: true,
    isStaff: false,
    role: null,
  });

  const supabase = createClient();

  const fetchStaffRecord = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("staff")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

      return data as Staff | null;
    },
    [supabase]
  );

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let staff: Staff | null = null;
      if (user) {
        staff = await fetchStaffRecord(user.id);
      }

      setState({
        user,
        staff,
        isLoading: false,
        isStaff: !!staff,
        role: staff?.role ?? null,
      });
    };

    getInitialSession();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      let staff: Staff | null = null;

      if (user) {
        staff = await fetchStaffRecord(user.id);
      }

      setState({
        user,
        staff,
        isLoading: false,
        isStaff: !!staff,
        role: staff?.role ?? null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchStaffRecord]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      staff: null,
      isLoading: false,
      isStaff: false,
      role: null,
    });
  }, [supabase]);

  return { ...state, signOut };
}
