"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  User as UserIcon,
  CalendarDays,
  Home,
  Calendar,
  Heart,
  User,
} from "lucide-react";
import { useState } from "react";

import { handleLogout } from "@/lib/actions/auth-action";

export default function UserProfilePage() {
  const router = useRouter();

  // Dummy data (replace later with API data)
  const [user, setUser] = useState({
    fullName: "Yubraj Karki",
    email: "wgsrg@gmail.com",
    memberSince: "January 31, 2026",
    bookings: 0,
    favorites: 0,
    reviews: 0,
    profileImage: null,
    id: "dummyid123",
  });
  const [form, setForm] = useState({ fullName: user.fullName, image: null });
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });
    const res = await fetch(`/api/auth/${user.id}`, {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();
    setMessage(data.message || (data.success ? "Profile updated!" : "Error"));
    if (data.success && data.data) {
      setUser((prev) => ({ ...prev, ...data.data }));
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
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
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Heart size={16} /> Favorites
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold"
            >
              <User size={16} /> Profile
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Book Now */}
            <button
              type="button"
              onClick={() => router.push("/booking")}
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
            >
              Book Now
            </button>

            {/* Logout (SERVER ACTION) */}
            <form action={handleLogout}>
              <button
                type="submit"
                className="rounded-full border border-red-500 px-5 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <section className="w-full px-6 py-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="mt-2 text-gray-500">
            Manage your account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="mt-8 max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
          {/* Top Row */}
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <UserIcon className="text-gray-500" size={28} />
            </div>

            <div>
              <h2 className="text-xl font-bold capitalize">{user.fullName}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Editable Form */}
          <form className="mt-8 space-y-6" onSubmit={handleUpdate} encType="multipart/form-data">
            <div>
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full bg-gray-50 outline-none text-sm text-gray-800 px-4 py-3 rounded-xl mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Profile Image</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full bg-gray-50 outline-none text-sm text-gray-800 px-4 py-3 rounded-xl mt-2"
              />
            </div>
            <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-semibold">Update Profile</button>
            {message && <p className="text-emerald-600 font-semibold mt-2">{message}</p>}
          </form>

          {/* Fields */}
          <div className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <Mail className="text-gray-400" size={18} />
                <input
                  value={user.email}
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Member Since */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Member Since
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <CalendarDays className="text-gray-400" size={18} />
                <input
                  value={user.memberSince}
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">
              {user.bookings}
            </div>
            <div className="mt-2 text-sm text-gray-500">Bookings</div>
          </div>

          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">
              {user.favorites}
            </div>
            <div className="mt-2 text-sm text-gray-500">Favorites</div>
          </div>

          <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">
              {user.reviews}
            </div>
            <div className="mt-2 text-sm text-gray-500">Reviews</div>
          </div>
        </div>
      </section>
    </main>
  );
}
