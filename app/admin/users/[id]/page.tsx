import React from "react";
import AdminLayout from "../AdminLayout";

interface UserDetailPageProps {
  params: { id: string };
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Detail</h1>
        <p>User ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{params.id}</span></p>
      </div>
    </AdminLayout>
  );
}
