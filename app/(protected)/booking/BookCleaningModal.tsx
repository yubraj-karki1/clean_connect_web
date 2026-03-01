"use client";

import { X, CalendarDays, MapPin, Sparkles, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createBooking, getServices } from "@/lib/api/booking";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedService?: string;
};

export default function BookCleaningModal({ open, onClose, selectedService }: Props) {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [services, setServices] = useState<any[]>([]);

  // Update serviceType if selectedService changes (e.g., when opening modal for a new service)
  useEffect(() => {
    if (open && selectedService) {
      setServiceType(selectedService);
    }
    if (open && !selectedService) {
      setServiceType("");
    }
  }, [open, selectedService]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Fetch services on open
  useEffect(() => {
    if (!open) return;
    getServices().then(res => {
      setServices(res.data || []);
    }).catch(() => setServices([]));
  }, [open]);

  // Prevent background page scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    setPhoneError("");
    if (!serviceType || !date || !time || !address) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      // Compose ISO datetime string from date and time
      const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      const hourStr = match?.[1];
      const minuteStr = match?.[2];
      const ampm = match?.[3];
      let hour24 = hourStr ? parseInt(hourStr, 10) : 0;
      if (ampm && ampm.toUpperCase() === "PM" && hour24 !== 12) hour24 += 12;
      if (ampm && ampm.toUpperCase() === "AM" && hour24 === 12) hour24 = 0;
      const startAt = new Date(date + "T" + String(hour24).padStart(2, "0") + ":" + (minuteStr || "00") + ":00.000Z").toISOString();

      // Map serviceType to a serviceId (for now, just send the name; in real app, fetch from backend)
      const serviceId = serviceType;

      // Compose booking data
      const bookingData = {
        serviceId,
        startAt,
        durationHours: 2, // Default duration, or add a field for this
        notes: "",
        address: {
          line1: address,
        },
        // phone is not in backend DTO, but you may want to add it
      };
      await createBooking(bookingData);
      setSuccess("Booking created successfully!");
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[92vh] w-[98vw] max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50/80 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
              <Sparkles className="text-emerald-600" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Book a Cleaning</h2>
              <p className="text-sm text-slate-600">
                Fill in the details below to schedule your cleaning service.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form className="space-y-4 p-5 sm:space-y-5" onSubmit={handleSubmit}>
          {/* Service Type */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              value={serviceType}
              onChange={e => setServiceType(e.target.value)}
              disabled={services.length === 0}
            >
              <option value="">{services.length === 0 ? "No services available" : "Select a service"}</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>{service.title}</option>
              ))}
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPhone(value);
                  if (value.length === 10) setPhoneError("");
                }}
                placeholder="9876543210"
                className={`w-full rounded-xl border bg-white pl-11 pr-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 ${
                  phoneError
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-300 focus:ring-emerald-200"
                }`}
              />
            </div>

            {phoneError && (
              <p className="mt-1 text-xs text-red-500">{phoneError}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 relative">
              <CalendarDays
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Time <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              value={time}
              onChange={e => setTime(e.target.value)}
            >
              <option value="">Select a time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="23 Main Street, Apt 4B"
                className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          {/* Submit */}
          {error && <p className="text-center text-sm font-medium text-red-600">{error}</p>}
          {success && <p className="text-center text-sm font-medium text-emerald-700">{success}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading || services.length === 0}
          >
            {services.length === 0 ? "No services to book" : (loading ? "Booking..." : "Confirm Booking")}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
