"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Home, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
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
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Calendar size={16} /> Bookings
            </button>

            <button
              onClick={() => router.push("/favorite")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold"
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
            <button
              type="button"
              onClick={() => router.push("/booking")}
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <section className="w-full px-6 py-10 flex-1">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="mt-2 text-gray-500">
            Your saved cleaners and services
          </p>
        </div>

        {/* Empty State */}
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart size={28} className="text-gray-500" />
          </div>

          <h2 className="mt-6 text-xl font-bold">No favorites yet</h2>

          <p className="mt-2 max-w-md text-gray-500">
            Save your favorite cleaners to quickly book them again.
            <br />
            Browse our featured cleaners to get started.
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-600"
          >
            Browse Cleaners
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t">
        <div className="w-full px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl bg-emerald-100 overflow-hidden">
                  <Image
                    src="/images/cleanconnect.png"
                    alt="CleanConnect Logo"
                    fill
                    className="object-contain p-1"
                    sizes="40px"
                  />
                </div>
                <span className="text-xl font-bold">CleanConnect</span>
              </div>

              <p className="mt-4 text-sm text-gray-600 max-w-xs">
                Your trusted partner for professional cleaning services.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-gray-900">Services</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><Link href="/booking" className="hover:text-emerald-600">Home Cleaning</Link></li>
                <li><Link href="/booking" className="hover:text-emerald-600">Office Cleaning</Link></li>
                <li><Link href="/booking" className="hover:text-emerald-600">Deep Cleaning</Link></li>
                <li><Link href="/booking" className="hover:text-emerald-600">Move-in/out</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-900">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-emerald-600">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-emerald-600">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-emerald-600">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-600">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900">Support</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><Link href="/help" className="hover:text-emerald-600">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-600">Terms of Service</Link></li>
                <li><Link href="/faqs" className="hover:text-emerald-600">FAQs</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
            © 2024 CleanConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
