"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  Heart,
  User,
  Gift,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const services = [
  { title: "Home Cleaning", emoji: "🏠" },
  { title: "Office Cleaning", emoji: "🏢" },
  { title: "Carpet Cleaning", emoji: "🧽" },
  { title: "Deep Cleaning", emoji: "✨" },
  { title: "Window Cleaning", emoji: "🪟" },
  { title: "Move-in/out", emoji: "📦" },
];

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

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <div className="h-5 w-5 rounded-md bg-emerald-500" />
            </div>
            <span className="text-xl font-bold">CleanConnect</span>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold"
            >
              <Home size={16} /> Home
            </button>

            <button
              type="button"
              onClick={() => router.push("/booking")}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Calendar size={16} /> Bookings
            </button>

            <button
              type="button"
              onClick={() => router.push("/favorite")}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Heart size={16} /> Favorites
            </button>

            <button
              type="button"
              onClick={() => router.push("/user/profile")}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <User size={16} /> Profile
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-700 border hover:bg-gray-50"
            >
              Sign In
            </button>

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

      {/* Hero FULL WIDTH */}
      <section className="w-full px-6 pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white">
          <div className="p-10 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Hello, Guest <span className="ml-2">👋</span>
              </h1>
              <p className="mt-3 text-white/90 text-base md:text-lg">
                Find your perfect cleaning service
              </p>

              {/* Offer */}
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

              {/* Search + Filters */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 text-gray-700 w-full">
                  <Search size={18} className="text-gray-400" />
                  <input
                    placeholder="Search for cleaning service..."
                    className="w-full outline-none bg-transparent text-sm"
                  />
                </div>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
              </div>
            </div>

            {/* Right Decorative Tiles */}
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

      {/* Services FULL WIDTH */}
      <section className="w-full px-6 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Services</h2>
          <button
            type="button"
            onClick={() => router.push("/booking")}
            className="text-sm font-semibold text-emerald-600 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {services.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => router.push("/booking")}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center gap-4 border w-full"
            >
              <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">
                {s.emoji}
              </div>
              <p className="text-sm font-semibold text-gray-800 text-center">
                {s.title}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Cleaners FULL WIDTH */}
      <section className="w-full px-6 pb-14">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Cleaners</h2>
          <button
            type="button"
            onClick={() => router.push("/booking")}
            className="text-sm font-semibold text-emerald-600 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCleaners.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => router.push("/booking")}
              className="text-left bg-white rounded-2xl border shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="relative h-48 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/95 flex items-center justify-center shadow">
                  <Heart size={18} className="text-gray-700" />
                </div>

                <div className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-800 shadow">
                  ${c.price}/hr
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900">{c.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{c.specialty}</p>

                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="text-amber-500">★</span>
                  <span className="font-semibold text-gray-900">{c.rating}</span>
                  <span className="text-gray-500">({c.reviews} reviews)</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer FULL WIDTH */}
      <footer className="bg-white border-t">
        <div className="w-full px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <div className="h-5 w-5 rounded-md bg-emerald-500" />
                </div>
                <span className="text-xl font-bold">CleanConnect</span>
              </div>

              <p className="mt-4 text-sm text-gray-600 max-w-xs">
                Your trusted partner for professional cleaning services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Services</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {["Home Cleaning", "Office Cleaning", "Deep Cleaning", "Move-in/out"].map(
                  (item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => router.push("/booking")}
                        className="hover:text-emerald-600"
                      >
                        {item}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-emerald-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-emerald-600">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-emerald-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-emerald-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Support</h4>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/help" className="hover:text-emerald-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-emerald-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-emerald-600">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-emerald-600">
                    FAQs
                  </Link>
                </li>
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
