"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Home, Calendar, Heart, User, Clock3, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import BookCleaningModal from "./BookCleaningModal";
import { getMyBookings } from "@/lib/api/booking";

export default function BookingPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-emerald-50/40 to-slate-50 text-gray-900 flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl px-6 py-4 flex items-center justify-between">
          <div
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative h-10 w-10 rounded-xl bg-emerald-100 overflow-hidden">
              <Image
                src="/images/cleanconnect.png"
                alt="CleanConnect Logo"
                fill
                className="object-contain p-1"
                sizes="40px"
                priority
              />
            </div>
            <span className="text-xl font-bold">CleanConnect</span>
          </div>
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Home size={16} /> Home
            </button>

            <button
              onClick={() => router.push("/booking")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold"
            >
              <Calendar size={16} /> Bookings
            </button>

            <button
              onClick={() => router.push("/favorite")}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Heart size={16} /> Favorites
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <User size={16} /> Profile
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* ✅ OPEN MODAL */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <section className="mx-auto w-full max-w-7xl px-6 py-10 flex-1">
        {/* Header row */}
        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="mt-2 text-gray-500">
              Manage your cleaning appointments
            </p>
          </div>
          <div className="mt-4 inline-flex items-center rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
            {bookings.length} total booking{bookings.length === 1 ? "" : "s"}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border bg-white p-8 text-center text-gray-500 shadow-sm">Loading bookings...</div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <CalendarDays className="text-gray-500" size={28} />
            </div>
            <h2 className="mt-6 text-xl font-bold">No bookings yet</h2>
            <p className="mt-2 max-w-md text-gray-500">
              You haven't made any bookings yet. Book your first cleaning appointment now.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-600"
            >
              Book a Cleaning
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bookings.map((booking, idx) => (
              <article
                key={booking._id || idx}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-emerald-500" size={20} />
                    <h3 className="font-semibold text-slate-900">
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

                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-slate-400" size={16} />
                    <span className="font-medium text-slate-600">Date:</span>
                    <span>{booking.startAt ? new Date(booking.startAt).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="text-slate-400" size={16} />
                    <span className="font-medium text-slate-600">Time:</span>
                    <span>
                      {booking.startAt
                        ? new Date(booking.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 shrink-0 text-slate-400" size={16} />
                    <span className="font-medium text-slate-600">Address:</span>
                    <span className="line-clamp-2">
                      {booking.addressId && typeof booking.addressId === "object"
                        ? formatAddress(booking.addressId)
                        : booking.addressId || "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 h-px bg-slate-100" />
                <div className="mt-4 text-xs text-slate-500">
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
