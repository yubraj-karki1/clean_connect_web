"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import WorkerLayout from "../_components/WorkerLayout";
import { getWorkerNotifications, type WorkerNotification } from "@/lib/api/booking";
import axios from "@/lib/api/axios";
import { AlertCircle, Bell, CalendarDays, Loader2, MapPin, RefreshCw } from "lucide-react";

export default function WorkerNotificationsPage() {
  const [items, setItems] = useState<WorkerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [customerDetailsMap, setCustomerDetailsMap] = useState<
    Record<string, { name?: string; phone?: string }>
  >({});

  const fetchNotifications = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    setError("");
    try {
      const res = await getWorkerNotifications();
      const rows = res.data || [];
      setItems(rows);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(async () => {
      try {
        const res = await getWorkerNotifications();
        const rows = res.data || [];
        setItems(rows);
      } catch {
        // Ignore polling errors to avoid disrupting the page state.
      }
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const pickUserPayload = (payload: any) =>
      payload?.data?.data ||
      payload?.data?.user ||
      payload?.user ||
      payload?.data ||
      payload;

    const extractPhone = (source: any) =>
      source?.phoneNumber ||
      source?.phone ||
      source?.mobile ||
      source?.contactNumber ||
      "";

    const extractName = (source: any) => {
      const full =
        source?.fullName ||
        source?.name ||
        source?.username ||
        source?.email ||
        "";
      if (full) return String(full);
      return [source?.firstName, source?.lastName]
        .filter((v: unknown) => typeof v === "string" && v.trim())
        .join(" ")
        .trim();
    };

    const needsLookup = items
      .map((item) => {
        const booking = item.booking || {};
        const customerObj =
          booking.userId && typeof booking.userId === "object"
            ? booking.userId
            : null;
        const customerId =
          customerObj?._id ||
          customerObj?.id ||
          (typeof booking.userId === "string" ? booking.userId : "");
        const hasPhone =
          !!extractPhone(customerObj) || !!customerDetailsMap[customerId || ""]?.phone;
        return { customerId, hasPhone };
      })
      .filter((r) => r.customerId && !r.hasPhone)
      .map((r) => r.customerId);

    const uniqueIds = Array.from(new Set(needsLookup));
    if (uniqueIds.length === 0) return;

    let cancelled = false;

    Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const res = await axios.get(`/api/users/${id}`);
          const user = pickUserPayload(res.data) || {};
          return {
            id,
            name: extractName(user),
            phone: extractPhone(user),
          };
        } catch {
          return { id, name: "", phone: "" };
        }
      })
    ).then((rows) => {
      if (cancelled) return;
      setCustomerDetailsMap((prev) => {
        const next = { ...prev };
        rows.forEach((r) => {
          next[r.id] = {
            name: next[r.id]?.name || r.name || "",
            phone: next[r.id]?.phone || r.phone || "",
          };
        });
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [items]);

  const unreadCount = useMemo(() => items.length, [items]);

  return (
    <WorkerLayout>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Real booking notifications from customer requests.
          </p>
        </div>

        <button
          onClick={() => fetchNotifications(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-900/60">
        <Bell size={14} />
        {unreadCount} live booking notification{unreadCount !== 1 && "s"}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-slate-400">
          <Loader2 size={32} className="mb-3 animate-spin" />
          <span className="text-sm">Loading notifications...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle size={32} className="mb-3 text-red-400" />
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={() => fetchNotifications(true)}
            className="mt-4 text-sm font-medium text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800">
            <Bell size={28} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-100">
            No new booking notifications
          </h2>
          <p className="mt-1 max-w-md text-sm text-gray-400 dark:text-slate-400">
            When customers create new bookings, they will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => {
            const booking = item.booking || {};
            const id = booking._id || booking.id || item.bookingId;
            const service =
              booking.serviceId && typeof booking.serviceId === "object"
                ? booking.serviceId.title
                : booking.serviceId || "Cleaning Service";
            const customer =
              booking.userId && typeof booking.userId === "object"
                ? booking.userId.fullName || booking.userId.email
                : booking.userId || "Customer";
            const customerId =
              booking.userId && typeof booking.userId === "object"
                ? booking.userId._id || booking.userId.id || ""
                : typeof booking.userId === "string"
                ? booking.userId
                : "";
            const customerPhone =
              customerDetailsMap[customerId]?.phone ||
              (booking.userId && typeof booking.userId === "object"
                ? booking.userId.phoneNumber ||
                  booking.userId.phone ||
                  booking.userId.mobile ||
                  booking.userId.contactNumber
                : "");
            const customerName =
              customerDetailsMap[customerId]?.name || customer;
            const address =
              booking.addressId && typeof booking.addressId === "object"
                ? [booking.addressId.line1, booking.addressId.city, booking.addressId.state]
                    .filter(Boolean)
                    .join(", ")
                : booking.address || "-";

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    New
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-slate-300">
                  {item.message}
                </p>

                <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-slate-300">
                  <p>
                    <span className="font-semibold text-gray-800 dark:text-slate-100">Service:</span>{" "}
                    {service}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800 dark:text-slate-100">Customer:</span>{" "}
                    {customerName}
                  </p>
                  {customerPhone && (
                    <p>
                      <span className="font-semibold text-gray-800 dark:text-slate-100">Phone:</span>{" "}
                      {customerPhone}
                    </p>
                  )}
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                    <span>{address}</span>
                  </p>
                  {booking.startAt && (
                    <p className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-gray-400" />
                      {new Date(booking.startAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400 dark:border-slate-800 dark:text-slate-500">
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                  <Link
                    href={`/worker/dashboard`}
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    Open booking
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </WorkerLayout>
  );
}
