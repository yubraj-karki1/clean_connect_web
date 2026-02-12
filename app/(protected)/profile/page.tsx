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
  phoneNumber?: string; // ✅ added
  address?: string;     // ✅ added
  bookings: number;
  favorites: number;
  reviews: number;
  profileImage?: string | null;
};

type MessageState = { text: string; type: "ok" | "err" } | null;

export default function UserProfilePage() {
  const router = useRouter();

  // Dummy data (replace later with API data)
  const [user, setUser] = useState<User>({
    id: "dummyid123",
    fullName: "Yubraj Karki",
    email: "wgsrg@gmail.com",
    memberSince: "January 31, 2026",
    phoneNumber: "98XXXXXXXX",     
    address: "Kathmandu, Nepal", 
    bookings: 0,
    favorites: 0,
    reviews: 0,
    profileImage: null,
  });

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
    const parts = user.fullName.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [user.fullName]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();

      // ✅ fullName fixed (read-only) - not changing
      // If your backend requires fullName, keep this line:
      formData.append("fullName", user.fullName);

      // ✅ Upload image only if selected
      if (imageFile) formData.append("image", imageFile);

      // NOTE: If your backend is /api/auth/me (recommended), change to:
      // const res = await fetch(`/api/auth/me`, { method: "PUT", body: formData });
      const res = await fetch(`/api/auth/${user.id}`, {
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

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* ===== Top Bar ===== */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update your profile picture.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[360px_1fr]">
          {/* Left: Summary */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                {previewUrl || user.profileImage ? (
                  <Image
                    src={(previewUrl || user.profileImage) as string}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-600">
                    {initials}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-bold">{user.fullName}</p>
                <p className="truncate text-sm text-gray-500">{user.email}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Member since {user.memberSince}
                </p>
              </div>
            </div>

            {/* ✅ Phone + Address */}
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span className="truncate">{user.phoneNumber || "—"}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} className="text-gray-400" />
                <span className="truncate">{user.address || "—"}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Stat label="Bookings" value={user.bookings} />
              <Stat label="Favorites" value={user.favorites} />
              <Stat label="Reviews" value={user.reviews} />
            </div>
          </div>

          {/* Right: Edit Form */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <UserIcon size={18} className="text-gray-500" />
              <h2 className="text-base font-bold">Edit profile</h2>
            </div>

            <form
              onSubmit={handleUpdate}
              encType="multipart/form-data"
              className="space-y-5"
            >
              {/* ✅ Full Name is NOT editable */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  value={user.fullName}
                  readOnly
                  disabled
                  className="mt-2 w-full rounded-xl border bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* ✅ Phone number (read-only) */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  value={user.phoneNumber || ""}
                  readOnly
                  disabled
                  className="mt-2 w-full rounded-xl border bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none cursor-not-allowed"
                />
              </div>

              {/* ✅ Address (read-only) */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Address
                </label>
                <input
                  value={user.address || ""}
                  readOnly
                  disabled
                  className="mt-2 w-full rounded-xl border bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none cursor-not-allowed"
                />
              </div>

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
