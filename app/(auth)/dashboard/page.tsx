"use client";

import { Bell, Heart, Home, Plus, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter(); 

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Nav Bar */}
      <header className="flex items-center justify-between px-10 py-4 bg-white border-b">
        <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
          CleanConnect
        </div>

        <nav className="flex items-center gap-8 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
            <Home size={18} /> Home
          </div>
          <div className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
            <Plus size={18} /> Bookings
          </div>
          <div className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
            <Heart size={18} /> Favorites
          </div>
          <div className="flex items-center gap-2 hover:text-blue-600 cursor-pointer">
            <User size={18} /> Profile
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-blue-600 border border-blue-500 hover:bg-blue-50 transition"
          >
            Sign In
          </button>

          <button
            //onClick={() => router.push("/booking")}
            className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
          >
            Book Now
          </button>
        </div>
      </header>

    </main>
  );
}
