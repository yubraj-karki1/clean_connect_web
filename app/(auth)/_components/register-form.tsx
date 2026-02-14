"use client";

import { useEffect, useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { RegisterData, registerSchema } from "../schema";
import { handleRegister } from "@/lib/actions/auth-action";

const LOGIN_PATH = "/login"; // ✅ change if your login route is different

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Validation Errors:", errors);
    }
  }, [errors]);

  const onSubmit = (values: RegisterData) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const response = await handleRegister(values);

        if (!response?.success) {
          setError(response?.message || "Registration failed");
          return;
        }

        // ✅ success in GREEN (will be visible if redirect fails)
        setSuccess("Registration successful. Redirecting...");

        // ✅ redirect immediately
        router.replace(LOGIN_PATH);

        // ✅ fallback (if router navigation is blocked for any reason)
        setTimeout(() => {
          window.location.assign(LOGIN_PATH);
        }, 100);
      } catch (err: any) {
        setError(err?.message || "Registration failed");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-10">
      <div className="w-full max-w-[480px] bg-[#161616] rounded-[40px] p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00f2ea] mb-2">
            Create Account
          </h1>
          <p className="text-sm text-gray-300">
            Already have an account?{" "}
            <Link href={LOGIN_PATH} className="text-[#00c9c2] hover:underline">
              Login
            </Link>
          </p>

          {/* Error */}
          {error && !success && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* ✅ Success (GREEN) */}
          {success && (
            <div className="mt-4 p-3 bg-green-600/10 border border-green-600/50 rounded-xl text-green-400 text-sm">
              {success}
            </div>
          )}
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div>
            <input
              {...register("fullName")}
              placeholder="Yubraj Karki"
              className="w-full rounded-2xl border border-gray-700 bg-transparent px-5 py-3.5 text-white outline-none focus:border-[#00f2ea]"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="you@gmail.com"
              className="w-full rounded-2xl border border-gray-700 bg-transparent px-5 py-3.5 text-white outline-none focus:border-[#00f2ea]"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              {...register("phoneNumber")}
              type="tel"
              placeholder="9800000000"
              className="w-full rounded-2xl border border-gray-700 bg-transparent px-5 py-3.5 text-white outline-none focus:border-[#00f2ea]"
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <input
              {...register("address")}
              placeholder="Kathmandu"
              className="w-full rounded-2xl border border-gray-700 bg-transparent px-5 py-3.5 text-white outline-none focus:border-[#00f2ea]"
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              className="w-full rounded-2xl border border-gray-700 bg-transparent px-5 py-3.5 pr-12 text-white outline-none focus:border-[#00f2ea]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full rounded-2xl border border-gray-700 bg-transparent px-5 py-3.5 pr-12 text-white outline-none focus:border-[#00f2ea]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-3 pt-2">
            <input
              {...register("terms")}
              type="checkbox"
              className="w-5 h-5 accent-[#00f2ea]"
            />
            <span className="text-sm text-gray-300">
              I accept the terms and conditions
            </span>
          </div>
          {errors.terms && (
            <p className="text-xs text-red-500">{errors.terms.message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || isPending}
            className="flex items-center justify-center w-full bg-gradient-to-r from-[#00c5bc] to-[#2c8eff] text-white font-bold py-4 rounded-2xl text-xl disabled:opacity-60"
          >
            {isSubmitting || isPending ? (
              <Loader2 className="animate-spin" size={26} />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
