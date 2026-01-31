"use client";

import { useState } from "react";
import axiosInstance from "@/lib/api/axios";

export default function AdminUserCreatePage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      // As per requirement: POST /api/auth/user (multer)
      const res = await axiosInstance("/api/auth/user", {
        method: "POST",
      });
      setMsg("User created ✅");
      form.reset();
      console.log(res);
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h1>Create User</h1>

      <form onSubmit={onSubmit} encType="multipart/form-data">
        <div style={{ marginTop: 12 }}>
          <label>Name</label><br />
          <input name="name" required />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Email</label><br />
          <input name="email" type="email" required />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Password</label><br />
          <input name="password" type="password" required />
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Role</label><br />
          <select name="role" defaultValue="user">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
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
          <label>Image</label><br />
          <input name="image" type="file" accept="image/*" />
        </div>

        <button disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
