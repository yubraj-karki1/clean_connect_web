import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">We only collect data required to deliver and improve services, such as profile details and booking information.</p>
        <p className="mt-2 text-slate-600 dark:text-slate-300">We do not sell your personal data to third parties.</p>
        <div className="mt-8">
          <Link href="/dashboard" className="text-emerald-600 hover:underline dark:text-emerald-300">Back to Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
