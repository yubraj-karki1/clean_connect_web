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

export const deleteBooking = async (bookingId: string) => {
  const res = await axios.delete(`/api/bookings/${bookingId}`);
  return res.data;
};

/** Get ALL bookings (admin/general) - used as fallback */
export const getAllBookings = async () => {
  const res = await axios.get("/api/bookings");
  return res.data;
};

type EntityRef =
  | string
  | {
      _id?: string;
      id?: string;
      title?: string;
      fullName?: string;
      email?: string;
      line1?: string;
      city?: string;
      state?: string;
      zip?: string;
    };

type BookingShape = {
  _id?: string;
  id?: string;
  bookingId?: string;
  booking_id?: string;
  status?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  state?: string;
  startAt?: string;
  scheduledAt?: string;
  bookingDate?: string;
  date?: string;
  createdAt?: string;
  durationHours?: number;
  duration?: number;
  hours?: number;
  notes?: string;
  serviceId?: EntityRef;
  service?: EntityRef;
  serviceType?: EntityRef;
  userId?: EntityRef;
  user?: EntityRef;
  customer?: EntityRef;
  customerId?: EntityRef;
  workerId?: EntityRef;
  worker?: EntityRef;
  cleaner?: EntityRef;
  providerId?: EntityRef;
  provider?: EntityRef;
  assignedTo?: EntityRef;
  addressId?: EntityRef;
  address?: EntityRef;
  location?: EntityRef;
  customerAddress?: EntityRef;
  serviceTitle?: string;
  serviceName?: string;
};

const getErrorStatus = (err: unknown) =>
  typeof err === "object" && err && "response" in err
    ? (err as { response?: { status?: number } }).response?.status
    : undefined;

const objectValuesArray = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const values = Object.values(value as Record<string, unknown>);
  if (!values.length) return [];

  const objectLikeCount = values.filter(
    (item) => item && typeof item === "object"
  ).length;

  return objectLikeCount >= Math.max(1, Math.floor(values.length / 2))
    ? values
    : [];
};

const toArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const p = payload as {
    data?: unknown;
    bookings?: unknown;
    booking?: unknown;
    items?: unknown;
    results?: unknown;
    docs?: unknown;
  };

  if (Array.isArray(p.data)) return p.data;
  if (Array.isArray(p.bookings)) return p.bookings;
  if (Array.isArray(p.booking)) return p.booking;
  if (Array.isArray(p.items)) return p.items;
  if (Array.isArray(p.results)) return p.results;
  if (Array.isArray(p.docs)) return p.docs;

  const fromDataObject = objectValuesArray(p.data);
  if (fromDataObject.length) return fromDataObject;

  const fromRootObject = objectValuesArray(payload);
  if (fromRootObject.length) return fromRootObject;

  return [];
};

const findArrayDeep = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  for (const nested of Object.values(payload as Record<string, unknown>)) {
    const found = findArrayDeep(nested);
    if (found.length) return found;
  }
  return [];
};

const pickArrayFromPayload = (payload: unknown): unknown[] => {
  const direct = toArray(payload);
  if (direct.length) return direct;
  return findArrayDeep(payload);
};

const normalizeEntity = (value: unknown): EntityRef | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") return value as EntityRef;
  return undefined;
};

const normalizeBooking = (booking: unknown, index: number) => {
  const b = booking as BookingShape;
  const rawId = b._id || b.id || b.bookingId || b.booking_id;
  const fallbackId =
    `${b.startAt || b.scheduledAt || b.bookingDate || b.date || b.createdAt || "booking"}-${index}`;

  const normalizedStatus =
    typeof b.status === "string" && b.status.trim()
      ? b.status
      : typeof b.bookingStatus === "string" && b.bookingStatus.trim()
      ? b.bookingStatus
      : typeof b.paymentStatus === "string" && b.paymentStatus.trim()
      ? b.paymentStatus
      : typeof b.state === "string" && b.state.trim()
      ? b.state
      : "";

  return {
    ...b,
    _id: rawId || fallbackId,
    _isSyntheticId: !rawId,
    status: normalizedStatus,
    startAt: b.startAt || b.scheduledAt || b.bookingDate || b.date,
    durationHours: b.durationHours || b.duration || b.hours,
    serviceId: normalizeEntity(
      b.serviceId || b.service || b.serviceType || b.serviceTitle || b.serviceName
    ),
    userId: normalizeEntity(b.userId || b.user || b.customer || b.customerId),
    workerId: normalizeEntity(
      b.workerId || b.worker || b.cleaner || b.providerId || b.provider || b.assignedTo
    ),
    addressId: normalizeEntity(
      b.addressId || b.address || b.location || b.customerAddress
    ),
  };
};

const normalizeBookings = (payload: unknown): any[] => {
  const arr = pickArrayFromPayload(payload);
  const rows = arr.map((item, idx) => normalizeBooking(item, idx));

  const seen = new Set<string>();
  return rows.filter((row) => {
    const id = String(row._id || "");
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const workerIdValue = (worker: unknown) => {
  if (!worker) return null;
  if (typeof worker === "string") {
    const cleaned = worker.trim().toLowerCase();
    if (
      !cleaned ||
      cleaned === "null" ||
      cleaned === "undefined" ||
      cleaned === "none" ||
      cleaned === "unassigned" ||
      cleaned === "not_assigned" ||
      cleaned === "not-assigned" ||
      cleaned === "na" ||
      cleaned === "n/a"
    ) {
      return null;
    }
    return worker.trim();
  }
  if (typeof worker === "object") {
    const w = worker as { _id?: string; id?: string };
    const id = (w._id || w.id || "").trim();
    return id || null;
  }
  return null;
};

const isOpenStatus = (status?: string) => {
  const s = (status || "")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .trim();
  if (!s) return true;

  const openStatuses = new Set([
    "pending",
    "pending_payment",
    "unassigned",
    "open",
    "created",
    "requested",
    "request_created",
    "awaiting_worker",
    "awaiting_assignment",
    "new",
  ]);

  return openStatuses.has(s);
};

const isClosedStatus = (status?: string) => {
  const s = (status || "")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .trim();
  if (!s) return false;

  const closedStatuses = new Set([
    "completed",
    "cancelled",
    "canceled",
    "rejected",
    "failed",
    "expired",
  ]);
  return closedStatuses.has(s);
};

const asDataResponse = (raw: unknown, rows: any[]) => {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return { ...(raw as Record<string, unknown>), data: rows };
  }
  return { data: rows };
};

const isIgnorableStatus = (status?: number) =>
  status === 400 || status === 401 || status === 403 || status === 404 || status === 405;

/* ===================== WORKER APIs ===================== */

/**
 * Get available bookings for workers to accept.
 */
export const getAvailableJobs = async () => {
  const endpoints = [
    API.WORKER.AVAILABLE_JOBS,
    "/api/bookings?status=pending",
    "/api/bookings?status=pending_payment",
    "/api/bookings?scope=all",
    "/api/bookings?all=true",
    "/api/bookings/list",
    "/api/bookings/all",
    "/api/bookings",
    "/api/admin/bookings?all=true",
    "/api/admin/bookings",
  ];

  let bestRows: any[] = [];
  let bestRaw: unknown = null;
  let lastHardError: unknown = null;
  let sawUnauthorized = false;

  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(endpoint);
      const openRows = normalizeBookings(res.data).filter((b) => {
        const wId = workerIdValue(b.workerId);
        if (wId) return false;
        // Keep truly open jobs and also accept legacy status shapes
        // where status may be empty but still not completed/cancelled.
        return isOpenStatus(b.status) || !isClosedStatus(b.status);
      });
      if (openRows.length > bestRows.length) {
        bestRows = openRows;
        bestRaw = res.data;
      }
      if (openRows.length > 0) {
        return asDataResponse(res.data, openRows);
      }
    } catch (err: unknown) {
      const status = getErrorStatus(err);
      if (status === 401 || status === 403) sawUnauthorized = true;
      if (!isIgnorableStatus(status)) lastHardError = err;
    }
  }

  if (bestRows.length > 0) return asDataResponse(bestRaw, bestRows);
  if (sawUnauthorized) {
    throw new Error("Unauthorized to load available jobs. Please login again as worker.");
  }
  if (lastHardError) throw lastHardError;
  return { data: [] };
};

/**
 * Get the current worker's accepted jobs.
 */
export const getWorkerJobs = async () => {
  const endpoints = [
    API.WORKER.MY_JOBS,
    "/api/bookings/worker/jobs",
    "/api/bookings/my-jobs",
    "/api/bookings?scope=worker",
    "/api/bookings?mine=true",
    "/api/bookings",
  ];

  let currentWorkerId: string | null = null;
  if (typeof document !== "undefined") {
    try {
      const userCookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("user_data="));
      if (userCookie) {
        const userData = JSON.parse(
          decodeURIComponent(userCookie.split("=").slice(1).join("="))
        );
        currentWorkerId = userData._id || userData.id || null;
      }
    } catch {
      currentWorkerId = null;
    }
  }

  let bestRows: any[] = [];
  let bestRaw: unknown = null;
  let lastHardError: unknown = null;

  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(endpoint);
      const normalized = normalizeBookings(res.data);
      const myJobs = normalized.filter((b) => {
        const bWorkerId = workerIdValue(b.workerId);
        return !!bWorkerId && bWorkerId === currentWorkerId;
      });

      if (myJobs.length > bestRows.length) {
        bestRows = myJobs;
        bestRaw = res.data;
      }
      if (myJobs.length > 0) return asDataResponse(res.data, myJobs);
    } catch (err: unknown) {
      const status = getErrorStatus(err);
      if (!isIgnorableStatus(status)) lastHardError = err;
    }
  }

  if (bestRows.length > 0) return asDataResponse(bestRaw, bestRows);
  if (lastHardError) throw lastHardError;
  return { data: [] };
};

/**
 * Accept a booking (worker claims the job).
 */
export const acceptJob = async (bookingId: string) => {
  const res = await axios.patch(API.WORKER.ACCEPT(bookingId));
  return res.data;
};

/**
 * Mark a booking as completed.
 */
export const completeJob = async (bookingId: string) => {
  const res = await axios.patch(API.WORKER.COMPLETE(bookingId));
  return res.data;
};

/**
 * Get worker booking feed (real user-created bookings visible to worker role).
 * This is broader than available-jobs and can include assigned/completed rows.
 */
export const getWorkerBookingFeed = async () => {
  const endpoints = [
    API.WORKER.AVAILABLE_JOBS,
    "/api/bookings?scope=all",
    "/api/bookings?all=true",
    "/api/bookings",
  ];

  let bestRows: any[] = [];
  let bestRaw: unknown = null;
  let lastHardError: unknown = null;
  let sawUnauthorized = false;

  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(endpoint);
      const rows = normalizeBookings(res.data);
      if (rows.length > bestRows.length) {
        bestRows = rows;
        bestRaw = res.data;
      }
      if (rows.length > 0) return asDataResponse(res.data, rows);
    } catch (err: unknown) {
      const status = getErrorStatus(err);
      if (status === 401 || status === 403) sawUnauthorized = true;
      if (!isIgnorableStatus(status)) lastHardError = err;
    }
  }

  if (bestRows.length > 0) return asDataResponse(bestRaw, bestRows);
  if (sawUnauthorized) {
    throw new Error("Unauthorized to load worker booking feed. Please login again as worker.");
  }
  if (lastHardError) throw lastHardError;
  return { data: [] };
};
