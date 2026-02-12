// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";

// export default function ProfileForm() {
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState<string | null>(null);
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await fetch("/api/auth/me", { credentials: "include" });
//         const data = await res.json();
//         setUser(data);
//       } catch (err) {
//         setMsg("Failed to load user data");
//       }
//     }
//     fetchUser();
//   }, []);

//   async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setMsg(null);
//     setLoading(true);

//     const fd = new FormData(e.currentTarget);

//     try {
//       const res = await fetch(`/api/auth/${user?._id || user?.id}`, { method: "PUT", body: fd });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data.message ?? `Failed (${res.status})`);
//       setMsg("Profile updated ✅");
//       // Update user state with new data (especially image)
//       if (data.data) setUser((prev: any) => ({ ...prev, ...data.data }));
//     } catch (err: any) {
//       setMsg(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (!user) {
//     return <div className="p-6 text-center">Loading profile...</div>;
//   }

//   return (
//     <form onSubmit={onSubmit} className="mt-6 space-y-4 max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
//       {msg && <div className="p-3 bg-gray-50 rounded">{msg}</div>}

//       <div className="flex flex-col items-center mb-4">
//         {user.profileImage ? (
//           <Image src={user.profileImage} alt="Profile" width={96} height={96} className="rounded-full object-cover" />
//         ) : (
//           <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">
//             <span>👤</span>
//           </div>
//         )}
//       </div>

//       <input
//         className="w-full p-3 border rounded"
//         name="fullName"
//         placeholder="Full name"
//         defaultValue={user.fullName || ""}
//       />
//       <input
//         className="w-full p-3 border rounded"
//         name="phoneNumber"
//         placeholder="Phone"
//         defaultValue={user.phoneNumber || ""}
//       />
//       <input
//         className="w-full p-3 border rounded"
//         name="address"
//         placeholder="Address"
//         defaultValue={user.address || ""}
//       />
//       <input className="w-full p-3 border rounded" name="image" type="file" accept="image/*" />

//       <button disabled={loading} className="w-full p-3 rounded bg-black text-white disabled:opacity-60">
//         {loading ? "Saving..." : "Save Changes"}
//       </button>
//     </form>
//   );
// }

