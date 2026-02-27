import axios from "./axios";
import { API } from "./endpoints";

export const getServices = async () => {
  const res = await axios.get("/api/bookings/services");
  return res.data;
};

export const createBooking = async (bookingData: any) => {
  const res = await axios.post("/api/bookings", bookingData);
  return res.data;
};

export const getMyBookings = async () => {
  const res = await axios.get("/api/bookings/me");
  return res.data;
};

/** Get ALL bookings (admin/general) — used as fallback */
export const getAllBookings = async () => {
  const res = await axios.get("/api/bookings");
  return res.data;
};

/* ===================== WORKER APIs ===================== */

/**
 * Get available bookings for workers to accept.
 *
 * Tries the dedicated /api/bookings/available endpoint first.
 * If that 404s (not implemented yet), falls back to fetching
 * ALL bookings and filtering for status "pending" (unassigned).
 *
 * ── Backend endpoint you need ──
 * GET /api/bookings/available
 * → Returns bookings where status === "pending" and no worker is assigned.
 */
export const getAvailableJobs = async () => {
  try {
    const res = await axios.get(API.WORKER.AVAILABLE_JOBS);
    return res.data;
  } catch (err: any) {
    // Fallback: if /api/bookings/available doesn't exist (404),
    // fetch all bookings and filter client-side for pending ones.
    if (err?.response?.status === 404) {
      const res = await axios.get("/api/bookings");
      const all = res.data?.data || res.data || [];
      const pending = Array.isArray(all)
        ? all.filter(
            (b: any) =>
              !b.workerId &&
              (!b.status || b.status.toLowerCase() === "pending")
          )
        : [];
      return { ...res.data, data: pending };
    }
    throw err;
  }
};

/**
 * Get the current worker's accepted jobs.
 *
 * Tries /api/bookings/worker/me first, falls back to filtering
 * all bookings by the current worker's ID from the cookie.
 *
 * ── Backend endpoint you need ──
 * GET /api/bookings/worker/me
 * → Returns bookings where workerId === req.user._id
 */
export const getWorkerJobs = async () => {
  try {
    const res = await axios.get(API.WORKER.MY_JOBS);
    return res.data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      // Fallback: fetch all bookings, filter for ones assigned to current worker
      const res = await axios.get("/api/bookings");
      const all = res.data?.data || res.data || [];
      // Get current worker id from cookie
      let workerId: string | null = null;
      if (typeof document !== "undefined") {
        try {
          const userCookie = document.cookie
            .split("; ")
            .find((c) => c.startsWith("user_data="));
          if (userCookie) {
            const userData = JSON.parse(
              decodeURIComponent(userCookie.split("=").slice(1).join("="))
            );
            workerId = userData._id || userData.id;
          }
        } catch {}
      }
      const myJobs = Array.isArray(all)
        ? all.filter((b: any) => {
            const bWorkerId =
              typeof b.workerId === "object" ? b.workerId?._id : b.workerId;
            return bWorkerId && bWorkerId === workerId;
          })
        : [];
      return { ...res.data, data: myJobs };
    }
    throw err;
  }
};

/**
 * Accept a booking (worker claims the job).
 *
 * ── Backend endpoint you need ──
 * PATCH /api/bookings/:id/accept
 * → Sets workerId = req.user._id, status = "accepted"
 */
export const acceptJob = async (bookingId: string) => {
  const res = await axios.patch(API.WORKER.ACCEPT(bookingId));
  return res.data;
};

/**
 * Mark a booking as completed.
 *
 * ── Backend endpoint you need ──
 * PATCH /api/bookings/:id/complete
 * → Sets status = "completed"
 */
export const completeJob = async (bookingId: string) => {
  const res = await axios.patch(API.WORKER.COMPLETE(bookingId));
  return res.data;
};
