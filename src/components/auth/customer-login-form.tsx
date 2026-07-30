"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/auth/otp-input";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export function CustomerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<"password" | "otp">("password");
  const [step, setStep] = useState<"form" | "otp_verify">("form");
  const [isVerifying, setIsVerifying] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/customer/onboarding";

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (otpError) {
      setError(otpError.message);
      setIsLoading(false);
      return;
    }

    setStep("otp_verify");
    setIsLoading(false);
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsVerifying(true);
    setError(null);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
      setIsVerifying(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleResendOtp = async () => {
    setError(null);
    const { error: resendError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (resendError) {
      setError(resendError.message);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setIsGoogleLoading(false);
    }
  };

  // --- OTP Verification Step ---
  if (step === "otp_verify") {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setStep("form")}
          className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
            <Mail className="h-6 w-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Check your email
          </h3>
          <p className="text-sm text-slate-400">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-slate-200">{email}</span>
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <OtpInput onComplete={handleVerifyOtp} disabled={isVerifying} />

        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying…
          </div>
        )}

        <p className="text-center text-sm text-slate-400">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            className="font-medium text-amber-400 transition-colors hover:text-amber-300"
          >
            Resend
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={method === "password" ? handleEmailLogin : handleSendOtp} className="space-y-5">
      {/* Error display */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      {/* Auth callback error */}
      {searchParams.get("error") === "auth_callback_failed" && !error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Authentication failed. Please try again.
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-300">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/30"
          />
        </div>
      </div>

      {/* Password */}
      {method === "password" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-slate-300"
            >
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="h-11 border-white/10 bg-white/5 pl-10 pr-10 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading || isGoogleLoading}
        className="h-11 w-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:from-amber-400 hover:to-orange-500 hover:shadow-amber-500/40 active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {method === "password" ? "Signing in…" : "Sending OTP…"}
          </>
        ) : method === "password" ? (
          "Sign In"
        ) : (
          "Send OTP"
        )}
      </Button>

      {/* Method Switch */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setMethod(method === "password" ? "otp" : "password")}
          className="text-sm font-medium text-amber-400 transition-colors hover:text-amber-300"
        >
          {method === "password" ? "Sign in with OTP instead" : "Sign in with Password instead"}
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-white/10" />
        <span className="mx-4 text-xs text-slate-500">or continue with</span>
        <div className="flex-grow border-t border-white/10" />
      </div>

      {/* Google OAuth */}
      <Button
        type="button"
        variant="outline"
        disabled={isLoading || isGoogleLoading}
        onClick={handleGoogleLogin}
        className="h-11 w-full border-white/10 bg-white/5 text-white transition-all duration-300 hover:bg-white/10 hover:text-white"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Sign in with Google
      </Button>

      {/* Switch to signup */}
      <p className="text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/customer/signup"
          className="font-medium text-amber-400 transition-colors hover:text-amber-300"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
