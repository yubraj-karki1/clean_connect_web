"use client";

import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setError("");
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-cyan-100 via-sky-100 to-teal-200">

      {/* Background Blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-teal-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-cyan-300 rounded-full blur-3xl opacity-30" />

      {/* Login Card */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-10">

        {/* Back */}
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-2 text-sm text-blue-500 mb-8 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600">
            CleanConnect
          </h1>
          <p className="text-base text-gray-500 mt-2">
            Welcome back! Please login to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-5 text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="mb-6">
          <label className="block text-base font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="flex items-center border rounded-xl px-4 py-1 focus-within:border-blue-400">
            <Mail size={20} className="text-blue-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 outline-none text-black text-base bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block text-base font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="flex items-center border rounded-xl px-4 py-1 focus-within:border-blue-400">
            <Lock size={20} className="text-blue-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 outline-none text-black text-base bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-8">
          <span
            onClick={() => router.push("/forgot-password")}
            className="text-sm text-teal-600 cursor-pointer hover:underline"
          >
            Forgot password?
          </span>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition shadow-lg"
        >
          Sign In
        </button>

        {/* Register */}
        <p className="text-center text-base text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-teal-600 font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
