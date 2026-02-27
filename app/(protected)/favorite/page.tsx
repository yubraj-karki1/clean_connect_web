"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Home, Calendar, User, Trash, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FavoritePage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const favs = localStorage.getItem("favorites");
      if (favs) setFavorites(JSON.parse(favs));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const nextTheme = saved === "dark" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  const applyTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const removeFavorite = (name: string) => {
    const updated = favorites.filter((f) => f.name !== name);
    setFavorites(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_#d1fae5_0%,_#ecfeff_35%,_#f8fafc_70%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_#0f172a_0%,_#111827_45%,_#020617_100%)] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-700/20" />
        <div className="absolute right-0 top-52 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl dark:bg-cyan-700/20" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <div onClick={() => router.push("/dashboard")} className="flex cursor-pointer items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-200 to-cyan-100 shadow-sm ring-1 ring-white">
              <Image src="/images/cleanconnect.png" alt="CleanConnect Logo" fill className="object-contain p-1" sizes="40px" priority />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">CleanConnect</span>
          </div>

          <nav className="hidden items-center gap-2 text-sm md:flex">
            <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <Home size={16} /> Home
            </button>
            <button onClick={() => router.push("/booking")} className="flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <Calendar size={16} /> Bookings
            </button>
            <button onClick={() => router.push("/favorite")} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 px-4 py-2 font-semibold text-emerald-800 ring-1 ring-emerald-200/80 dark:from-emerald-900/60 dark:to-cyan-900/60 dark:text-emerald-200 dark:ring-emerald-700/70">
              <Heart size={16} /> Favorites
            </button>
            <button onClick={() => router.push("/profile")} className="flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <User size={16} /> Profile
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-slate-200 bg-white/80 p-1 dark:border-slate-700 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => applyTheme("light")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme === "light" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"}`}
              >
                <span className="inline-flex items-center gap-1"><Sun size={14} /> Day</span>
              </button>
              <button
                type="button"
                onClick={() => applyTheme("dark")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme === "dark" ? "bg-emerald-900/60 text-emerald-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"}`}
              >
                <span className="inline-flex items-center gap-1"><Moon size={14} /> Night</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => router.push("/booking")}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:from-emerald-600 hover:to-teal-600"
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      <section className="relative z-10 w-full px-4 py-10 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-emerald-100/80 bg-white/85 p-6 shadow-lg shadow-emerald-100/50 backdrop-blur sm:p-8 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-slate-900/50">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">My Favorites</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Your saved cleaners and services</p>
          <div className="mt-5 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 px-4 py-1.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200/80 dark:from-emerald-900/60 dark:to-cyan-900/60 dark:text-emerald-200 dark:ring-emerald-700/70">
            {favorites.length} saved cleaner{favorites.length === 1 ? "" : "s"}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-10 rounded-3xl border border-white/80 bg-white/85 p-8 text-center text-slate-600 shadow dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-300">
            Loading your favorites...
          </div>
        ) : favorites.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/90 p-10 text-center shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/75">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100">
              <Heart size={28} className="text-emerald-700" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-slate-100">No favorites yet</h2>
            <p className="mt-2 max-w-md text-slate-600 dark:text-slate-300">
              Save your favorite cleaners to quickly book them again.
              <br />
              Browse our featured cleaners to get started.
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:from-emerald-600 hover:to-teal-600"
            >
              Browse Cleaners
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((fav, idx) => (
              <article
                key={fav.name || idx}
                className="group relative overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/60 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-slate-900/50 dark:hover:shadow-cyan-900/40"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300" />

                <div className="mb-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-emerald-100 ring-1 ring-emerald-200">
                    <img src={fav.image} alt={fav.name} className="h-full w-full rounded-xl object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{fav.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{fav.specialty}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFavorite(fav.name)}
                    className="ml-2 rounded-full bg-rose-50 p-2 transition hover:bg-rose-100"
                    title="Remove from favorites"
                  >
                    <Trash size={18} className="text-red-500" />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Rating:</span> {fav.rating} ({fav.reviews} reviews)
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Price:</span> ${fav.price}/hr
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-white/80 bg-white/80 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/70">
        <div className="w-full px-4 py-12 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-200 to-cyan-100">
                  <Image src="/images/cleanconnect.png" alt="CleanConnect Logo" fill className="object-contain p-1" sizes="40px" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">CleanConnect</span>
              </div>

              <p className="mt-4 max-w-xs text-sm text-slate-600 dark:text-slate-300">Your trusted partner for professional cleaning services.</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">Services</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><Link href="/booking" className="hover:text-emerald-600">Home Cleaning</Link></li>
                <li><Link href="/booking" className="hover:text-emerald-600">Office Cleaning</Link></li>
                <li><Link href="/booking" className="hover:text-emerald-600">Deep Cleaning</Link></li>
                <li><Link href="/booking" className="hover:text-emerald-600">Move-in/out</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><Link href="/about" className="hover:text-emerald-600">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-emerald-600">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-600">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-600">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">Support</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li><Link href="/help" className="hover:text-emerald-600">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-600">Terms of Service</Link></li>
                <li><Link href="/faqs" className="hover:text-emerald-600">FAQs</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            (c) 2024 CleanConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
