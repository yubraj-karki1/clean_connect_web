import Link from "next/link";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["600", "700", "800"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function HomePage() {
  return (
    <main className={`${jakarta.className} relative min-h-screen overflow-hidden bg-[#05070d] text-slate-100`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(20,184,166,0.20),transparent_42%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.16),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(34,211,238,0.14),transparent_46%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:linear-gradient(rgba(148,163,184,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.18)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-20 sm:px-8 lg:px-12">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-12 lg:p-16">
          <p className="mb-5 inline-flex items-center rounded-full border border-teal-300/25 bg-teal-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">
            Smart Home Cleaning
          </p>

          <h1 className={`${sora.className} max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl`}>
            Clean spaces, zero stress. Book trusted cleaners in minutes.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            CleanConnect helps you schedule, manage, and track cleaning services with transparent pricing and verified professionals.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-teal-400 to-sky-500 px-8 text-base font-bold text-slate-950 shadow-[0_14px_40px_rgba(45,212,191,0.35)] transition hover:scale-[1.02] hover:shadow-[0_18px_48px_rgba(56,189,248,0.35)]"
            >
              Get Started
            </Link>
            <Link
              href="/register"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/[0.03] px-8 text-base font-semibold text-white transition hover:border-teal-200/70 hover:bg-white/[0.08]"
            >
              Create Account
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
