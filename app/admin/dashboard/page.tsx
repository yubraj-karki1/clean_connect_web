import React from "react";
import AdminLayout from "../users/AdminLayout";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded shadow">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Admin Dashboard</h1>
        <div className="flex items-center gap-6">
          <div className="bg-blue-500 text-white rounded-lg p-6 shadow-lg flex-1">
            <h2 className="text-xl font-semibold mb-2">Total Users</h2>
            <p className="text-3xl font-bold">2</p>
          </div>
          <div className="bg-purple-500 text-white rounded-lg p-6 shadow-lg flex-1">
            <h2 className="text-xl font-semibold mb-2">Active Admins</h2>
            <p className="text-3xl font-bold">1</p>
          </div>
          <div className="bg-pink-500 text-white rounded-lg p-6 shadow-lg flex-1">
            <h2 className="text-xl font-semibold mb-2">Active Users</h2>
            <p className="text-3xl font-bold">1</p>
          </div>
        </div>
        <p className="mt-8 text-lg text-gray-700">Welcome to the admin dashboard! Here you can manage users and view statistics.</p>
      </div>
    </AdminLayout>
  );
}
