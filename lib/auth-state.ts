"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type AuthStatus = "loading" | "guest" | "unconfirmed" | "authenticated";

export function isConfirmedUser(user: User | null) {
  return Boolean(user?.email_confirmed_at || user?.confirmed_at);
}

export function useAuthState() {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => configured ? createSupabaseBrowserClient() : null, [configured]);
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(!configured);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(!configured);

  useEffect(() => {
    if (!supabase) {
      setLoaded(true);
      setUser(null);
      return;
    }
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setUser(data.user ?? null);
      setLoaded(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user || !isConfirmedUser(user)) {
      setHasProfile(false);
      setProfileLoaded(true);
      return;
    }
    let cancelled = false;
    setProfileLoaded(false);
    supabase.from("profiles").select("user_id").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (cancelled) return;
      setHasProfile(Boolean(data));
      setProfileLoaded(true);
    });
    return () => { cancelled = true; };
  }, [supabase, user]);

  const status: AuthStatus = !loaded ? "loading" : !user ? "guest" : isConfirmedUser(user) ? "authenticated" : "unconfirmed";
  return { configured, hasProfile, loaded, profileLoaded, status, supabase, user };
}
