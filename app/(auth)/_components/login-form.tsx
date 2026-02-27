"use client";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";

import { LoginData, loginSchema } from "../schema";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginData) => {
    setError(null);
    setLoading(true);

    try {
      const data = await login(values);

      if (!data.success) {
        throw new Error(data.message || "Invalid credentials");
      }

      document.cookie = `auth_token=${data.token}; path=/`;
      document.cookie = `user_data=${JSON.stringify(data.data)}; path=/`;
      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `role=${data.data.role}; path=/`;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        // Store name for dashboard greeting
        sessionStorage.setItem("flash_name", data.data.fullName || data.data.email?.split("@")[0] || "User");
        sessionStorage.setItem("flash_success", "Login successful!");
      }

      const role = data.data.role;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "worker") {
        router.push("/worker/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-white overflow-hidden">
      {/* ── Left branding panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center px-12 overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[120px] animate-blob" />
        <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[100px] animate-blob animation-delay-4000" />

        {/* Decorative grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center space-y-8 max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-teal-400/20 blur-2xl scale-150" />
              <Image
                src="/images/cleanconnect.png"
                alt="CleanConnect"
                width={120}
                height={120}
                className="relative rounded-2xl shadow-2xl shadow-teal-500/20"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                CleanConnect
              </span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Your trusted platform for seamless cleaning services — book,
              manage, and relax.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { icon: Sparkles, label: "Instant Booking" },
              { icon: ShieldCheck, label: "Verified Cleaners" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm"
              >
                <Icon size={14} className="text-teal-400" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 relative">
        {/* Subtle glow behind the card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md space-y-8 animate-fade-in-up">
          {/* Back link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-teal-400"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back to home
          </Link>

          {/* Card */}
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            {/* Mobile logo */}
            <div className="flex justify-center lg:hidden mb-6">
              <Image
                src="/images/cleanconnect.png"
                alt="CleanConnect"
                width={56}
                height={56}
                className="rounded-xl"
              />
            </div>

            <div className="text-center space-y-1 mb-8">
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back
              </h2>
              <p className="text-sm text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-shake">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                  !
                </div>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-300
                    ${
                      errors.email
                        ? "border-red-500/60 bg-red-500/5"
                        : focusedField === "email"
                        ? "border-teal-400/50 bg-teal-400/5 shadow-[0_0_20px_rgba(45,212,191,0.08)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                >
                  <Mail
                    size={18}
                    className={`shrink-0 transition-colors duration-300 ${
                      focusedField === "email"
                        ? "text-teal-400"
                        : "text-gray-500"
                    }`}
                  />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent text-white outline-none placeholder:text-gray-600 text-sm"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 pl-1 animate-fade-in">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-300
                    ${
                      errors.password
                        ? "border-red-500/60 bg-red-500/5"
                        : focusedField === "password"
                        ? "border-teal-400/50 bg-teal-400/5 shadow-[0_0_20px_rgba(45,212,191,0.08)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                >
                  <Lock
                    size={18}
                    className={`shrink-0 transition-colors duration-300 ${
                      focusedField === "password"
                        ? "text-teal-400"
                        : "text-gray-500"
                    }`}
                  />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent text-white outline-none placeholder:text-gray-600 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-gray-500 transition-colors hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 pl-1 animate-fade-in">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <Link
                  href="/forget-password"
                  className="text-sm text-gray-400 transition-colors hover:text-teal-400"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-teal-500/20 transition-all duration-300 hover:shadow-teal-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100"
              >
                {/* Hover shimmer */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Sign up */}
            <p className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-teal-400 transition-colors hover:text-teal-300"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-gray-600">
            By signing in, you agree to our{" "}
            <span className="text-gray-400 hover:text-gray-300 cursor-pointer">
              Terms of Service
            </span>{" "}
            &{" "}
            <span className="text-gray-400 hover:text-gray-300 cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
