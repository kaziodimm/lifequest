"use client";

import { useEffect, useMemo, useState } from "react";
import { LockKeyhole, LogIn, LogOut, Mail, Save, UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPlayerStateSnapshot, useLifeStore } from "@/lib/store";
import type { Locale, PlayerState } from "@/lib/types";
import { normalizeHabid, validateHabid } from "@/lib/habid";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type ProfileRow = { user_id: string; habid: string; display_name: string | null; locale: Locale; created_at: string; updated_at: string };
type CloudStateRow = { user_id: string; state: PlayerState; state_version: number; updated_at: string };
type AuthMode = "signup" | "login";

function cloudMessageFromError(message: string) {
  if (/duplicate key|23505|unique/i.test(message)) return "That Habid is already taken.";
  return message;
}

export function CloudAccountPanel() {
  const state = useLifeStore();
  const restoreCloudState = useLifeStore((current) => current.restoreCloudState);
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => configured ? createSupabaseBrowserClient() : null, [configured]);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [cloudState, setCloudState] = useState<CloudStateRow | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [habidInput, setHabidInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const confirmed = Boolean(user?.email_confirmed_at || user?.confirmed_at);
  const habidValidation = validateHabid(habidInput);
  const passwordReady = password.length >= 8 && (authMode === "login" || password === passwordConfirm);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setUser(data.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => {
      cancelled = true;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !user || !confirmed) {
      setProfile(null);
      setCloudState(null);
      setCloudLoaded(false);
      return;
    }
    let cancelled = false;
    const client = supabase;
    const currentUserId = user.id;
    async function loadAccount() {
      setCloudLoaded(false);
      const [{ data: profileData }, { data: cloudData }] = await Promise.all([
        client.from("profiles").select("user_id, habid, display_name, locale, created_at, updated_at").eq("user_id", currentUserId).maybeSingle(),
        client.from("user_game_state").select("user_id, state, state_version, updated_at").eq("user_id", currentUserId).maybeSingle()
      ]);
      if (cancelled) return;
      setProfile((profileData as ProfileRow | null) ?? null);
      setCloudState((cloudData as CloudStateRow | null) ?? null);
      setCloudLoaded(true);
    }
    loadAccount();
    return () => { cancelled = true; };
  }, [confirmed, supabase, user]);

  async function submitAuth() {
    if (!supabase || !email.trim() || !passwordReady) return;
    setBusy(true);
    setMessage("");
    const redirectTo = `${window.location.origin}/auth/confirm?next=/profile`;
    const credentials = { email: email.trim(), password };
    const { error } = authMode === "signup"
      ? await supabase.auth.signUp({ ...credentials, options: { emailRedirectTo: redirectTo } })
      : await supabase.auth.signInWithPassword(credentials);
    setBusy(false);
    if (error) {
      setMessage(cloudMessageFromError(error.message));
      return;
    }
    setMessage(authMode === "signup" ? "Account created. Check your email to confirm Habidoo." : "Logged in.");
  }

  async function createProfile() {
    if (!supabase || !user || !confirmed || !habidValidation.valid) return;
    setBusy(true);
    setMessage("");
    const habid = normalizeHabid(habidInput);
    const { data, error } = await supabase.from("profiles").insert({
      user_id: user.id,
      habid,
      display_name: state.avatarName,
      locale: state.locale
    }).select("user_id, habid, display_name, locale, created_at, updated_at").single();
    if (error) {
      setBusy(false);
      setMessage(cloudMessageFromError(error.message));
      return;
    }
    setProfile(data as ProfileRow);
    await saveLocalProgress(user.id, true);
    setBusy(false);
  }

  async function saveLocalProgress(userId = user?.id, silent = false) {
    if (!supabase || !userId || !confirmed) return;
    setBusy(true);
    if (!silent) setMessage("");
    const snapshot = createPlayerStateSnapshot(useLifeStore.getState());
    const { data, error } = await supabase.from("user_game_state").upsert({
      user_id: userId,
      state: snapshot,
      state_version: snapshot.storeVersion,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" }).select("user_id, state, state_version, updated_at").single();
    setBusy(false);
    if (error) {
      if (!silent) setMessage(error.message);
      return;
    }
    setCloudState(data as CloudStateRow);
    setMessage(silent ? "Habid created and this device progress is saved to your account." : "This device progress is saved to your account.");
  }

  async function useCloudProgress() {
    if (!cloudState?.state) return;
    restoreCloudState(cloudState.state);
    setMessage("Account progress restored on this device.");
  }

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setCloudState(null);
    setCloudLoaded(false);
    setBusy(false);
  }

  if (!configured) {
    return (
      <Card className="border-primary/30">
        <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole size={18} className="text-primary" />Habidoo account</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>Guest mode is active. Add Supabase environment variables to enable Habidoo accounts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole size={18} className="text-primary" />Habidoo account</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        {!user ? (
          <>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/25 p-1">
              <button type="button" onClick={() => { setAuthMode("signup"); setMessage(""); }} className={authMode === "signup" ? "rounded-md bg-primary px-3 py-2 text-sm font-black text-primary-foreground" : "rounded-md px-3 py-2 text-sm font-bold text-muted-foreground"}>Create account</button>
              <button type="button" onClick={() => { setAuthMode("login"); setMessage(""); }} className={authMode === "login" ? "rounded-md bg-primary px-3 py-2 text-sm font-black text-primary-foreground" : "rounded-md px-3 py-2 text-sm font-bold text-muted-foreground"}>Log in</button>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{authMode === "signup" ? "Create a Habidoo account to protect your progress and use it across devices." : "Log in to restore your Habidoo progress on this device."}</p>
            <label className="grid gap-2 text-sm font-bold text-foreground">
              Email
              <input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-foreground">
              Password
              <input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
            </label>
            {authMode === "signup" ? (
              <label className="grid gap-2 text-sm font-bold text-foreground">
                Confirm password
                <input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" type="password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} placeholder="Repeat password" />
              </label>
            ) : null}
            <p className={passwordReady || !password ? "text-xs text-muted-foreground" : "text-xs font-bold text-destructive"}>{authMode === "signup" ? "Use 8+ characters. Email confirmation is required before the account can sync progress." : "Use the password from your Habidoo account."}</p>
            <Button disabled={busy || !email.trim() || !passwordReady} onClick={submitAuth}>{authMode === "signup" ? <Mail size={16} /> : <LogIn size={16} />}{authMode === "signup" ? "Create account" : "Log in"}</Button>
          </>
        ) : !confirmed ? (
          <div className="rounded-md border border-border bg-muted/35 p-3 text-sm leading-6 text-muted-foreground">Email is not confirmed yet. You can keep using guest progress, but account sync stays locked until confirmation.</div>
        ) : !profile ? (
          <>
            <div className="rounded-md border border-primary/25 bg-primary/5 p-3 text-sm leading-6 text-muted-foreground">Email confirmed. Choose your unique Habidoo ID. It will be shown as <span className="font-black text-foreground">@habid</span>.</div>
            <label className="grid gap-2 text-sm font-bold text-foreground">
              Habid
              <input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm lowercase outline-none focus:border-primary" value={habidInput} onChange={(event) => setHabidInput(event.target.value)} placeholder="your_habid" />
            </label>
            {habidInput ? <p className={habidValidation.valid ? "text-xs font-bold text-primary" : "text-xs font-bold text-destructive"}>{habidValidation.valid ? `Available format: @${habidValidation.habid}` : habidValidation.error}</p> : <p className="text-xs text-muted-foreground">3-24 chars, lowercase a-z, 0-9, underscore. No spaces.</p>}
            <Button disabled={busy || !habidValidation.valid} onClick={createProfile}><UserRound size={16} />Create Habid</Button>
          </>
        ) : (
          <>
            <div className="rounded-md border border-border bg-muted/35 p-3">
              <p className="text-sm font-black text-foreground">@{profile.habid}</p>
              <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
            </div>
            {cloudLoaded && cloudState ? (
              <div className="grid gap-2 rounded-md border border-primary/25 bg-primary/5 p-3 text-sm">
                <p className="font-bold text-foreground">Account progress found.</p>
                <p className="text-xs text-muted-foreground">Updated {new Date(cloudState.updated_at).toLocaleString()}.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button variant="outline" disabled={busy} onClick={useCloudProgress}>Use account progress</Button>
                  <Button disabled={busy} onClick={() => saveLocalProgress()}><Save size={16} />Keep this device progress</Button>
                </div>
              </div>
            ) : null}
            {cloudLoaded && !cloudState ? <Button disabled={busy} onClick={() => saveLocalProgress()}><Save size={16} />Save progress to account</Button> : null}
            <Button variant="outline" disabled={busy} onClick={signOut}><LogOut size={16} />Log out</Button>
          </>
        )}
        {message ? <p className="rounded-md border border-border bg-background/45 p-3 text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
