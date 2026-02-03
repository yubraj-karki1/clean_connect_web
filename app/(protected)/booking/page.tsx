"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Home, Calendar, Heart, User } from "lucide-react";
import { useState } from "react";
import BookCleaningModal from "./BookCleaningModal";

export default function BookingPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen w-full bg-gray-50 text-gray-900 flex flex-col">
      {/* ================= TOP NAV ================= */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          {/* Logo */}
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

          {/* Nav Items */}
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
      <section className="w-full px-6 py-10 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="mt-2 text-gray-500">
              Manage your cleaning appointments
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <CalendarDays className="text-gray-500" size={28} />
          </div>

          <h2 className="mt-6 text-xl font-bold">No bookings yet</h2>
          <p className="mt-2 max-w-md text-gray-500">
            You haven't made any bookings yet. Book your first cleaning appointment now.
          </p>

          {/* ✅ Open modal */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-600"
          >
            Book a Cleaning
          </button>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      <BookCleaningModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
