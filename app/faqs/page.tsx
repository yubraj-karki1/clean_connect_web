import Link from "next/link";

export default function FaqsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold">FAQs</h1>
        <div className="mt-4 space-y-4 text-slate-600 dark:text-slate-300">
          <p><span className="font-semibold text-slate-800 dark:text-slate-100">How do I book?</span> Go to Bookings and click Book Now.</p>
          <p><span className="font-semibold text-slate-800 dark:text-slate-100">Can I cancel?</span> Yes, depending on booking status and policy.</p>
          <p><span className="font-semibold text-slate-800 dark:text-slate-100">How do favorites work?</span> Save cleaners from dashboard and access them in Favorites.</p>
        </div>
        <div className="mt-8">
          <Link href="/dashboard" className="text-emerald-600 hover:underline dark:text-emerald-300">Back to Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
