// lib/api/endpoints.ts
export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
  },

  ADMIN: {
    USERS: {
      BASE: "/api/admin/users",          // GET list, POST create
      CREATE: "/api/admin/users",        // POST
      LIST: "/api/admin/users",          // GET
      BY_ID: (id: string) => `/api/admin/users/${id}`, // GET/PUT/DELETE
      UPDATE: (id: string) => `/api/admin/users/${id}`, // PUT/PATCH
      DELETE: (id: string) => `/api/admin/users/${id}`, // DELETE
    },
  },

  WORKER: {
    AVAILABLE_JOBS: "/api/bookings/available",   // GET — open bookings
    MY_JOBS: "/api/bookings/worker/me",          // GET — worker's accepted jobs
    ACCEPT: (id: string) => `/api/bookings/${id}/accept`,   // PATCH
    COMPLETE: (id: string) => `/api/bookings/${id}/complete`, // PATCH
  },
} as const;
