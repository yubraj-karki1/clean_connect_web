"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, Wrench, Sparkles } from "lucide-react";

export default function RegisterSelectionPage() {
  return (
    <div className="min-h-screen flex bg-[#020617] text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[120px] animate-blob" />
      <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-[120px] animate-blob animation-delay-2000" />

      <div className="flex w-full items-center justify-center px-6 py-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-teal-500/5 blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-xl space-y-6 animate-fade-in-up">
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
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 sm:p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-teal-400/20 blur-2xl scale-150" />
                <Image
                  src="/images/cleanconnect.png"
                  alt="CleanConnect"
                  width={72}
                  height={72}
                  className="relative rounded-xl shadow-2xl shadow-teal-500/20"
                />
              </div>
            </div>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Join{" "}
                <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  CleanConnect
                </span>
              </h2>
              <p className="text-sm text-gray-400">
                Choose how you want to get started
              </p>
            </div>

            {/* Role cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Card */}
              <Link
                href="/register/customer"
                className="group relative flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-teal-400/40 hover:bg-teal-400/5 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/20 transition-all duration-300 group-hover:scale-110 group-hover:border-teal-400/40">
                  <User size={28} className="text-teal-400" />
                </div>
                <div className="text-center space-y-1.5">
                  <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
                    Customer
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Book trusted cleaners for your home or office in seconds
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400 group-hover:border-teal-400/30 group-hover:text-teal-400 transition-all">
                  <Sparkles size={12} />
                  Get Started
                </span>
              </Link>

              {/* Worker Card */}
              <Link
                href="/register/worker"
                className="group relative flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/5 hover:shadow-[0_0_30px_rgba(52,211,153,0.1)]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-400/40">
                  <Wrench size={28} className="text-emerald-400" />
                </div>
                <div className="text-center space-y-1.5">
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    Worker
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Join our team of professional cleaners and earn on your schedule
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400 group-hover:border-emerald-400/30 group-hover:text-emerald-400 transition-all">
                  <Sparkles size={12} />
                  Join Team
                </span>
              </Link>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-teal-400 transition-colors hover:text-teal-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}