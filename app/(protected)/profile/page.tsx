"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Camera,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
} from "lucide-react";

import { handleLogout } from "@/lib/actions/auth-action";
import LogoutConfirmModal from "@/app/_components/LogoutConfirmModal";

type User = {
  id: string;
  fullName: string;
  email: string;
  memberSince: string;
  phoneNumber?: string;
  address?: string;
  bookings: number;
  favorites: number;
  reviews: number;
  profileImage?: string | null;
};

type MessageState = { text: string; type: "ok" | "err" } | null;

const getCountFromPayload = (payload: any): number | null => {
  if (Array.isArray(payload)) return payload.length;
  if (Array.isArray(payload?.data)) return payload.data.length;
  if (typeof payload?.count === "number") return payload.count;
  if (typeof payload?.total === "number") return payload.total;
  if (typeof payload?.totalCount === "number") return payload.totalCount;
  return null;
};

const getReviewCountFromUser = (userData: any): number | null => {
  if (!userData || typeof userData !== "object") return null;

  const candidates = [
    userData.reviewCount,
    userData.reviewsCount,
    userData.totalReviews,
  ];

  for (const value of candidates) {
    if (typeof value === "number") return value;
  }

  if (Array.isArray(userData.reviews)) return userData.reviews.length;
  return null;
};

const parseJsonSafely = async (res: Response) => {
  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  if (!contentType.includes("application/json")) {
    return {
      success: false,
      message: "Server returned a non-JSON response. Please log in again.",
      detail: raw.slice(0, 120),
    };
  }

  try {
    return JSON.parse(raw);
  } catch {
    return { success: false, message: "Invalid server response format." };
  }
};

export default function UserProfilePage() {
  const router = useRouter();

  const getClientToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await handleLogout();
    } catch (_) {}
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

  useEffect(() => {
    async function fetchUser() {
      try {
        let userId: string | null = null;

        try {
          const cookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user_data="));
          if (cookie) {
            const userData = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
            userId = userData.id || userData._id;
          }
        } catch {}

        if (!userId) {
          throw new Error("User not found - please log in again.");
        }

        const token = getClientToken();
        const res = await fetch(`/api/users/${userId}`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await parseJsonSafely(res);

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load profile");
        }

        const [bookingsCount, reviewsCount] = await Promise.all([
          (async () => {
            try {
              const bookingsRes = await fetch("/api/bookings/me", {
                credentials: "include",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              });
              if (!bookingsRes.ok) return 0;
              const bookingsData = await parseJsonSafely(bookingsRes);
              return getCountFromPayload(bookingsData) ?? 0;
            } catch {
              return 0;
            }
          })(),
          (async () => {
            const fromUser = getReviewCountFromUser(data.data);
            if (fromUser !== null) return fromUser;

            try {
              const reviewsRes = await fetch("/api/reviews/me", {
                credentials: "include",
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
              });
              if (!reviewsRes.ok) return 0;
              const reviewsData = await parseJsonSafely(reviewsRes);
              return getCountFromPayload(reviewsData) ?? 0;
            } catch {
              return 0;
            }
          })(),
        ]);

        let favoritesCount = 0;
        if (typeof window !== "undefined") {
          try {
            const favsRaw = localStorage.getItem("favorites");
            const favs = favsRaw ? JSON.parse(favsRaw) : [];
            favoritesCount = Array.isArray(favs) ? favs.length : 0;
          } catch {
            favoritesCount = 0;
          }
        }

        setUser({
          id: data.data._id,
          fullName: data.data.fullName,
          email: data.data.email,
          memberSince: new Date(data.data.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          phoneNumber: data.data.phoneNumber,
          address: data.data.address,
          bookings: bookingsCount,
          favorites: favoritesCount,
          reviews: reviewsCount,
          profileImage: data.data.profileImage,
        });
      } catch (err: any) {
        setFetchError(err?.message || "Failed to load profile");
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  const previewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const initials = useMemo(() => {
    if (!user?.fullName) return "U";
    const parts = user.fullName.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [user?.fullName]);

  const profileImageSrc = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (!user?.profileImage || typeof user.profileImage !== "string") return null;

    const clean = user.profileImage.trim();
    if (!clean) return null;
    if (clean.startsWith("http") || clean.startsWith("/")) return clean;
    return `http://localhost:5000/${clean}`;
  }, [previewUrl, user?.profileImage]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (!user) {
      setMessage({ text: "User data not loaded.", type: "err" });
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      if (imageFile) formData.append("profileImage", imageFile);

      const token = getClientToken();
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      const data = await parseJsonSafely(res);

      if (!res.ok || !data?.success) {
        setMessage({
          text: data?.message || "Update failed. Please try again.",
          type: "err",
        });
        return;
      }

      setMessage({ text: data?.message || "Profile updated!", type: "ok" });
      if (data?.data) setUser((prev) => (prev ? { ...prev, ...data.data } : prev));
      setImageFile(null);
    } catch {
      setMessage({
        text: "Network error. Check your server and try again.",
        type: "err",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-white px-4 text-gray-900">
        {fetchError ? (
          <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="mb-4 text-sm font-semibold text-red-600">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="animate-spin text-emerald-600" size={24} />
              <span className="text-sm font-semibold">Loading profile...</span>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-white text-gray-900">
      <header className="sticky top-0 z-50 border-b border-emerald-100/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-emerald-50"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-emerald-100">
              <Image
                src="/images/cleanconnect.png"
                alt="CleanConnect Logo"
                fill
                className="object-contain p-1"
                sizes="40px"
                priority
              />
            </div>
            <span className="text-lg font-bold">CleanConnect</span>
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-gray-600 hover:border-emerald-100 hover:bg-emerald-50"
            >
              <Home size={16} />
              Home
            </Link>

            <form action={() => setShowLogoutModal(true)}>
              <button
                type="submit"
                className="rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <LogoutConfirmModal
        open={showLogoutModal}
        onConfirm={onLogout}
        onCancel={() => setShowLogoutModal(false)}
        loading={loggingOut}
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-8 rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <BadgeCheck size={14} />
            Account Center
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">My Profile</h1>
          <p className="mt-1 text-base text-gray-500">
            Manage your account information and personalize your experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[360px_1fr]">
          <aside className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
            <div className="h-24 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <div className="-mt-14 px-6 pb-6">
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                {profileImageSrc ? (
                  <Image
                    src={profileImageSrc}
                    alt="Profile"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="112px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-gray-400">
                    {initials}
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="truncate text-xl font-bold">{user?.fullName ?? "-"}</p>
                <p className="truncate text-sm text-gray-500">{user?.email ?? "-"}</p>
                <p className="mt-1 text-xs text-gray-400">Member since {user?.memberSince ?? "-"}</p>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <Mail size={15} className="text-slate-500" />
                  <span className="truncate">{user?.email ?? "-"}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <Phone size={15} className="text-slate-500" />
                  <span className="truncate">{user?.phoneNumber ?? "-"}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <MapPin size={15} className="text-slate-500" />
                  <span className="truncate">{user?.address ?? "-"}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Stat label="Bookings" value={user?.bookings ?? 0} tone="emerald" />
                <Stat label="Favorites" value={user?.favorites ?? 0} tone="sky" />
                <Stat label="Reviews" value={user?.reviews ?? 0} tone="amber" />
              </div>
            </div>
          </aside>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <UserIcon size={18} className="text-emerald-600" />
              <h2 className="text-lg font-bold">Profile Settings</h2>
            </div>

            <form onSubmit={handleUpdate} encType="multipart/form-data" className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  value={user?.fullName || ""}
                  readOnly
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Profile Image</label>
                <label className="mt-2 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition hover:border-emerald-200 hover:bg-emerald-50/40">
                  <span className="truncate text-slate-600">
                    {imageFile ? imageFile.name : "Choose an image (optional)"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    <Camera size={14} />
                    Browse
                  </span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-xs text-slate-500">
                  Use a square image for the best profile appearance.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : null}
                {saving ? "Updating..." : "Update Profile"}
              </button>

              {message && (
                <p
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                    message.type === "ok"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
  tone = "emerald",
}: {
  label: string;
  value: number;
  tone?: "emerald" | "sky" | "amber";
}) {
  const toneClass =
    tone === "sky"
      ? "text-sky-700 bg-sky-50 border-sky-100"
      : tone === "amber"
      ? "text-amber-700 bg-amber-50 border-amber-100"
      : "text-emerald-700 bg-emerald-50 border-emerald-100";

  return (
    <div className={`rounded-xl border px-3 py-3 text-center ${toneClass}`}>
      <div className="text-lg font-bold">{value}</div>
      <div className="mt-1 text-xs font-medium">{label}</div>
    </div>
  );
}
