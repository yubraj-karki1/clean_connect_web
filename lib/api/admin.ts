import axios from "./axios";
import { API } from "./endpoints";

const getErrorStatus = (err: unknown) =>
  typeof err === "object" && err && "response" in err
    ? (err as { response?: { status?: number } }).response?.status
    : undefined;

const normalizeStatusValue = (status: string) => {
  const normalized = status.trim().toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
  if (normalized === "inprogress") return "in_progress";
  return normalized;
};

const objectValuesArray = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const values = Object.values(value as Record<string, unknown>);
  if (!values.length) return [];
  const objectLikeCount = values.filter((item) => item && typeof item === "object").length;
  return objectLikeCount >= Math.max(1, Math.floor(values.length / 2)) ? values : [];
};

const toArray = (payload: unknown) => {
  const p = payload as {
    data?: unknown;
    users?: unknown;
    bookings?: unknown;
    booking?: unknown;
    items?: unknown;
    results?: unknown;
    docs?: unknown;
  };
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.users)) return p.users;
  if (Array.isArray(p?.bookings)) return p.bookings;
  if (Array.isArray(p?.booking)) return p.booking;
  if (Array.isArray(p?.items)) return p.items;
  if (Array.isArray(p?.results)) return p.results;
  if (Array.isArray(p?.docs)) return p.docs;
  const fromDataObject = objectValuesArray(p?.data);
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

const pickArrayFromPayload = (payload: unknown) => {
  const direct = toArray(payload);
  if (direct.length) return direct;
  return findArrayDeep(payload);
};

type EntityRef = string | { _id?: string; id?: string; fullName?: string; email?: string; title?: string };

type BookingShape = {
  _id?: string;
  id?: string;
  bookingId?: string;
  booking_id?: string;
  status?: string;
  bookingStatus?: string;
  state?: string;
  paymentStatus?: string;
  startAt?: string;
  date?: string;
  bookingDate?: string;
  scheduledAt?: string;
  createdAt?: string;
  serviceId?: EntityRef;
  service?: EntityRef;
  serviceType?: string;
  userId?: EntityRef;
  user?: EntityRef;
  customer?: EntityRef;
  workerId?: EntityRef;
  worker?: EntityRef;
  cleaner?: EntityRef;
  addressId?: EntityRef;
  address?: EntityRef;
  location?: EntityRef;
  customerAddress?: EntityRef;
};

const normalizeEntity = (value: unknown): EntityRef | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") return value as EntityRef;
  return undefined;
};

const normalizeBooking = (booking: unknown, index: number) => {
  const b = booking as BookingShape;
  const rawId = b?._id || b?.id || b?.bookingId || b?.booking_id;
  const id =
    rawId ||
    // keep rows visible even if backend omits id in list payload
    `${b?.startAt || b?.scheduledAt || b?.bookingDate || b?.date || b?.createdAt || "booking"}-${index}`;

  return {
    ...b,
    _id: id,
    _isSyntheticId: !rawId,
    status: b.status || b.bookingStatus || b.paymentStatus || b.state,
    startAt: b.startAt || b.scheduledAt || b.bookingDate || b.date,
    serviceId: normalizeEntity(b.serviceId || b.service || b.serviceType),
    userId: normalizeEntity(b.userId || b.user || b.customer),
    workerId: normalizeEntity(b.workerId || b.worker || b.cleaner),
    addressId: normalizeEntity(b.addressId || b.address || b.location || b.customerAddress),
  };
};

const normalizeBookings = (payload: unknown[]) => {
  const rows = payload.map((item, idx) => normalizeBooking(item, idx)) as Array<Record<string, unknown>>;
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = String(row._id || "");
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const listAdminUsers = async () => {
  try {
    const res = await axios.get(API.ADMIN.USERS.LIST);
    const arr = pickArrayFromPayload(res.data);
    if (arr.length) return arr;
  } catch (err: unknown) {
    const code = getErrorStatus(err);
    if (code !== 404) throw err;
  }

  const res = await axios.get(`${API.ADMIN.USERS.LIST}/`);
  return pickArrayFromPayload(res.data);
};

export const getAdminUserById = async (id: string) => {
  const res = await axios.get(API.ADMIN.USERS.BY_ID(id));
  return res.data?.data || res.data || null;
};

export const createAdminUser = async (payload: FormData | Record<string, unknown>) => {
  try {
    const res = await axios.post(API.ADMIN.USERS.CREATE, payload);
    return res.data;
  } catch (err: unknown) {
    const message =
      typeof err === "object" && err && "response" in err
        ? ((err as { response?: { data?: { message?: string; error?: string } } }).response?.data?.message ||
            (err as { response?: { data?: { message?: string; error?: string } } }).response?.data?.error)
        : undefined;
    throw new Error(message || "Failed to create user");
  }
};

export const updateAdminUser = async (id: string, payload: Record<string, unknown>) => {
  try {
    const res = await axios.put(API.ADMIN.USERS.UPDATE(id), payload);
    return res.data;
  } catch (err: unknown) {
    if (getErrorStatus(err) === 405) {
      const res = await axios.patch(API.ADMIN.USERS.UPDATE(id), payload);
      return res.data;
    }
    throw err;
  }
};

export const deleteAdminUser = async (id: string) => {
  const res = await axios.delete(API.ADMIN.USERS.DELETE(id));
  return res.data;
};

export const listAdminBookings = async () => {
  const endpoints = [
    "/api/admin/bookings?all=true",
    "/api/admin/bookings?scope=all",
    "/api/bookings?all=true",
    "/api/bookings?scope=all",
    "/api/bookings?admin=true",
    API.ADMIN.BOOKINGS.LIST,
    `${API.ADMIN.BOOKINGS.LIST}/`,
    "/api/admin/bookings",
    "/api/admin/bookings/",
    "/api/admin/bookings/all",
    "/api/admin/booking",
    "/api/bookings/list",
    "/api/bookings/all",
    "/api/bookings/admin",
    "/api/bookings/me",
  ];

  let best: unknown[] = [];
  let lastError: unknown = null;
  let hadNon404Error = false;

  for (const endpoint of endpoints) {
    try {
      const res = await axios.get(endpoint);
      const arr = normalizeBookings(pickArrayFromPayload(res.data));
      if (arr.length > best.length) best = arr;
      if (arr.length > 0) return arr;
    } catch (err: unknown) {
      const code = getErrorStatus(err);
      if (code !== 404) {
        hadNon404Error = true;
        lastError = err;
      }
    }
  }

  if (best.length) return best;
  if (hadNon404Error && lastError) throw lastError;
  return [];
};

export const updateAdminBookingStatus = async (id: string, status: string) => {
  const normalizedStatus = normalizeStatusValue(status);
  const payloads = [
    { status: normalizedStatus },
    { status },
    { bookingStatus: normalizedStatus },
    { state: normalizedStatus },
  ];

  const actionEndpoints: Record<string, string[]> = {
    accepted: [API.ADMIN.BOOKINGS.ACCEPT(id), `/api/admin/bookings/${id}/accept`],
    completed: [API.ADMIN.BOOKINGS.COMPLETE(id), `/api/admin/bookings/${id}/complete`],
    cancelled: [API.ADMIN.BOOKINGS.CANCEL(id), `/api/admin/bookings/${id}/cancel`],
  };

  const methods: Array<"patch" | "put" | "post"> = ["patch", "put", "post"];
  let lastError: unknown = null;

  const tryActionRoute = async () => {
    const endpoints = actionEndpoints[normalizedStatus] || [];
    for (const endpoint of endpoints) {
      for (const method of methods) {
        try {
          const res =
            method === "patch"
              ? await axios.patch(endpoint)
              : method === "put"
                ? await axios.put(endpoint)
                : await axios.post(endpoint);
          return res.data;
        } catch (err: unknown) {
          const code = getErrorStatus(err);
          lastError = err;
          if (code && code !== 404 && code !== 405) throw err;
        }
      }
    }
    return null;
  };

  const tryStatusPayloadRoute = async () => {
    const endpoints = [
      API.ADMIN.BOOKINGS.STATUS(id),
      API.ADMIN.BOOKINGS.BY_ID(id),
      `/api/admin/bookings/${id}/status`,
      `/api/admin/bookings/${id}`,
    ];
    for (const endpoint of endpoints) {
      for (const method of ["patch", "put"] as const) {
        for (const payload of payloads) {
          try {
            const res = method === "patch" ? await axios.patch(endpoint, payload) : await axios.put(endpoint, payload);
            return res.data;
          } catch (err: unknown) {
            const code = getErrorStatus(err);
            lastError = err;
            if (code && code !== 404 && code !== 405 && code !== 400) throw err;
          }
        }
      }
    }
    return null;
  };

  const actionResult = await tryActionRoute();
  if (actionResult) return actionResult;

  const statusResult = await tryStatusPayloadRoute();
  if (statusResult) return statusResult;

  if (lastError) throw lastError;
  throw new Error("Failed to update booking status");
};

export const deleteAdminBooking = async (id: string) => {
  const endpoints = [
    API.ADMIN.BOOKINGS.BY_ID(id),
    `/api/admin/bookings/${id}`,
    `/api/bookings/${id}/delete`,
    `/api/admin/bookings/${id}/delete`,
  ];
  let lastError: unknown = null;

  for (const endpoint of endpoints) {
    try {
      const res = await axios.delete(endpoint);
      return res.data;
    } catch (err: unknown) {
      const code = getErrorStatus(err);
      lastError = err;
      if (code && code !== 404 && code !== 405) throw err;
    }
  }

  if (lastError) throw lastError;
  throw new Error("Failed to delete booking");
};
