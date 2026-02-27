"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminLayout from "../users/AdminLayout";
import { handleLogout } from "@/lib/actions/auth-action";
import LogoutConfirmModal from "@/app/_components/LogoutConfirmModal";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function getClientToken() {
  const fromCookie = getCookie("auth_token") || getCookie("token");
  if (fromCookie) return fromCookie;
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

type RefEntity = string | { _id?: string; fullName?: string; email?: string; title?: string };

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Booking {
  _id: string;
  status?: string;
  startAt?: string;
  createdAt?: string;
  userId?: RefEntity;
  serviceId?: RefEntity;
}

function isBookingLike(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj._id === "string" || typeof obj.status === "string" || "serviceId" in obj || "userId" in obj;
}

function findBookingArrayDeep(value: unknown): Booking[] {
  if (Array.isArray(value)) {
    return value.some(isBookingLike) ? (value as Booking[]) : [];
  }
  if (!value || typeof value !== "object") return [];

  for (const nested of Object.values(value as Record<string, unknown>)) {
    const found = findBookingArrayDeep(nested);
    if (found.length) return found;
  }
  return [];
}

function extractArrayFromPayload(payload: unknown): Booking[] {
  if (Array.isArray(payload)) return payload.some(isBookingLike) ? (payload as Booking[]) : [];
  if (!payload || typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;
  const candidates = [
    obj.data,
    obj.bookings,
    obj.results,
    obj.items,
    (obj.data as Record<string, unknown> | undefined)?.bookings,
    (obj.data as Record<string, unknown> | undefined)?.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.some(isBookingLike)) return candidate as Booking[];
  }

  return findBookingArrayDeep(payload);
}

function entityName(value: RefEntity | undefined, fallback = "-") {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.fullName || value.email || value.title || value._id || fallback;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await handleLogout();
    } catch {}

    document.cookie = "auth_token=; Max-Age=0; path=/";
    document.cookie = "user_data=; Max-Age=0; path=/";
    document.cookie = "token=; Max-Age=0; path=/";
    document.cookie = "role=; Max-Age=0; path=/";

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    window.location.href = "/login";
  };

  const fetchData = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const token = getClientToken();
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      const usersRes = await fetch("http://localhost:5000/api/admin/users/", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
        mode: "cors",
      });

      if (!usersRes.ok) throw new Error("Failed to fetch users");

      const usersData = await usersRes.json();
      setUsers(Array.isArray(usersData) ? usersData : usersData.data || []);

      try {
        const bookingEndpoints = [
          "http://localhost:5000/api/bookings",
          "http://localhost:5000/api/bookings/",
          "http://localhost:5000/api/bookings/all",
          "http://localhost:5000/api/bookings/admin",
          "http://localhost:5000/api/bookings/me",
          "http://localhost:5000/api/admin/bookings",
          "http://localhost:5000/api/admin/bookings/",
          "http://localhost:5000/api/admin/bookings/all",
          "http://localhost:5000/api/admin/booking",
        ];

        let resolved: Booking[] = [];

        for (const endpoint of bookingEndpoints) {
          const bookingsRes = await fetch(endpoint, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...authHeader,
            },
            mode: "cors",
          });

          if (!bookingsRes.ok) continue;

          const bookingsData = await bookingsRes.json();
          const candidate = extractArrayFromPayload(bookingsData);
          if (candidate.length > resolved.length) resolved = candidate;
          if (resolved.length > 0) break;
        }

        setBookings(resolved);
      } catch {
        setBookings([]);
      }

      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role.toLowerCase() === "admin").length;
  const userCount = users.filter((u) => u.role.toLowerCase() === "user").length;
  const workerCount = users.filter((u) => u.role.toLowerCase() === "worker").length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => (b.status || "").toLowerCase() === "pending").length;
  const acceptedBookings = bookings.filter((b) => (b.status || "").toLowerCase() === "accepted").length;
  const completedBookings = bookings.filter((b) => (b.status || "").toLowerCase() === "completed").length;
  const cancelledBookings = bookings.filter((b) => (b.status || "").toLowerCase() === "cancelled").length;

  const filteredRecentUsers = useMemo(() => {
    const scoped = [...users].slice(-12).reverse();
    return scoped.filter((user) => {
      const q = userSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, roleFilter, userSearch]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => {
        const aTime = new Date(a.createdAt || a.startAt || 0).getTime();
        const bTime = new Date(b.createdAt || b.startAt || 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 6);
  }, [bookings]);

  return (
    <AdminLayout>
      <LogoutConfirmModal
        open={showLogoutModal}
        onConfirm={onLogout}
        onCancel={() => setShowLogoutModal(false)}
        loading={loggingOut}
      />

      <div className="relative rounded bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8 shadow">
        <button
          type="button"
          disabled={loggingOut}
          onClick={() => setShowLogoutModal(true)}
          className="absolute right-8 top-8 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-red-600 disabled:opacity-60"
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pr-44">
          <h1 className="text-4xl font-bold text-blue-600">Admin Dashboard</h1>
          <div className="flex items-center gap-2 lg:mr-4">
            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={refreshing || loading}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <span className="text-xs text-slate-600">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Not updated yet"}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-lg text-blue-500">Loading stats...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
              <div className="rounded-lg bg-blue-500 p-6 text-white shadow-lg">
                <h2 className="mb-2 text-xl font-semibold">Total Users</h2>
                <p className="text-3xl font-bold">{totalUsers}</p>
              </div>
              <div className="rounded-lg bg-purple-500 p-6 text-white shadow-lg">
                <h2 className="mb-2 text-xl font-semibold">Admins</h2>
                <p className="text-3xl font-bold">{adminCount}</p>
              </div>
              <div className="rounded-lg bg-pink-500 p-6 text-white shadow-lg">
                <h2 className="mb-2 text-xl font-semibold">Users</h2>
                <p className="text-3xl font-bold">{userCount}</p>
              </div>
              <div className="rounded-lg bg-teal-500 p-6 text-white shadow-lg">
                <h2 className="mb-2 text-xl font-semibold">Workers</h2>
                <p className="text-3xl font-bold">{workerCount}</p>
              </div>
              <div className="rounded-lg bg-indigo-500 p-6 text-white shadow-lg">
                <h2 className="mb-2 text-xl font-semibold">Bookings</h2>
                <p className="text-3xl font-bold">{totalBookings}</p>
              </div>
              <div className="rounded-lg bg-amber-500 p-6 text-white shadow-lg">
                <h2 className="mb-2 text-xl font-semibold">Pending</h2>
                <p className="text-3xl font-bold">{pendingBookings}</p>
              </div>
            </div>

            <div className="rounded-lg bg-white/80 p-5 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/users" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Manage Users
                </Link>
                <Link href="/admin/users/create" className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
                  Create User
                </Link>
                <Link href="/admin/bookings" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                  Manage Bookings
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-white/80 p-5 shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Booking Status Overview</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">Pending</p>
                  <p className="text-2xl font-bold text-amber-900">{pendingBookings}</p>
                </div>
                <div className="rounded border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-800">Accepted</p>
                  <p className="text-2xl font-bold text-blue-900">{acceptedBookings}</p>
                </div>
                <div className="rounded border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-800">Completed</p>
                  <p className="text-2xl font-bold text-emerald-900">{completedBookings}</p>
                </div>
                <div className="rounded border border-rose-200 bg-rose-50 p-4">
                  <p className="text-sm font-semibold text-rose-800">Cancelled</p>
                  <p className="text-2xl font-bold text-rose-900">{cancelledBookings}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white/80 p-5 shadow">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name/email"
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900"
                  />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="worker">Worker</option>
                  </select>
                </div>
              </div>

              {filteredRecentUsers.length === 0 ? (
                <p className="text-gray-500">No matching users.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border rounded">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm text-gray-700">
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecentUsers.map((user) => (
                        <tr key={user._id} className="border-t text-sm">
                          <td className="px-4 py-2 text-gray-800">{user.fullName}</td>
                          <td className="px-4 py-2 text-gray-700">{user.email}</td>
                          <td className="px-4 py-2 font-semibold uppercase text-gray-700">{user.role}</td>
                          <td className="px-4 py-2">
                            <Link href={`/admin/users/${user._id}`} className="text-blue-600 hover:underline">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-white/80 p-5 shadow">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
                <Link href="/admin/bookings" className="text-sm font-semibold text-indigo-700 hover:underline">
                  View all bookings
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <p className="text-gray-500">No bookings available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border rounded">
                    <thead>
                      <tr className="bg-gray-100 text-left text-sm text-gray-700">
                        <th className="px-4 py-2">Booking</th>
                        <th className="px-4 py-2">Service</th>
                        <th className="px-4 py-2">Customer</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking._id} className="border-t text-sm">
                          <td className="px-4 py-2 text-gray-700">{booking._id}</td>
                          <td className="px-4 py-2 text-gray-800">{entityName(booking.serviceId)}</td>
                          <td className="px-4 py-2 text-gray-700">{entityName(booking.userId)}</td>
                          <td className="px-4 py-2 text-gray-700">
                            {booking.startAt ? new Date(booking.startAt).toLocaleString() : "-"}
                          </td>
                          <td className="px-4 py-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase text-slate-700">
                              {booking.status || "unknown"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="mt-8 text-lg text-gray-700">
          Welcome to the admin dashboard. Manage users, bookings, and platform activity here.
        </p>
      </div>
    </AdminLayout>
  );
}
