"use client";

import { useState } from "react";

export default function ProfileForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget); // multer => always FormData

    try {
      const res = await fetch(`/api/auth/${userId}`, { method: "PUT", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message ?? `Failed (${res.status})`);
      setMsg("Profile updated ✅");
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4 max-w-xl">
      {!userId && (
        <div className="p-3 bg-yellow-50 text-yellow-800 rounded">
          Missing <b>userId</b> cookie. Set it after login.
        </div>
      )}

      {msg && <div className="p-3 bg-gray-50 rounded">{msg}</div>}

      <input className="w-full p-3 border rounded" name="name" placeholder="Full name" />
      <input className="w-full p-3 border rounded" name="phone" placeholder="Phone" />
      <input className="w-full p-3 border rounded" name="address" placeholder="Address" />
      <input className="w-full p-3 border rounded" name="image" type="file" accept="image/*" />

      <button disabled={loading || !userId} className="w-full p-3 rounded bg-black text-white disabled:opacity-60">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
