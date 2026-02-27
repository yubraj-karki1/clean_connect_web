"use client";
import React, { useRef, useState } from "react";
import AdminLayout from "../AdminLayout";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function CreateUserPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("role", form.role);
    if (form.image) {
      formData.append("image", form.image);
    }
    try {
      const token = getCookie("auth_token") || getCookie("token");
      const res = await fetch("http://localhost:5000/api/admin/users/", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        mode: "cors",
        body: formData,
      });
      if (!res.ok) {
        let message = "Failed to create user";
        try {
          const body = await res.json();
          message = body?.message || message;
        } catch {}
        throw new Error(message);
      }

      alert("User created!");
      setForm({ fullName: "", email: "", password: "", role: "user", image: null });
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <section className="mx-auto mt-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl">
        <div className="grid md:grid-cols-[260px_1fr]">
          <div className="bg-gradient-to-b from-slate-900 to-blue-900 px-6 py-8 text-white">
            <h2 className="text-2xl font-bold tracking-tight">Create User</h2>
            <p className="mt-2 text-sm text-blue-100">
              Add a new account with profile info and access role.
            </p>

            <div className="mt-8 flex flex-col items-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="h-28 w-28 rounded-full border-4 border-white/40 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-white/50 bg-white/10 text-xs font-semibold text-white/80">
                  No Image
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
              <button
                type="button"
                className="mt-4 rounded-lg border border-white/40 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-8 md:px-8">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      </section>
    </AdminLayout>
  );
}
