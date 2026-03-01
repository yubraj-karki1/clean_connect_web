"use client";

import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../users/AdminLayout";
import { deleteAdminBooking, listAdminBookings, updateAdminBookingStatus } from "@/lib/api/admin";

type EntityRef = string | { _id?: string; fullName?: string; email?: string; title?: string; line1?: string; city?: string; state?: string; zip?: string };

interface Booking {
  _id: string;
  _isSyntheticId?: boolean;
  status?: string;
  startAt?: string;
  durationHours?: number;
  createdAt?: string;
  notes?: string;
  serviceId?: EntityRef;
  userId?: EntityRef;
  workerId?: EntityRef;
  addressId?: EntityRef;
}

function displayName(value: EntityRef | undefined, fallback = "-") {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value.fullName || value.email || value.title || value._id || fallback;
}

function normalizeStatus(status?: string) {
  return (status || "").toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
}

function formatStatus(status?: string) {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatAddress(value: EntityRef | undefined) {
  if (!value) return "-";
  if (typeof value === "string") return value;
  return [value.line1, value.city, value.state, value.zip].filter(Boolean).join(", ") || "-";
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminBookings();
      setBookings(data as Booking[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const normalizedStatus = normalizeStatus(booking.status);
      const normalizedFilter = normalizeStatus(statusFilter);
      const statusMatch = normalizedFilter === "all" || normalizedStatus === normalizedFilter;
      if (!statusMatch) return false;

      const q = search.trim().toLowerCase();
      if (!q) return true;

      const fields = [
        displayName(booking.serviceId),
        displayName(booking.userId),
        displayName(booking.workerId),
        formatAddress(booking.addressId),
        booking._id,
      ]
        .join(" ")
        .toLowerCase();

      return fields.includes(q);
    });
  }, [bookings, search, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await updateAdminBookingStatus(id, status);

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === id ? { ...booking, status } : booking
        )
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking? This action cannot be undone.")) return;
    setUpdatingId(id);
    try {
      await deleteAdminBooking(id);

      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete booking");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = bookings.filter(
    (booking) => {
      const s = normalizeStatus(booking.status);
      return s === "pending" || s === "pending_payment";
    }
  ).length;
  const completedCount = bookings.filter(
    (booking) => normalizeStatus(booking.status) === "completed"
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6 text-slate-900 dark:text-slate-100">
        <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Booking Control</h1>
            <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => applyTheme("light")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme === "light" ? "bg-emerald-100 text-emerald-800" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"}`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => applyTheme("dark")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme === "dark" ? "bg-emerald-900/60 text-emerald-200" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"}`}
              >
                Night
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Review all bookings, update status, and remove invalid entries.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
              Total: {bookings.length}
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">
              Pending: {pendingCount}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
              Completed: {completedCount}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
            <input
              type="text"
              placeholder="Search by service, user, worker, address, or booking id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="accepted">Accepted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              type="button"
              onClick={fetchBookings}
              className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow dark:bg-slate-900">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading bookings...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-slate-900 text-left text-xs uppercase tracking-wide text-white">
                <tr>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Worker</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const isBusy = updatingId === booking._id;
                    const canMutate = !booking._isSyntheticId;
                    const currentStatus = normalizeStatus(booking.status);
                    const canAccept = canMutate && ["pending", "pending_payment"].includes(currentStatus);
                    const canComplete = canMutate && ["accepted", "in_progress", "inprogress"].includes(currentStatus);
                    const canCancel = canMutate && !["completed", "cancelled"].includes(currentStatus);
                    return (
                      <tr key={booking._id} className="border-b border-slate-100 text-sm dark:border-slate-800">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800 dark:text-slate-100">{displayName(booking.serviceId)}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {booking._isSyntheticId ? "ID unavailable" : booking._id}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{displayName(booking.userId)}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{displayName(booking.workerId, "Unassigned")}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {booking.startAt ? new Date(booking.startAt).toLocaleString() : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                            {formatStatus(booking.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={isBusy || !canAccept}
                              onClick={() => updateStatus(booking._id, "accepted")}
                              className="rounded bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200 disabled:opacity-60"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              disabled={isBusy || !canComplete}
                              onClick={() => updateStatus(booking._id, "completed")}
                              className="rounded bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              disabled={isBusy || !canCancel}
                              onClick={() => updateStatus(booking._id, "cancelled")}
                              className="rounded bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-200 disabled:opacity-60"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={isBusy || !canMutate}
                              onClick={() => deleteBooking(booking._id)}
                              className="rounded bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200 disabled:opacity-60"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
