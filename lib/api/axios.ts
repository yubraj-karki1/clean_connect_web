import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

// In the browser, use relative URLs so requests go through Next.js rewrites (same origin → no CORS).
// On the server (SSR / Server Actions), hit the backend directly.
const BASE_URL =
  typeof window === "undefined"
    ? (process.env.BACKEND_URL || "http://localhost:5000")
    : "";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // keep true if you use cookies for auth
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Ensure headers is always an AxiosHeaders instance
  const headers = AxiosHeaders.from(config.headers);

  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;

  if (isFormData) {
    // Let browser/axios set multipart boundary automatically
    headers.delete("Content-Type");
  } else {
    // Default JSON for normal requests
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  // OPTIONAL: if your backend uses Bearer token from localStorage
  // (skip this if you use httpOnly cookies only)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers = headers;
  return config;
});

export default axiosInstance;
