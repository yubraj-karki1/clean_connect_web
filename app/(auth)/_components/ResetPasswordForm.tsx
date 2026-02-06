"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordDTO>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onSubmit",
  });

  const router = useRouter();

  const onSubmit = async (data: ResetPasswordDTO) => {
    try {
      const response = await handleResetPassword(token, data.password);
      if (response.success) {
        toast.success("Password reset successfully");
        router.replace("/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_16px_60px_rgba(0,0,0,0.65)]">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center">
              <Lock className="h-6 w-6 text-teal-200" />
            </div>

            <p className="mt-4 inline-flex items-center rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-teal-200">
              PASSWORD RESET
            </p>

            <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-white">
              Create a new password
            </h1>

            <p className="mt-3 text-sm text-white/70">
              Choose a strong password and confirm it to finish.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                New Password
              </label>
              <input
                type="password"
                {...register("password")}
                className={[
                  "w-full rounded-xl border px-4 py-3 bg-black/40 text-white placeholder:text-white/35 outline-none",
                  "focus-within:ring-4 transition",
                  errors.password
                    ? "border-red-500/60 focus:ring-red-500/10"
                    : "border-white/10 focus:border-teal-400/40 focus:ring-teal-400/10",
                ].join(" ")}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-300 text-sm mt-2">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className={[
                  "w-full rounded-xl border px-4 py-3 bg-black/40 text-white placeholder:text-white/35 outline-none",
                  "focus-within:ring-4 transition",
                  errors.confirmPassword
                    ? "border-red-500/60 focus:ring-red-500/10"
                    : "border-white/10 focus:border-teal-400/40 focus:ring-teal-400/10",
                ].join(" ")}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-300 text-sm mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Links */}
            <div className="pt-1 text-center text-sm text-white/70">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <Link href="/login" className="text-teal-200 font-semibold hover:underline">
                  Back to Login
                </Link>
                <span className="hidden sm:inline text-white/40">•</span>
                <Link
                  href="/request-password-reset"
                  className="text-white font-semibold hover:underline"
                >
                  Request another reset email
                </Link>
              </div>
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
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>

            <p className="text-center text-xs text-white/55">
              Tip: use at least 8 characters for better security.
            </p>
          </form>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
