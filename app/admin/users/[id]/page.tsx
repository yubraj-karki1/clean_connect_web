"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { useParams } from "next/navigation";
import { getAdminUserById } from "@/lib/api/admin";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      setBackendError(null);
      try {
        const data = await getAdminUserById(id);
        setUser(data);
      } catch (err: unknown) {
        if (typeof err === "object" && err && "response" in err) {
          try {
            const e = err as { response?: { data?: unknown }; message?: string };
            setBackendError(JSON.stringify(e.response?.data, null, 2));
          } catch {}
        }
        const msg = err instanceof Error ? err.message : "Error fetching user";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  return (
    <AdminLayout>
      <div className="p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded shadow min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">User Detail</h1>
        {loading ? (
          <div className="text-center py-10 text-lg text-blue-500">Loading user...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}
            {backendError && (
              <pre className="mt-4 text-xs text-gray-500 bg-gray-100 p-2 rounded overflow-x-auto">{backendError}</pre>
            )}
          </div>
        ) : user ? (
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-8 border-blue-400 max-w-lg mx-auto">
            <div className="mb-4">
              <span className="block text-lg font-semibold text-purple-700 mb-2">User ID:</span>
              <span className="font-mono bg-blue-50 px-3 py-2 rounded text-blue-800 text-lg">{user._id}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Name:</span> <span className="text-blue-700">{user.fullName}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Email:</span> <span className="text-purple-700">{user.email}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Role:</span> <span className={user.role.toLowerCase() === "admin" ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>{user.role.toUpperCase()}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">User not found.</div>
        )}
      </div>
    </AdminLayout>
  );
}
