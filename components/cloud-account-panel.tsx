"use client";

import { useEffect, useMemo, useState } from "react";
import { LockKeyhole, LogIn, LogOut, Mail, Save, UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPlayerStateSnapshot, useLifeStore } from "@/lib/store";
import { accountProfileChangedEvent } from "@/lib/auth-state";
import type { Locale, PlayerState } from "@/lib/types";
import { normalizeHabid, validateHabid } from "@/lib/habid";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type ProfileRow = { user_id: string; habid: string; display_name: string | null; locale: Locale; created_at: string; updated_at: string };
type CloudStateRow = { user_id: string; state: PlayerState; state_version: number; updated_at: string };
type AuthMode = "signup" | "login";

const accountCopy: Record<Locale, {
  account: string; guest: string; createAccount: string; login: string; signupIntro: string; loginIntro: string; email: string; password: string; confirmPassword: string; passwordPlaceholder: string; repeatPassword: string; passwordHelp: string; loginHelp: string; signupSuccess: string; loggedIn: string; unconfirmed: string; emailConfirmed: string; habid: string; habidHelp: string; availableFormat: string; createHabid: string; habidCreated: string; accountProgressFound: string; updated: string; useAccountProgress: string; keepDeviceProgress: string; usedDevice: string; restored: string; syncActive: string; logout: string;
}> = {
  en: {
    account: "Habidoo account",
    guest: "Guest mode is active. Add Supabase environment variables to enable Habidoo accounts.",
    createAccount: "Create account",
    login: "Log in",
    signupIntro: "Create a Habidoo account to protect your progress and use it across devices.",
    loginIntro: "Log in to restore your Habidoo progress on this device.",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    passwordPlaceholder: "At least 8 characters",
    repeatPassword: "Repeat password",
    passwordHelp: "Use 8+ characters. Email confirmation is required before the account can sync progress.",
    loginHelp: "Use the password from your Habidoo account.",
    signupSuccess: "Account created. Check your email to confirm Habidoo.",
    loggedIn: "Logged in.",
    unconfirmed: "Email is not confirmed yet. Account sync stays locked until confirmation.",
    emailConfirmed: "Email confirmed. Choose your unique Habidoo ID. It will be shown as @habid.",
    habid: "Habid",
    habidHelp: "3-24 chars, lowercase a-z, 0-9, underscore. No spaces.",
    availableFormat: "Available format",
    createHabid: "Create Habid",
    habidCreated: "Habid created. Your progress now syncs automatically.",
    accountProgressFound: "Account progress found.",
    updated: "Updated",
    useAccountProgress: "Use account progress",
    keepDeviceProgress: "Keep this device progress",
    usedDevice: "This device progress is now used for your account.",
    restored: "Account progress restored on this device.",
    syncActive: "Progress sync is active.",
    logout: "Log out"
  },
  ru: {
    account: "Аккаунт Habidoo",
    guest: "Гостевой режим активен. Добавьте переменные Supabase, чтобы включить аккаунты Habidoo.",
    createAccount: "Создать аккаунт",
    login: "Войти",
    signupIntro: "Создайте аккаунт Habidoo, чтобы защитить прогресс и использовать его на разных устройствах.",
    loginIntro: "Войдите, чтобы восстановить прогресс Habidoo на этом устройстве.",
    email: "Email",
    password: "Пароль",
    confirmPassword: "Повторите пароль",
    passwordPlaceholder: "Минимум 8 символов",
    repeatPassword: "Повторите пароль",
    passwordHelp: "Используйте 8+ символов. Подтверждение email обязательно для синхронизации прогресса.",
    loginHelp: "Используйте пароль от аккаунта Habidoo.",
    signupSuccess: "Аккаунт создан. Проверьте email, чтобы подтвердить Habidoo.",
    loggedIn: "Вход выполнен.",
    unconfirmed: "Email ещё не подтверждён. Синхронизация аккаунта заблокирована до подтверждения.",
    emailConfirmed: "Email подтверждён. Выберите уникальный Habidoo ID. Он будет отображаться как @habid.",
    habid: "Habid",
    habidHelp: "3–24 символа: a-z, 0-9, подчёркивание. Только нижний регистр, без пробелов.",
    availableFormat: "Подходящий формат",
    createHabid: "Создать Habid",
    habidCreated: "Habid создан. Прогресс теперь синхронизируется автоматически.",
    accountProgressFound: "Найден прогресс аккаунта.",
    updated: "Обновлено",
    useAccountProgress: "Использовать прогресс аккаунта",
    keepDeviceProgress: "Оставить прогресс устройства",
    usedDevice: "Прогресс этого устройства теперь используется для аккаунта.",
    restored: "Прогресс аккаунта восстановлен на этом устройстве.",
    syncActive: "Синхронизация прогресса активна.",
    logout: "Выйти"
  },
  cs: {
    account: "Účet Habidoo",
    guest: "Je aktivní hostovský režim. Přidejte proměnné Supabase pro zapnutí účtů Habidoo.",
    createAccount: "Vytvořit účet",
    login: "Přihlásit se",
    signupIntro: "Vytvořte účet Habidoo, abyste chránili postup a používali ho na více zařízeních.",
    loginIntro: "Přihlaste se a obnovte postup Habidoo na tomto zařízení.",
    email: "Email",
    password: "Heslo",
    confirmPassword: "Potvrdit heslo",
    passwordPlaceholder: "Alespoň 8 znaků",
    repeatPassword: "Zopakujte heslo",
    passwordHelp: "Použijte 8+ znaků. Před synchronizací postupu je nutné potvrdit email.",
    loginHelp: "Použijte heslo ke svému účtu Habidoo.",
    signupSuccess: "Účet byl vytvořen. Zkontrolujte email a potvrďte Habidoo.",
    loggedIn: "Přihlášeno.",
    unconfirmed: "Email zatím není potvrzen. Synchronizace účtu zůstává uzamčená.",
    emailConfirmed: "Email potvrzen. Zvolte jedinečné Habidoo ID. Bude se zobrazovat jako @habid.",
    habid: "Habid",
    habidHelp: "3–24 znaků: a-z, 0-9, podtržítko. Malá písmena, bez mezer.",
    availableFormat: "Platný formát",
    createHabid: "Vytvořit Habid",
    habidCreated: "Habid vytvořen. Postup se nyní automaticky synchronizuje.",
    accountProgressFound: "Nalezen postup účtu.",
    updated: "Aktualizováno",
    useAccountProgress: "Použít postup účtu",
    keepDeviceProgress: "Ponechat postup zařízení",
    usedDevice: "Postup tohoto zařízení se nyní používá pro účet.",
    restored: "Postup účtu byl obnoven na tomto zařízení.",
    syncActive: "Synchronizace postupu je aktivní.",
    logout: "Odhlásit se"
  },
  uk: {
    account: "Акаунт Habidoo",
    guest: "Гостьовий режим активний. Додайте змінні Supabase, щоб увімкнути акаунти Habidoo.",
    createAccount: "Створити акаунт",
    login: "Увійти",
    signupIntro: "Створіть акаунт Habidoo, щоб захистити прогрес і використовувати його на різних пристроях.",
    loginIntro: "Увійдіть, щоб відновити прогрес Habidoo на цьому пристрої.",
    email: "Email",
    password: "Пароль",
    confirmPassword: "Повторіть пароль",
    passwordPlaceholder: "Мінімум 8 символів",
    repeatPassword: "Повторіть пароль",
    passwordHelp: "Використовуйте 8+ символів. Підтвердження email потрібне для синхронізації прогресу.",
    loginHelp: "Використовуйте пароль від акаунта Habidoo.",
    signupSuccess: "Акаунт створено. Перевірте email, щоб підтвердити Habidoo.",
    loggedIn: "Вхід виконано.",
    unconfirmed: "Email ще не підтверджено. Синхронізація акаунта заблокована до підтвердження.",
    emailConfirmed: "Email підтверджено. Оберіть унікальний Habidoo ID. Він відображатиметься як @habid.",
    habid: "Habid",
    habidHelp: "3–24 символи: a-z, 0-9, підкреслення. Лише нижній регістр, без пробілів.",
    availableFormat: "Підходящий формат",
    createHabid: "Створити Habid",
    habidCreated: "Habid створено. Прогрес тепер синхронізується автоматично.",
    accountProgressFound: "Знайдено прогрес акаунта.",
    updated: "Оновлено",
    useAccountProgress: "Використати прогрес акаунта",
    keepDeviceProgress: "Залишити прогрес пристрою",
    usedDevice: "Прогрес цього пристрою тепер використовується для акаунта.",
    restored: "Прогрес акаунта відновлено на цьому пристрої.",
    syncActive: "Синхронізація прогресу активна.",
    logout: "Вийти"
  }
};

function cloudMessageFromError(message: string) {
  if (/duplicate key|23505|unique/i.test(message)) return "That Habid is already taken.";
  return message;
}

export function CloudAccountPanel({ locale }: { locale?: Locale }) {
  const state = useLifeStore();
  const copy = accountCopy[locale ?? state.locale] ?? accountCopy.en;
  const restoreCloudState = useLifeStore((current) => current.restoreCloudState);
  const grantBetaTesterReward = useLifeStore((current) => current.grantBetaTesterReward);
  const betaTesterRewardGranted = useLifeStore((current) => current.betaTesterRewardGranted);
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
  const [syncEnabled, setSyncEnabled] = useState(false);
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
      setSyncEnabled(false);
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
      setSyncEnabled(!cloudData);
      setCloudLoaded(true);
    }
    loadAccount();
    return () => { cancelled = true; };
  }, [confirmed, supabase, user]);

  useEffect(() => {
    if (!supabase || !user || !confirmed || !profile || !cloudLoaded || !syncEnabled) return;
    const syncTimer = window.setTimeout(() => {
      void saveLocalProgress(user.id, true);
    }, 900);
    return () => window.clearTimeout(syncTimer);
  }, [cloudLoaded, confirmed, profile, state, supabase, syncEnabled, user]);

  useEffect(() => {
    if (!confirmed || !profile || betaTesterRewardGranted) return;
    grantBetaTesterReward();
  }, [betaTesterRewardGranted, confirmed, grantBetaTesterReward, profile]);

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
    setMessage(authMode === "signup" ? copy.signupSuccess : copy.loggedIn);
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
    grantBetaTesterReward();
    window.dispatchEvent(new Event(accountProfileChangedEvent));
    const saved = await saveLocalProgress(user.id, true);
    setSyncEnabled(saved);
    if (saved) setMessage(copy.habidCreated);
    setBusy(false);
  }

  async function saveLocalProgress(userId = user?.id, silent = false) {
    if (!supabase || !userId || !confirmed) return false;
    if (!silent) setBusy(true);
    if (!silent) setMessage("");
    const snapshot = createPlayerStateSnapshot(useLifeStore.getState());
    const { data, error } = await supabase.from("user_game_state").upsert({
      user_id: userId,
      state: snapshot,
      state_version: snapshot.storeVersion,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" }).select("user_id, state, state_version, updated_at").single();
    if (!silent) setBusy(false);
    if (error) {
      if (!silent) setMessage(error.message);
      return false;
    }
    setCloudState(data as CloudStateRow);
    if (!silent) setMessage(copy.usedDevice);
    return true;
  }

  async function useCloudProgress() {
    if (!cloudState?.state) return;
    restoreCloudState(cloudState.state);
    setSyncEnabled(true);
    setMessage(copy.restored);
  }

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setCloudState(null);
    setCloudLoaded(false);
    setSyncEnabled(false);
    setBusy(false);
  }

  if (!configured) {
    return (
      <Card className="border-primary/30">
        <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole size={18} className="text-primary" />{copy.account}</CardTitle></CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>{copy.guest}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole size={18} className="text-primary" />{copy.account}</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        {!user ? (
          <>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/25 p-1">
              <button type="button" onClick={() => { setAuthMode("signup"); setMessage(""); }} className={authMode === "signup" ? "rounded-md bg-primary px-3 py-2 text-sm font-black text-primary-foreground" : "rounded-md px-3 py-2 text-sm font-bold text-muted-foreground"}>{copy.createAccount}</button>
              <button type="button" onClick={() => { setAuthMode("login"); setMessage(""); }} className={authMode === "login" ? "rounded-md bg-primary px-3 py-2 text-sm font-black text-primary-foreground" : "rounded-md px-3 py-2 text-sm font-bold text-muted-foreground"}>{copy.login}</button>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{authMode === "signup" ? copy.signupIntro : copy.loginIntro}</p>
            <label className="grid gap-2 text-sm font-bold text-foreground">
              {copy.email}
              <input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-foreground">
              {copy.password}
              <input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={copy.passwordPlaceholder} />
            </label>
            {authMode === "signup" ? (
              <label className="grid gap-2 text-sm font-bold text-foreground">
                {copy.confirmPassword}
                <input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm outline-none focus:border-primary" type="password" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} placeholder={copy.repeatPassword} />
              </label>
            ) : null}
            <p className={passwordReady || !password ? "text-xs text-muted-foreground" : "text-xs font-bold text-destructive"}>{authMode === "signup" ? copy.passwordHelp : copy.loginHelp}</p>
            <Button disabled={busy || !email.trim() || !passwordReady} onClick={submitAuth}>{authMode === "signup" ? <Mail size={16} /> : <LogIn size={16} />}{authMode === "signup" ? copy.createAccount : copy.login}</Button>
          </>
        ) : !confirmed ? (
          <div className="rounded-md border border-border bg-muted/35 p-3 text-sm leading-6 text-muted-foreground">{copy.unconfirmed}</div>
        ) : !profile ? (
          <>
            <div className="rounded-md border border-primary/25 bg-primary/5 p-3 text-sm leading-6 text-muted-foreground">{copy.emailConfirmed}</div>
            <label className="grid gap-2 text-sm font-bold text-foreground">
              {copy.habid}
              <input className="h-11 rounded-md border border-border bg-background/60 px-3 text-sm lowercase outline-none focus:border-primary" value={habidInput} onChange={(event) => setHabidInput(event.target.value)} placeholder="your_habid" />
            </label>
            {habidInput ? <p className={habidValidation.valid ? "text-xs font-bold text-primary" : "text-xs font-bold text-destructive"}>{habidValidation.valid ? `${copy.availableFormat}: @${habidValidation.habid}` : habidValidation.error}</p> : <p className="text-xs text-muted-foreground">{copy.habidHelp}</p>}
            <Button disabled={busy || !habidValidation.valid} onClick={createProfile}><UserRound size={16} />{copy.createHabid}</Button>
          </>
        ) : (
          <>
            <div className="rounded-md border border-border bg-muted/35 p-3">
              <p className="text-sm font-black text-foreground">@{profile.habid}</p>
              <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
            </div>
            {cloudLoaded && cloudState && !syncEnabled ? (
              <div className="grid gap-2 rounded-md border border-primary/25 bg-primary/5 p-3 text-sm">
                <p className="font-bold text-foreground">{copy.accountProgressFound}</p>
                <p className="text-xs text-muted-foreground">{copy.updated} {new Date(cloudState.updated_at).toLocaleString()}.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button variant="outline" disabled={busy} onClick={useCloudProgress}>{copy.useAccountProgress}</Button>
                  <Button disabled={busy} onClick={async () => { if (await saveLocalProgress()) setSyncEnabled(true); }}><Save size={16} />{copy.keepDeviceProgress}</Button>
                </div>
              </div>
            ) : null}
            {cloudLoaded && !cloudState ? <div className="rounded-md border border-primary/25 bg-primary/5 p-3 text-sm font-bold text-foreground">{copy.syncActive}</div> : null}
            {cloudLoaded && cloudState && syncEnabled ? <div className="rounded-md border border-primary/25 bg-primary/5 p-3 text-sm font-bold text-foreground">{copy.syncActive}</div> : null}
            <Button variant="outline" disabled={busy} onClick={signOut}><LogOut size={16} />{copy.logout}</Button>
          </>
        )}
        {message ? <p className="rounded-md border border-border bg-background/45 p-3 text-sm text-muted-foreground">{message}</p> : null}
      </CardContent>
    </Card>
  );
}
