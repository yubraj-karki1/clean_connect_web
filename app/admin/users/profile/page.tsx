"use client";

import { useState } from "react";
import axiosInstance from "@/lib/api/axios";

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export default function UserProfilePage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const userId = getCookie("userId"); // set this at login
    if (!userId) {
      setLoading(false);
      setMsg("Missing userId cookie. Save userId on login.");
      return;
    }

    const fd = new FormData(e.currentTarget);

    try {
      await axiosInstance(`/api/auth/${userId}`, {
        method: "PUT",
      });
      setMsg("Profile updated ✅");
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1>My Profile</h1>

      <form onSubmit={onSubmit} encType="multipart/form-data">
        <div style={{ marginTop: 12 }}>
          <label>Name</label><br />
          <input name="name" />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Phone</label><br />
          <input name="phone" />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Address</label><br />
          <input name="address" />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>New Image</label><br />
          <input name="image" type="file" accept="image/*" />
        </div>

        <button disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
