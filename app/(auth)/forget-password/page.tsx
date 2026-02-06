"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/lib/api/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, Mail } from "lucide-react";

export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetDTO>({
    resolver: zodResolver(RequestPasswordResetSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: RequestPasswordResetDTO) => {
    try {
      const response = await requestPasswordReset(data.email);
      if (response.success) toast.success(response.message || "Reset link sent!");
      else toast.error(response.message || "Failed to send reset link.");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_16px_60px_rgba(0,0,0,0.65)]">
          {/* Header */}
          <div className="text-center">
            <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-white">
              Reset your password
            </h1>

            <p className="mt-3 text-sm text-white/70">
              Enter your email and we’ll send you a reset link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email address
              </label>

              <div
                className={[
                  "flex items-center gap-2 rounded-xl border px-4 py-3 bg-black/40",
                  "focus-within:ring-4 transition",
                  errors.email
                    ? "border-red-500/60 focus-within:ring-red-500/10"
                    : "border-white/10 focus-within:border-teal-400/40 focus-within:ring-teal-400/10",
                ].join(" ")}
              >
                <Mail className="h-5 w-5 text-white/50" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full bg-transparent text-white placeholder:text-white/35 outline-none"
                />
              </div>

              {errors.email && (
                <p className="text-red-300 text-sm mt-2">{errors.email.message}</p>
              )}

              <p className="text-xs text-white/55 mt-2">
                Check spam/junk if you don’t see the email.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={[
                "w-full rounded-xl py-3 font-semibold text-black",
                "bg-teal-300 hover:bg-teal-200 transition",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending…
                </span>
              ) : (
                "Send reset link"
              )}
            </button>

            {/* Footer links */}
            <div className="pt-1 text-center text-sm text-white/70">
              <div className="flex items-center justify-center gap-2">
                <span>Remembered your password?</span>
                <Link href="/login" className="text-teal-200 font-semibold hover:underline">
                  Log in
                </Link>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span>Don’t have an account?</span>
                <Link href="/register" className="text-white font-semibold hover:underline">
                  Create one
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-xs text-white/55 text-center">
                If the link expires, request a new one.
              </p>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/55">
          Need help? Make sure you entered the correct email.
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
