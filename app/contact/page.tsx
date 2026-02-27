import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Need help with a booking or payment?</p>
        <ul className="mt-3 space-y-1 text-slate-600 dark:text-slate-300">
          <li>Email: support@cleanconnect.com</li>
          <li>Phone: 9845345343</li>
          <li>Hours: Mon-Fri, 9:00 AM - 6:00 PM</li>
        </ul>
        <div className="mt-8">
          <Link href="/dashboard" className="text-emerald-600 hover:underline dark:text-emerald-300">Back to Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
