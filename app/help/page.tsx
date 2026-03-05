import Link from "next/link";

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Find support for bookings, account access, favorites, and payments.</p>
        <p className="mt-2 text-slate-600 dark:text-slate-300">For urgent issues, contact support@cleanconnect.com.</p>
        <div className="mt-8">
          <Link href="/dashboard" className="text-emerald-600 hover:underline dark:text-emerald-300">Back to Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
