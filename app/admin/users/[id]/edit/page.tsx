import React from "react";
import AdminLayout from "../../AdminLayout";

interface UserEditPageProps {
  params: { id: string };
}

export default function UserEditPage({ params }: UserEditPageProps) {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit User</h1>
        <p>Editing user with ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{params.id}</span></p>
        {/* Dummy edit form could go here */}
      </div>
    </AdminLayout>
  );
}
