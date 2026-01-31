export default function AdminUserEdit({ params }: { params: { id: string } }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Edit User</h1>
      <p>ID: {params.id}</p>
    </div>
  );
}
