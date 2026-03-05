"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminLayout from "./AdminLayout";
import { useRouter } from "next/navigation";
import { deleteAdminUser, listAdminUsers } from "@/lib/api/admin";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const handleView = (id: string) => {
    router.push(`/admin/users/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/users/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteAdminUser(id);
      setUsers(users => users.filter(u => u._id !== id));
      alert("User deleted successfully");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting user");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminUsers();
      setUsers(data as User[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = user.fullName?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || name.includes(q) || email.includes(q);
      const matchesRole =
        roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
      return matchesQuery && matchesRole;
    });
  }, [users, query, roleFilter]);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-blue-600">Users</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadUsers}
              className="rounded bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              Refresh
            </button>
            <Link
              href="/admin/users/create"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add User
            </Link>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="worker">Worker</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-lg text-blue-500">Loading users...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <table className="min-w-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 border rounded shadow">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                  <th className="px-4 py-2 border font-semibold">Name</th>
                  <th className="px-4 py-2 border font-semibold">Email</th>
                  <th className="px-4 py-2 border font-semibold">Role</th>
                  <th className="px-4 py-2 border font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-blue-50">
                      <td className="px-4 py-2 border text-blue-700 font-medium">{user.fullName}</td>
                      <td className="px-4 py-2 border text-purple-700">{user.email}</td>
                      <td className={`px-4 py-2 border font-bold ${user.role === "ADMIN" || user.role === "admin" ? "text-green-600" : "text-yellow-600"}`}>{user.role.toUpperCase()}</td>
                      <td className="px-4 py-2 border">
                        <button onClick={() => handleView(user._id)} className="text-blue-600 hover:bg-blue-100 px-2 py-1 rounded mr-2">View</button>
                        <button onClick={() => handleEdit(user._id)} className="text-green-600 hover:bg-green-100 px-2 py-1 rounded mr-2">Edit</button>
                        <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:bg-red-100 px-2 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
