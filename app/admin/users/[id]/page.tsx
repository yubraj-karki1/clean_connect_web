export default function AdminUserDetail({ params }: { params: { id: string } }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin User Detail</h1>
      <p>ID: {params.id}</p>
    </div>
  );
}
