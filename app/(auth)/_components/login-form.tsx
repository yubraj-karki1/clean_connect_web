"use client";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { LoginData, loginSchema } from "../schema";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials");
      }

      document.cookie = `auth_token=${data.token}; path=/`;
      document.cookie = `user_data=${JSON.stringify(data.data)}; path=/`;
      // Also set token and role cookies for proxy.ts compatibility
      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `role=${data.data.role}; path=/`;

      data.data.role === "admin"
        ? router.push("/admin/dashboard")
        : router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 text-white">
      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] p-8 shadow-2xl border border-white/10">

        {/* Back */}
        <Link
          href="/"
          className="flex items-center gap-2 text-teal-400 text-sm mb-6 hover:underline"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-teal-400">
          CleanConnect
        </h1>
        <p className="text-center text-gray-400 mt-2 text-sm">
          Welcome back! Please login to continue
        </p>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email Address</label>
            <div className={`mt-2 flex items-center gap-3 rounded-xl border px-4 py-3 bg-black/40
              ${errors.email ? "border-red-500" : "border-white/20"}
            `}>
              <Mail size={18} className="text-teal-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none text-white placeholder:text-gray-500"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className={`mt-2 flex items-center gap-3 rounded-xl border px-4 py-3 bg-black/40
              ${errors.password ? "border-red-500" : "border-white/20"}
            `}>
              <Lock size={18} className="text-teal-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-white placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="text-right">
            <Link
              href="/forget-password"
              className="text-sm text-teal-400 hover:underline"
            >
              Forget password?
            </Link> 
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 font-semibold disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-teal-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
