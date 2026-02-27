"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Home, Calendar, Heart, User, Clock3, MapPin, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import BookCleaningModal from "./BookCleaningModal";
import { getMyBookings } from "@/lib/api/booking";

export default function BookingPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const formatStatus = (status?: string) => {
    if (!status) return "Unknown";
    return status
      .split("_")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };

  const getStatusClass = (status?: string) => {
    const normalized = (status || "").toLowerCase();
    if (normalized === "completed") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (normalized === "pending_payment") return "bg-amber-100 text-amber-700 border-amber-200";
    if (normalized === "cancelled") return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const formatAddress = (address: any) => {
    if (!address || typeof address !== "object") return address || "-";
    return [address.line1, address.city, address.state, address.zip, address.country]
      .filter((item) => typeof item === "string" && item.trim() !== "")
      .join(", ");
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMyBookings();
        setBookings(res.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [open]); // refetch after modal closes

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

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_#d1fae5_0%,_#ecfeff_35%,_#f8fafc_70%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_#0f172a_0%,_#111827_45%,_#020617_100%)] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-700/20" />
        <div className="absolute right-0 top-52 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl dark:bg-cyan-700/20" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/80">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-10 flex items-center justify-between">
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
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Home size={16} /> Home
            </button>

            <button
              onClick={() => router.push("/booking")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 px-4 py-2 font-semibold text-emerald-800 ring-1 ring-emerald-200/80 dark:from-emerald-900/60 dark:to-cyan-900/60 dark:text-emerald-200 dark:ring-emerald-700/60"
            >
              <Calendar size={16} /> Bookings
            </button>

            <button
              onClick={() => router.push("/favorite")}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Heart size={16} /> Favorites
            </button>

            <button
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
            {/* ✅ OPEN MODAL */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:from-emerald-600 hover:to-teal-600"
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <section className="relative z-10 w-full px-4 py-10 sm:px-6 lg:px-10">
        {/* Header row */}
        <div className="rounded-3xl border border-emerald-100/80 bg-white/85 p-6 shadow-lg shadow-emerald-100/50 backdrop-blur sm:p-8 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-slate-900/50">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">My Bookings</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Manage your cleaning appointments
            </p>
          </div>
          <div className="mt-5 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 px-4 py-1.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200/80 dark:from-emerald-900/60 dark:to-cyan-900/60 dark:text-emerald-200 dark:ring-emerald-700/70">
            {bookings.length} total booking{bookings.length === 1 ? "" : "s"}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 rounded-3xl border border-white/80 bg-white/85 p-8 text-center text-slate-600 shadow dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-300">Loading bookings...</div>
        ) : error ? (
          <div className="mt-10 rounded-3xl border border-rose-200 bg-rose-50/90 p-8 text-center text-rose-700">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/90 p-10 text-center shadow-lg shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900/75">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100">
              <CalendarDays className="text-emerald-700" size={28} />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900">No bookings yet</h2>
            <p className="mt-2 max-w-md text-slate-600 dark:text-slate-300">
              You haven't made any bookings yet. Book your first cleaning appointment now.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:from-emerald-600 hover:to-teal-600"
            >
              Book a Cleaning
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking, idx) => (
              <article
                key={booking._id || idx}
                className="group relative overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/60 dark:border-slate-700 dark:bg-slate-900/75 dark:shadow-slate-900/50 dark:hover:shadow-cyan-900/40"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300" />

                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-emerald-100/80 p-2 text-emerald-700 ring-1 ring-emerald-200 dark:bg-slate-800 dark:text-emerald-300 dark:ring-slate-600">
                      <CalendarDays size={18} />
                    </div>
                    <h3 className="font-semibold text-slate-900 leading-tight dark:text-slate-100">
                      {booking.serviceId && typeof booking.serviceId === "object" && booking.serviceId.title
                        ? booking.serviceId.title
                        : booking.serviceId || "Service"}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {formatStatus(booking.status)}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                    <Calendar className="text-slate-400" size={16} />
                    <span className="font-medium text-slate-600 dark:text-slate-300">Date:</span>
                    <span>{booking.startAt ? new Date(booking.startAt).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                    <Clock3 className="text-slate-400" size={16} />
                    <span className="font-medium text-slate-600 dark:text-slate-300">Time:</span>
                    <span>
                      {booking.startAt
                        ? new Date(booking.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/80">
                    <MapPin className="mt-0.5 shrink-0 text-slate-400" size={16} />
                    <span className="font-medium text-slate-600 dark:text-slate-300">Address:</span>
                    <span className="line-clamp-2">
                      {booking.addressId && typeof booking.addressId === "object"
                        ? formatAddress(booking.addressId)
                        : booking.addressId || "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 h-px bg-slate-200/70" />
                <div className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Booking #{idx + 1}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= MODAL ================= */}
      <BookCleaningModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}

