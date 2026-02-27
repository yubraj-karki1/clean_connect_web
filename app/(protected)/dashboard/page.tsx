"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BookCleaningModal from "../booking/BookCleaningModal";
import Image from "next/image";
import {
  Home,
  Calendar,
  Heart,
  User,
  Gift,
  Search,
  SlidersHorizontal,
  CheckCircle,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { getServices } from "@/lib/api/booking";
import { handleLogout } from "@/lib/actions/auth-action";

/* Emoji mapping for service titles */
const serviceEmojis: Record<string, string> = {
  home: "🏠",
  office: "🏢",
  carpet: "🧽",
  deep: "✨",
  window: "🪟",
  move: "📦",
};

function getEmoji(title: string) {
  const lower = title.toLowerCase();
  for (const [k, v] of Object.entries(serviceEmojis)) {
    if (lower.includes(k)) return v;
  }
  return "🧹";
}

const featuredCleaners = [
  {
    name: "Sarah Johnson",
    specialty: "Home & Deep Cleaning",
    price: 35,
    rating: 4.9,
    reviews: 127,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Michael Chen",
    specialty: "Office Cleaning Expert",
    price: 40,
    rating: 4.8,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Emily Rodriguez",
    specialty: "Carpet & Window Specialist",
    price: 38,
    rating: 4.9,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "David Kim",
    specialty: "Move-in/out Cleaning",
    price: 45,
    rating: 4.7,
    reviews: 84,
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
  },
];


export default function DashboardPage() {
  const router = useRouter();

  const [flash, setFlash] = useState<string | null>(null);
  const [name, setName] = useState("Guest");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("");
  const [apiServices, setApiServices] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTarget, setSearchTarget] = useState<"all" | "services" | "cleaners">("all");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Flash message
  useEffect(() => {
    const msg = sessionStorage.getItem("flash_success");
    if (msg) {
      setFlash(msg);
      sessionStorage.removeItem("flash_success");
      const t = setTimeout(() => setFlash(null), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  // User name from sessionStorage or cookie
  useEffect(() => {
    const n = sessionStorage.getItem("flash_name");
    if (n) {
      setName(n);
      return;
    }
    // Fallback: read from user_data cookie
    try {
      const cookie = document.cookie.split("; ").find((c) => c.startsWith("user_data="));
      if (cookie) {
        const userData = JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("=")));
        if (userData.fullName) setName(userData.fullName);
        else if (userData.email) setName(userData.email.split("@")[0]);
      }
    } catch {}
  }, []);

  // Fetch services from API
  useEffect(() => {
    getServices()
      .then((res) => setApiServices(res.data || []))
      .catch(() => setApiServices([]));
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const favs = localStorage.getItem("favorites");
      if (favs) setFavorites(JSON.parse(favs));
    } catch {}
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

  const toggleFavorite = (cleaner: (typeof featuredCleaners)[0]) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.name === cleaner.name);
      const updated = exists
        ? prev.filter((f) => f.name !== cleaner.name)
        : [...prev, cleaner];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (cleanerName: string) =>
    favorites.some((f) => f.name === cleanerName);

  const query = searchQuery.trim().toLowerCase();

  const filteredServices = useMemo(() => {
    if (!query || searchTarget === "cleaners") return apiServices;
    return apiServices.filter((s: any) =>
      String(s?.title || "").toLowerCase().includes(query)
    );
  }, [apiServices, query, searchTarget]);

  const filteredCleaners = useMemo(() => {
    if (!query || searchTarget === "services") return featuredCleaners;
    return featuredCleaners.filter((c) =>
      `${c.name} ${c.specialty}`.toLowerCase().includes(query)
    );
  }, [query, searchTarget]);

  const onLogout = async () => {
    setLoggingOut(true);
    try { await handleLogout(); } catch {}
    document.cookie = "auth_token=; Max-Age=0; path=/";
    document.cookie = "user_data=; Max-Age=0; path=/";
    document.cookie = "token=; Max-Age=0; path=/";
    document.cookie = "role=; Max-Age=0; path=/";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_#d1fae5_0%,_#ecfeff_35%,_#f8fafc_70%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_#0f172a_0%,_#111827_45%,_#020617_100%)] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-700/20" />
        <div className="absolute right-0 top-52 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl dark:bg-cyan-700/20" />
      </div>
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <div
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-200 to-cyan-100 shadow-sm ring-1 ring-white">
              <Image
                src="/images/cleanconnect.png"
                alt="CleanConnect Logo"
                fill
                className="object-contain p-1"
                sizes="40px"
                priority
              />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">CleanConnect</span>
            </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 px-4 py-2 font-semibold text-emerald-800 ring-1 ring-emerald-200/80 dark:from-emerald-900/60 dark:to-cyan-900/60 dark:text-emerald-200 dark:ring-emerald-700/70"
            >
              <Home size={16} /> Home
            </button>

            <button
              type="button"
              onClick={() => router.push("/booking")}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Calendar size={16} /> Bookings
            </button>

            <button
              type="button"
              onClick={() => router.push("/favorite")}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Heart size={16} /> Favorites
            </button>

            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <User size={16} /> Profile
            </button>
          </nav>

          {/* Actions */}
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
            <button
              type="button"
              disabled={loggingOut}
              onClick={onLogout}
              className="flex items-center gap-2 rounded-full border border-rose-500 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-900/20"
            >
              <LogOut size={14} />
              {loggingOut ? "..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Flash message */}
      <section className="relative z-10 w-full px-4 pt-6 sm:px-6 lg:px-10">
        {flash && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/60 bg-emerald-50/90 px-4 py-3 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/30 dark:text-emerald-200">
            <CheckCircle size={18} />
            <span className="text-sm font-semibold">{flash}</span>
          </div>
        )}
      </section>

      {/* Hero */}
      <section className="relative z-10 w-full px-4 pt-6 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-200/60 dark:border-emerald-400/20 dark:from-emerald-700 dark:to-cyan-700 dark:shadow-cyan-900/40">
          <div className="p-10 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Hello, {name} 
              </h1>
              <p className="mt-3 text-white/90 text-base md:text-lg">
                Find your perfect cleaning service
              </p>

              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white/15 px-5 py-4 max-w-xl">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Gift size={22} />
                </div>
                <div>
                  <p className="font-semibold">Special Offer!</p>
                  <p className="text-sm text-white/90">
                    20% off on first booking
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="flex w-full items-center gap-2 rounded-2xl bg-white px-4 py-3 text-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
                  <Search size={18} className="text-slate-400 dark:text-slate-500" />
                  <input
                    placeholder="Search for cleaning service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>

                <div className="flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 dark:bg-slate-900/80 dark:text-slate-200">
                  <SlidersHorizontal size={18} />
                  <select
                    value={searchTarget}
                    onChange={(e) => setSearchTarget(e.target.value as "all" | "services" | "cleaners")}
                    className="bg-transparent text-sm outline-none dark:text-slate-200"
                    aria-label="Search options"
                  >
                    <option value="all">All</option>
                    <option value="services">Services</option>
                    <option value="cleaners">Cleaners</option>
                  </select>
                </div>
                {(searchQuery || searchTarget !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchTarget("all");
                    }}
                    className="rounded-2xl border border-white/60 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="hidden md:flex justify-end">
              <div className="grid grid-cols-2 gap-6">
                <div className="h-28 w-36 rounded-3xl bg-white/20 backdrop-blur-sm" />
                <div className="h-24 w-40 rounded-3xl bg-white/20 backdrop-blur-sm mt-8" />
                <div className="h-24 w-40 rounded-3xl bg-white/20 backdrop-blur-sm" />
                <div className="h-28 w-36 rounded-3xl bg-white/20 backdrop-blur-sm mt-6" />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        </div>
      </section>

      <section className="relative z-10 w-full px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Services</h2>
          <button
            type="button"
            onClick={() => router.push("/booking")}
            className="text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-300"
          >
            View All
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {apiServices.length > 0 ? filteredServices.map((s: any) => (
            <button
              key={s._id}
              type="button"
              onClick={() => {
                setSelectedService(s._id);
                setShowBookingModal(true);
              }}
              className="w-full rounded-3xl border border-white/90 bg-white/90 p-6 shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/60 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-slate-900/50 dark:hover:shadow-cyan-900/40"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-3xl ring-1 ring-emerald-200 dark:from-slate-800 dark:to-slate-700 dark:ring-slate-600">
                {getEmoji(s.title)}
              </div>
              <p className="text-center text-sm font-semibold text-slate-800 dark:text-slate-100">
                {s.title}
              </p>
            </button>
          )) : (
            /* Fallback placeholders while loading */
            [1,2,3,4,5,6].map((i) => (
              <div key={i} className="w-full animate-pulse rounded-3xl border border-white/90 bg-white/90 p-6 shadow dark:border-slate-700 dark:bg-slate-900/70">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800" />
                <div className="mx-auto mt-4 h-4 w-20 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            ))
          )}
        </div>
        {apiServices.length > 0 && filteredServices.length === 0 && (
          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">No services match your search.</p>
        )}

        {/* Book Cleaning Modal */}
        <BookCleaningModal open={showBookingModal} onClose={() => setShowBookingModal(false)} selectedService={selectedService} />
      </section>

      <section className="relative z-10 w-full px-4 pb-14 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Featured Cleaners</h2>
          <button
            type="button"
            onClick={() => router.push("/booking")}
            className="text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-300"
          >
            View All
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCleaners.map((c) => {
            // Try to match a service type from the cleaner's specialty
            const matchedService = apiServices.find(s => c.specialty.toLowerCase().includes(s.title.toLowerCase().split(' ')[0]));
            const fav = isFavorite(c.name);
            return (
              <div
                key={c.name}
                className="overflow-hidden rounded-3xl border border-white/90 bg-white/90 text-left shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/60 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-slate-900/50 dark:hover:shadow-cyan-900/40"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedService(matchedService ? matchedService._id : "");
                    setShowBookingModal(true);
                  }}
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(c);
                      }}
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow transition-transform hover:scale-110 dark:bg-slate-900/90"
                    >
                      <Heart
                        size={18}
                        className={fav ? "text-red-500 fill-red-500" : "text-gray-700 dark:text-slate-300"}
                      />
                    </button>

                    <div className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-800 shadow dark:bg-slate-900/90 dark:text-slate-100">
                      ${c.price}/hr
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.name}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{c.specialty}</p>

                    <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Rating:</span> {c.rating} ({c.reviews} reviews)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filteredCleaners.length === 0 && (
          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">No cleaners match your search.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/80 bg-white/80 backdrop-blur dark:border-slate-700/70 dark:bg-slate-950/70">
        <div className="w-full px-4 py-12 sm:px-6 lg:px-10">
          <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            (c) 2024 CleanConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}



