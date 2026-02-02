"use client";

import { Mail, User as UserIcon, CalendarDays } from "lucide-react";

export default function UserProfilePage() {
  // Dummy data (later replace with API data)
  const user = {
    fullName: "yubraj karki",
    email: "wgsrg@gmail.com",
    memberSince: "January 31, 2026",
    bookings: 0,
    favorites: 0,
    reviews: 0,
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="w-full px-6 py-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="mt-2 text-gray-500">Manage your account settings</p>
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

          {/* Fields */}
          <div className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <div className="mt-2 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <Mail className="text-gray-400" size={18} />
                <input
                  value={user.email}
                  readOnly
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <UserIcon className="text-gray-400" size={18} />
                <input
                  value={user.fullName}
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
