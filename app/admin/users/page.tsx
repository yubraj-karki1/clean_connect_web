"use client";

import { SetStateAction, useEffect, useState } from "react";
import axiosInstance from "@/lib/api/axios";

type User = { _id: string; name: string; email: string; role: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Optional: real API call
    axiosInstance("/api/admin/users")
      .then((r: { data: any; }) => setUsers(r.data ?? []))
      .catch((e: { message: SetStateAction<string | null>; }) => setError(e.message));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Users</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border={1} cellPadding={10} style={{ marginTop: 12, width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
          </tr>
        </thead>
        <tbody>
          {(users.length ? users : [
            { _id: "dummy-1", name: "Dummy User", email: "dummy@test.com", role: "user" },
          ]).map((u) => (
            <tr key={u._id}>
              <td>{u._id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
