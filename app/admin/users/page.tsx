import React from "react";
import AdminLayout from "./AdminLayout";

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Users</h1>
        <div className="overflow-x-auto">
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
              {/* Dummy rows */}
              <tr className="hover:bg-blue-50">
                <td className="px-4 py-2 border text-blue-700 font-medium">John Doe</td>
                <td className="px-4 py-2 border text-purple-700">john@example.com</td>
                <td className="px-4 py-2 border text-green-600 font-bold">ADMIN</td>
                <td className="px-4 py-2 border">
                  <button className="text-blue-600 hover:bg-blue-100 px-2 py-1 rounded mr-2">View</button>
                  <button className="text-green-600 hover:bg-green-100 px-2 py-1 rounded mr-2">Edit</button>
                  <button className="text-red-600 hover:bg-red-100 px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
              <tr className="hover:bg-pink-50">
                <td className="px-4 py-2 border text-pink-700 font-medium">Jane Smith</td>
                <td className="px-4 py-2 border text-purple-700">jane@example.com</td>
                <td className="px-4 py-2 border text-yellow-600 font-bold">USER</td>
                <td className="px-4 py-2 border">
                  <button className="text-blue-600 hover:bg-blue-100 px-2 py-1 rounded mr-2">View</button>
                  <button className="text-green-600 hover:bg-green-100 px-2 py-1 rounded mr-2">Edit</button>
                  <button className="text-red-600 hover:bg-red-100 px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
