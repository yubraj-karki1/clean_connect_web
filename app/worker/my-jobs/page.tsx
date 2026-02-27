"use client";

import { useEffect, useState } from "react";
import WorkerLayout from "../_components/WorkerLayout";
import { getWorkerJobs, completeJob } from "@/lib/api/booking";
import {
  MapPin,
  CalendarDays,
  Clock,
  Loader2,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Sparkles,
  CircleDot,
} from "lucide-react";

const statusColors: Record<string, string> = {
  accepted: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function WorkerMyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"active" | "completed">("active");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getWorkerJobs();
      setJobs(res.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleComplete = async (id: string) => {
    setCompletingId(id);
    try {
      await completeJob(id);
      // Update status in local state
      setJobs((prev) =>
        prev.map((j) =>
          (j._id || j.id) === id ? { ...j, status: "completed" } : j
        )
      );
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err.message ||
          "Failed to mark as complete"
      );
    } finally {
      setCompletingId(null);
    }
  };

  const activeJobs = jobs.filter(
    (j) => j.status !== "completed" && j.status !== "cancelled"
  );
  const completedJobs = jobs.filter((j) => j.status === "completed");
  const displayedJobs = tab === "active" ? activeJobs : completedJobs;

  return (
    <WorkerLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Jobs you&apos;ve accepted — track and complete them here.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {(
          [
            { key: "active", label: "Active", count: activeJobs.length },
            {
              key: "completed",
              label: "Completed",
              count: completedJobs.length,
            },
          ] as const
        ).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                tab === key ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 size={32} className="animate-spin mb-3" />
          <span className="text-sm">Loading your jobs…</span>
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
      ) : displayedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Briefcase size={28} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            {tab === "active" ? "No active jobs" : "No completed jobs yet"}
          </h2>
          <p className="mt-1 text-sm text-gray-400 max-w-sm">
            {tab === "active"
              ? "Accept jobs from the Available Jobs page to see them here."
              : "Completed jobs will appear here once you finish them."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayedJobs.map((job) => {
            const id = job._id || job.id;
            const isCompleting = completingId === id;
            const isDone = job.status === "completed";
            const service =
              job.serviceId && typeof job.serviceId === "object"
                ? job.serviceId
                : null;
            const address =
              job.addressId && typeof job.addressId === "object"
                ? job.addressId
                : job.address || null;

            return (
              <div
                key={id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                  isDone ? "border-emerald-200" : "border-gray-200"
                }`}
              >
                {/* Top row: service + status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                      <Sparkles size={16} className="text-emerald-600" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">
                      {service?.title || job.serviceId || "Cleaning Service"}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                      statusColors[job.status?.toLowerCase()] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <CircleDot size={10} />
                    {job.status || "pending"}
                  </span>
                </div>

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
                      <Clock size={15} className="text-gray-400 ml-2" />
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
                      <span>{job.durationHours}h duration</span>
                    </div>
                  )}

                  {address && (
                    <div className="flex items-start gap-2">
                      <MapPin
                        size={15}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <span>
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

                {/* Notes */}
                {job.notes && (
                  <p className="mt-3 text-xs text-gray-500 italic line-clamp-2">
                    &ldquo;{job.notes}&rdquo;
                  </p>
                )}

                {/* Actions */}
                {!isDone && (
                  <button
                    onClick={() => handleComplete(id)}
                    disabled={isCompleting}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-70"
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Completing…
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Mark Complete
                      </>
                    )}
                  </button>
                )}

                {isDone && (
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-600">
                    <CheckCircle size={16} />
                    Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </WorkerLayout>
  );
}
