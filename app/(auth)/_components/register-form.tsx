"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";

import { RegisterData, registerSchema } from "../schema";
import { handleRegister } from "@/lib/actions/auth-action";

const LOGIN_PATH = "/login";

interface RegisterPageProps {
  role?: "user" | "worker";
}

export default function RegisterPage({ role = "user" }: RegisterPageProps) {
  const router = useRouter();

  const isWorker = role === "worker";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      role,
    },
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

        setSuccess("Registration successful. Redirecting...");
        router.replace(LOGIN_PATH);

        setTimeout(() => {
          window.location.assign(LOGIN_PATH);
        }, 100);
      } catch (err: any) {
        setError(err?.message || "Registration failed");
      }
    });
  };

  /* Helper to build input wrapper classes */
  const inputWrapperClass = (fieldName: string) =>
    `flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-300 ${
      errors[fieldName as keyof typeof errors]
        ? "border-red-500/60 bg-red-500/5"
        : focusedField === fieldName
        ? "border-teal-400/50 bg-teal-400/5 shadow-[0_0_20px_rgba(45,212,191,0.08)]"
        : "border-white/10 bg-white/[0.03] hover:border-white/20"
    }`;

  const iconClass = (fieldName: string) =>
    `shrink-0 transition-colors duration-300 ${
      focusedField === fieldName ? "text-teal-400" : "text-gray-500"
    }`;

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
              {isWorker
                ? "Join our team of professional cleaners — earn on your own schedule."
                : "Join thousands of happy customers — book trusted cleaners in seconds."}
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {(isWorker
              ? [
                  { icon: Sparkles, label: "Flexible Schedule" },
                  { icon: ShieldCheck, label: "Secure Payments" },
                ]
              : [
                  { icon: Sparkles, label: "Instant Booking" },
                  { icon: ShieldCheck, label: "Verified Cleaners" },
                ]
            ).map(({ icon: Icon, label }) => (
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
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-10 relative">
        {/* Subtle glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md space-y-6 animate-fade-in-up">
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
            <div className="flex justify-center lg:hidden mb-5">
              <Image
                src="/images/cleanconnect.png"
                alt="CleanConnect"
                width={56}
                height={56}
                className="rounded-xl"
              />
            </div>

            <div className="text-center space-y-1 mb-6">
              <h2 className="text-2xl font-bold tracking-tight">
                {isWorker ? "Register as a Worker" : "Create your account"}
              </h2>
              <p className="text-sm text-gray-400">
                {isWorker
                  ? "Sign up to start accepting cleaning jobs"
                  : "Fill in your details to get started"}
              </p>
            </div>

            {/* Error */}
            {error && !success && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-shake">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-sm font-bold">
                  !
                </div>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                <CheckCircle2 size={20} className="shrink-0" />
                {success}
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Hidden role field */}
              <input type="hidden" {...register("role")} />

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className={inputWrapperClass("fullName")}>
                  <User size={18} className={iconClass("fullName")} />
                  <input
                    {...register("fullName")}
                    placeholder="John Doe"
                    onFocus={() => setFocusedField("fullName")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent text-white outline-none placeholder:text-gray-600 text-sm"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-400 pl-1 animate-fade-in">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className={inputWrapperClass("email")}>
                  <Mail size={18} className={iconClass("email")} />
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

              {/* Phone & Address — side by side on wider screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">
                    Phone
                  </label>
                  <div className={inputWrapperClass("phoneNumber")}>
                    <Phone size={18} className={iconClass("phoneNumber")} />
                    <input
                      {...register("phoneNumber")}
                      type="tel"
                      placeholder="9800000000"
                      onFocus={() => setFocusedField("phoneNumber")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent text-white outline-none placeholder:text-gray-600 text-sm"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-400 pl-1 animate-fade-in">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">
                    Address
                  </label>
                  <div className={inputWrapperClass("address")}>
                    <MapPin size={18} className={iconClass("address")} />
                    <input
                      {...register("address")}
                      placeholder="Kathmandu"
                      onFocus={() => setFocusedField("address")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent text-white outline-none placeholder:text-gray-600 text-sm"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-xs text-red-400 pl-1 animate-fade-in">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className={inputWrapperClass("password")}>
                  <Lock size={18} className={iconClass("password")} />
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
                    onClick={() => setShowPassword((s) => !s)}
                    className="shrink-0 text-gray-500 transition-colors hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 pl-1 animate-fade-in">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className={inputWrapperClass("confirmPassword")}>
                  <Lock size={18} className={iconClass("confirmPassword")} />
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-transparent text-white outline-none placeholder:text-gray-600 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="shrink-0 text-gray-500 transition-colors hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 pl-1 animate-fade-in">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 pt-1 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    {...register("terms")}
                    type="checkbox"
                    className="peer sr-only"
                  />
                  <div className="h-5 w-5 rounded-md border border-white/20 bg-white/[0.03] transition-all peer-checked:border-teal-400 peer-checked:bg-teal-400/20 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-400/40" />
                  <CheckCircle2
                    size={14}
                    className="absolute inset-0 m-auto text-teal-400 opacity-0 peer-checked:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-snug">
                  I accept the{" "}
                  <span className="text-teal-400 hover:text-teal-300 cursor-pointer">
                    Terms & Conditions
                  </span>
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-400 pl-1 animate-fade-in">
                  {errors.terms.message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 py-3.5 font-semibold text-white shadow-lg shadow-teal-500/20 transition-all duration-300 hover:shadow-teal-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 mt-2"
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting || isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    "Create Account"
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Sign in */}
            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href={LOGIN_PATH}
                className="font-medium text-teal-400 transition-colors hover:text-teal-300"
              >
                Sign in
              </Link>
            </p>

            {/* Switch role */}
            <p className="text-center text-sm text-gray-400">
              {isWorker ? (
                <>
                  Want to book a cleaner?{" "}
                  <Link
                    href="/register/customer"
                    className="font-medium text-teal-400 transition-colors hover:text-teal-300"
                  >
                    Register as Customer
                  </Link>
                </>
              ) : (
                <>
                  Want to work as a cleaner?{" "}
                  <Link
                    href="/register/worker"
                    className="font-medium text-teal-400 transition-colors hover:text-teal-300"
                  >
                    Register as Worker
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-600">
            By creating an account, you agree to our{" "}
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
