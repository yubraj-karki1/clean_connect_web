"use client";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { LoginData, loginSchema } from "../schema";
import { handleLogin } from "@/lib/actions/auth-action";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (values: LoginData) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await handleLogin(values);

      if (!response.success) {
        throw new Error(response.message || "Invalid email or password");
      }

      // ✅ Success
      setSuccess("Welcome back!");

      // ⏳ Redirect after delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black text-white">

      {/* Background Effects */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gray-800 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-gray-900 rounded-full blur-3xl opacity-30 animate-pulse" />

      {/* Login Card */}
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 z-10 border border-white/10">

        {/* Back */}
        <Link
          href="/home"
          className="flex items-center gap-2 text-sm text-teal-400 mb-8 hover:text-teal-500 w-fit"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-teal-400">
            CleanConnect
          </h1>
          <p className="text-gray-300 mt-2">
            Welcome back! Please login to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/50 text-green-500 text-sm text-center flex items-center justify-center gap-2">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div
              className={`flex items-center border rounded-xl px-4 bg-black/20 focus-within:border-teal-400 ${
                errors.email ? "border-red-500" : "border-gray-600"
              }`}
            >
              <Mail size={20} className="text-teal-400" />
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-transparent outline-none text-white"
              />
            </div>
            {errors.email?.message && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div
              className={`flex items-center border rounded-xl px-4 bg-black/20 focus-within:border-teal-400 ${
                errors.password ? "border-red-500" : "border-gray-600"
              }`}
            >
              <Lock size={20} className="text-teal-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-transparent outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password?.message && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-teal-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-4 rounded-xl text-lg font-semibold disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-gray-300 mt-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-teal-400 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
