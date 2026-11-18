"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { accountHomePath } from "@backend/lib/roles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";

export function AuthForm({ signup = false }: { signup?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const values = new FormData(e.currentTarget);
    const email = values.get("email") as string;
    const password = values.get("password") as string;
    try {
      if (signup) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error.message);
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error)
        throw new Error("Could not sign in. Check your email and password, or try again in a minute.");
      router.refresh();
      const session =
        (await getSession()) ??
        (await fetch("/api/auth/session", { cache: "no-store" }).then((r) => r.json()));
      router.push(accountHomePath(session?.user?.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} noValidate={false}>
        <label>
          <span>Email address</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            maxLength={254}
            disabled={busy}
          />
          <p className="field-hint">We’ll use this to sign you in. No spam, ever.</p>
        </label>
        <label>
          <span>Password</span>
          <div className="password-wrap">
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete={signup ? "new-password" : "current-password"}
              minLength={12}
              maxLength={72}
              placeholder={signup ? "At least 12 characters" : "Your password"}
              disabled={busy}
            />
            <button
              className="password-toggle"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="field-hint">
            {signup
              ? "Use 12+ characters with a mix of letters, numbers, or symbols."
              : "Forgot your password? Sign in with the password you chose at sign-up."}
          </p>
        </label>
        <button className="button dark block" type="submit" disabled={busy}>
          {busy ? (
            <>
              <LoaderCircle size={17} className="spin" aria-hidden />
              {signup ? "Creating your account…" : "Signing you in…"}
            </>
          ) : (
            <>
              {signup ? "Create your account" : "Sign in"}
              <ArrowRight size={17} aria-hidden />
            </>
          )}
        </button>
      </form>
      {error && (
        <div className="message error" role="alert">
          {error}
        </div>
      )}
      <p className="auth-switch">
        {signup ? "Already have an account?" : "New here?"}{" "}
        <Link href={signup ? "/signin" : "/signup"}>{signup ? "Sign in instead" : "Create a free account"}</Link>
      </p>
    </>
  );
}