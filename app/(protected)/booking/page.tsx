"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import BookCleaningModal from "./BookCleaningModal";

export default function BookingPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Content */}
      <section className="w-full px-6 py-10 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="mt-2 text-gray-500">Manage your cleaning appointments</p>
          </div>

          {/* ❌ Removed top-right Book a Cleaning button */}
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
      {/* ✅ Modal */}
      <BookCleaningModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
