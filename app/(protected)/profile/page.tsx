"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Camera, Home, Loader2, User as UserIcon, Phone, MapPin } from "lucide-react";

import { handleLogout } from "@/lib/actions/auth-action";

type User = {
  id: string;
  fullName: string;
  email: string;
  memberSince: string;
  phoneNumber?: string;
  address?: string;
  // bio?: string;
  bookings: number;
  favorites: number;
  reviews: number;
  profileImage?: string | null;
};

type MessageState = { text: string; type: "ok" | "err" } | null;

export default function UserProfilePage() {
  const router = useRouter();

  // User state (fetched from backend)
  const [user, setUser] = useState<User | null>(null);
  // Fetch user data from backend
  useEffect(() => {
    async function fetchUser() {
      try {
        // Try to get user id from cookie (if available)
        let userId = null;
        try {
          const cookie = document.cookie.split('; ').find(row => row.startsWith('user_data='));
          if (cookie) {
            const userData = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
            userId = userData.id || userData._id;
          }
        } catch {}
        const id = userId || "6980180aaef2c2b8518013a5";
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "No user");
        setUser({
          id: data.data._id,
          fullName: data.data.fullName,
          email: data.data.email,
          memberSince: new Date(data.data.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
          phoneNumber: data.data.phoneNumber,
          address: data.data.address,
          bookings: 0, // Set real value if available
          favorites: 0, // Set real value if available
          reviews: 0, // Set real value if available
          profileImage: data.data.profileImage,
        });
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  // ✅ Only image is editable now (fullName can't change)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  // local preview for chosen file
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
    if (!user || !user.fullName) return "U";
    const parts = user.fullName.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [user]);

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

      // ✅ fullName fixed (read-only) - not changing
      // If your backend requires fullName, keep this line:
      formData.append("fullName", user.fullName);

      // ✅ Upload image only if selected
      if (imageFile) formData.append("image", imageFile);

      // NOTE: If your backend is /api/users/[id], use:
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: formData,
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok || !data?.success) {
        setMessage({
          text: data?.message || "Update failed. Please try again.",
          type: "err",
        });
        return;
      }

      setMessage({ text: data?.message || "Profile updated!", type: "ok" });

      // ✅ update local user state with backend response (image path etc.)
      if (data?.data) setUser((prev) => ({ ...prev, ...data.data }));

      // reset file after success
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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white text-gray-900">
        <Loader2 className="animate-spin" size={32} />
        <span className="ml-3 text-lg font-semibold">Loading profile...</span>
      </main>
    );
  }

  // ...existing code...
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-white text-gray-900">
      {/* ===== Top Bar ===== */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-3"
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
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
            >
              <Home size={16} />
              Home
            </Link>

            <form action={handleLogout}>
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

      {/* ===== Page ===== */}
      <section className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">My Profile</h1>
          <p className="mt-1 text-base text-gray-500">
            Manage your account information and personalize your experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[340px_1fr]">
          {/* Left: Summary */}
          <div className="rounded-2xl border bg-white/90 p-8 shadow flex flex-col items-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full bg-gray-100 border-4 border-emerald-100 shadow">
              {previewUrl || user.profileImage ? (
                <Image
                  src={(previewUrl || user.profileImage) as string}
                  alt="Profile"
                  fill
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
              <p className="truncate text-xl font-bold">{user?.fullName ?? "—"}</p>
              <p className="truncate text-sm text-gray-500">{user?.email ?? "—"}</p>
              <p className="mt-1 text-xs text-gray-400">
                Member since {user?.memberSince ?? "—"}
              </p>
            </div>
            <div className="mt-4 w-full">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Phone size={16} className="text-gray-400" />
                <span className="truncate">{user?.phoneNumber ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin size={16} className="text-gray-400" />
                <span className="truncate">{user?.address ?? "—"}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 w-full">
              <Stat label="Bookings" value={user?.bookings ?? 0} />
              <Stat label="Favorites" value={user?.favorites ?? 0} />
              <Stat label="Reviews" value={user?.reviews ?? 0} />
            </div>
            {/* Bio Section removed */}
          </div>

          {/* Right: Edit Form */}
          <div className="rounded-2xl border bg-white/90 p-8 shadow">
            <div className="mb-4 flex items-center gap-2">
              <UserIcon size={18} className="text-gray-500" />
              <h2 className="text-lg font-bold">Edit profile</h2>
            </div>

            <form
              onSubmit={handleUpdate}
              encType="multipart/form-data"
              className="space-y-6"
            >
              {/* Full Name is NOT editable */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  value={user?.fullName || ""}
                  readOnly
                  disabled
                  className="mt-2 w-full rounded-xl border bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* Profile Image */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Profile Image
                </label>

                <label className="mt-2 flex cursor-pointer items-center justify-between gap-3 rounded-xl border bg-gray-50 px-4 py-3 text-sm">
                  <span className="truncate text-gray-600">
                    {imageFile ? imageFile.name : "Choose an image (optional)"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
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
              </div>

              {/* Bio (editable) removed */}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-600 disabled:opacity-60"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : null}
                {saving ? "Updating..." : "Update Profile"}
              </button>

              {message && (
                <p
                  className={`text-sm font-semibold ${
                    message.type === "ok" ? "text-emerald-600" : "text-red-600"
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white px-3 py-3 text-center">
      <div className="text-lg font-bold text-emerald-600">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{label}</div>
    </div>
  );
}
