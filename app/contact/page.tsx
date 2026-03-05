import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-950 via-teal-900 to-emerald-900 px-4 py-12 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl shadow-emerald-900/20">
        <section className="bg-gradient-to-r from-teal-800 to-emerald-700 px-8 py-10 text-white">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-100">CleanConnect Support</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-emerald-50">
            Need help with a booking or payment? Our team is available during business hours and usually replies quickly.
          </p>
        </section>

        <section className="grid gap-6 px-8 py-8 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Email</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">support@cleanconnect.com</p>
            <p className="mt-1 text-sm text-slate-600">Best for account, billing, and booking issues.</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Phone</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">9845345343</p>
            <p className="mt-1 text-sm text-slate-600">Best for urgent updates or same-day changes.</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
            <p className="text-sm font-medium text-slate-500">Working Hours</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">Mon-Fri, 9:00 AM - 6:00 PM</p>
            <p className="mt-1 text-sm text-slate-600">Average response time: within 2 business hours.</p>
          </article>
        </section>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-8 py-6">
          <p className="text-sm text-slate-600">We are here to make your cleaning experience smooth.</p>
          <Link
            href="/dashboard"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
