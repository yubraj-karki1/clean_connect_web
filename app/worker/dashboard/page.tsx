"use client";

import { useEffect, useState } from "react";
import WorkerLayout from "../_components/WorkerLayout";
import { getAvailableJobs, getServices, acceptJob } from "@/lib/api/booking";
import {
  MapPin,
  CalendarDays,
  Clock,
  Loader2,
  Search,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Sparkles,
  DollarSign,
  Filter,
  RefreshCw,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

/* Service category emoji mapping */
const serviceEmojis: Record<string, string> = {
  "home cleaning": "🏠",
  "office cleaning": "🏢",
  "carpet cleaning": "🧽",
  "deep cleaning": "✨",
  "window cleaning": "🪟",
  "move-in/out": "📦",
};

function getEmoji(title: string) {
  const key = title.toLowerCase();
  for (const [k, v] of Object.entries(serviceEmojis)) {
    if (key.includes(k.split(" ")[0])) return v;
  }
  return "🧹";
}

export default function WorkerDashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAvailableJobs();
      setJobs(res.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await getServices();
      setServices(res.data || []);
    } catch {
      setServices([]);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchServices();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const handleAccept = async (id: string) => {
    setAcceptingId(id);
    try {
      await acceptJob(id);
      setSuccessId(id);
      setTimeout(() => {
        setJobs((prev) => prev.filter((j) => (j._id || j.id) !== id));
        setSuccessId(null);
      }, 1200);
    } catch (err: any) {
      alert(
        err?.response?.data?.message || err.message || "Failed to accept job"
      );
    } finally {
      setAcceptingId(null);
    }
  };

  /* Build filter options from services */
  const serviceFilterOptions = services.map((s) => ({
    id: s._id,
    title: s.title,
  }));

  const filteredJobs = jobs.filter((job) => {
    // Service filter
    if (activeFilter !== "all") {
      const jobServiceId =
        job.serviceId && typeof job.serviceId === "object"
          ? job.serviceId._id
          : job.serviceId;
      if (jobServiceId !== activeFilter) return false;
    }
    // Search
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title =
      job.serviceId && typeof job.serviceId === "object"
        ? job.serviceId.title
        : job.serviceId || "";
    const addr =
      job.addressId && typeof job.addressId === "object"
        ? `${job.addressId.line1} ${job.addressId.city} ${job.addressId.state}`
        : job.address?.line1 || "";
    return title.toLowerCase().includes(q) || addr.toLowerCase().includes(q);
  });

  /* Stats */
  const totalJobs = jobs.length;
  const uniqueServices = new Set(
    jobs.map((j) =>
      j.serviceId && typeof j.serviceId === "object"
        ? j.serviceId._id
        : j.serviceId
    )
  ).size;

  return (
    <WorkerLayout>
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white p-6 md:p-8 mb-8">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Find Your Next Job 🧹
          </h1>
          <p className="mt-2 text-white/90 text-sm md:text-base max-w-lg">
            Browse available cleaning requests from customers near you. Accept a
            job, show up, and earn.
          </p>

          {/* Quick stats */}
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-sm px-4 py-2.5">
              <Briefcase size={16} />
              <span className="text-sm font-semibold">
                {totalJobs} job{totalJobs !== 1 && "s"} available
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-sm px-4 py-2.5">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">
                {uniqueServices} service type{uniqueServices !== 1 && "s"}
              </span>
            </div>
          </div>
        </div>
        {/* Decorative blob */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* ── Cleaning service categories ── */}
      {services.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Cleaning Services
            </h2>
            <span className="text-xs text-gray-400">
              Tap to filter by type
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* "All" pill */}
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex items-center gap-2 shrink-0 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
                activeFilter === "all"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <span className="text-lg">🧹</span>
              All Jobs
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  activeFilter === "all"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {jobs.length}
              </span>
            </button>

            {services.map((s) => {
              const count = jobs.filter((j) => {
                const jid =
                  j.serviceId && typeof j.serviceId === "object"
                    ? j.serviceId._id
                    : j.serviceId;
                return jid === s._id;
              }).length;

              return (
                <button
                  key={s._id}
                  onClick={() =>
                    setActiveFilter(activeFilter === s._id ? "all" : s._id)
                  }
                  className={`flex items-center gap-2 shrink-0 rounded-2xl border px-5 py-3 text-sm font-semibold transition-all ${
                    activeFilter === s._id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="text-lg">{getEmoji(s.title)}</span>
                  {s.title}
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      activeFilter === s._id
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search & actions bar ── */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by service or location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-all disabled:opacity-60 shrink-0"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ── Job listings ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-3" />
          <span className="text-sm">Loading available jobs…</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle size={32} className="text-red-400 mb-3" />
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={fetchJobs}
            className="mt-4 text-sm font-medium text-emerald-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Briefcase size={28} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            {searchQuery || activeFilter !== "all"
              ? "No matching jobs"
              : "No available jobs right now"}
          </h2>
          <p className="mt-1 text-sm text-gray-400 max-w-sm">
            {searchQuery || activeFilter !== "all"
              ? "Try adjusting your filters or search."
              : "Check back soon — new bookings appear as customers create them."}
          </p>
          {(searchQuery || activeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="mt-4 text-sm font-medium text-emerald-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredJobs.length}
              </span>{" "}
              job{filteredJobs.length !== 1 && "s"}
              {activeFilter !== "all" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="text-emerald-600 font-medium">
                    {services.find((s) => s._id === activeFilter)?.title}
                  </span>
                </span>
              )}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => {
              const id = job._id || job.id;
              const isAccepting = acceptingId === id;
              const isSuccess = successId === id;
              const service =
                job.serviceId && typeof job.serviceId === "object"
                  ? job.serviceId
                  : null;
              const address =
                job.addressId && typeof job.addressId === "object"
                  ? job.addressId
                  : job.address || null;
              const serviceTitle =
                service?.title || job.serviceId || "Cleaning Service";

              return (
                <div
                  key={id}
                  className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                    isSuccess
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-200"
                  }`}
                >
                  {/* Service header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                        {getEmoji(serviceTitle)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 text-sm block">
                          {serviceTitle}
                        </span>
                        {service?.price && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <DollarSign size={12} />
                            {service.price}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* "New" badge for recent jobs */}
                    {job.createdAt &&
                      Date.now() - new Date(job.createdAt).getTime() <
                        24 * 60 * 60 * 1000 && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                          New
                        </span>
                      )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 mb-3" />

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {job.startAt && (
                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} className="text-gray-400" />
                        <span>
                          {new Date(job.startAt).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-gray-300">·</span>
                        <Clock size={15} className="text-gray-400" />
                        <span>
                          {new Date(job.startAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}

                    {job.durationHours && (
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-gray-400" />
                        <span>{job.durationHours}h estimated</span>
                      </div>
                    )}

                    {address && (
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={15}
                          className="text-gray-400 mt-0.5 shrink-0"
                        />
                        <span className="line-clamp-1">
                          {typeof address === "object"
                            ? [
                                address.line1,
                                address.city,
                                address.state,
                                address.zip,
                              ]
                                .filter(Boolean)
                                .join(", ")
                            : address}
                        </span>
                      </div>
                    )}
                  </div>

                  {job.notes && (
                    <p className="mt-3 text-xs text-gray-500 italic line-clamp-2 bg-gray-50 rounded-lg px-3 py-2">
                      &ldquo;{job.notes}&rdquo;
                    </p>
                  )}

                  {/* Accept button */}
                  <button
                    onClick={() => handleAccept(id)}
                    disabled={isAccepting || isSuccess}
                    className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                      isSuccess
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white active:scale-[0.98]"
                    } disabled:opacity-70`}
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircle size={16} /> Accepted!
                      </>
                    ) : isAccepting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Accepting…
                      </>
                    ) : (
                      <>
                        Accept Job
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </WorkerLayout>
  );
}
