"use client";

import { X, CalendarDays, MapPin, Sparkles, Phone } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BookCleaningModal({ open, onClose }: Props) {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }

    setPhoneError("");
    // TODO: call API later
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[92vw] max-w-md rounded-2xl bg-white shadow-xl border">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Sparkles className="text-emerald-600" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Book a Cleaning</h2>
              <p className="text-sm text-gray-500">
                Fill in the details below to schedule your cleaning service.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form className="p-5 space-y-4" onSubmit={handleSubmit}>
          {/* Service Type */}
          <div>
            <label className="text-sm font-semibold">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Select a service</option>
              <option>Home Cleaning</option>
              <option>Office Cleaning</option>
              <option>Carpet Cleaning</option>
              <option>Deep Cleaning</option>
              <option>Window Cleaning</option>
              <option>Move-in/out</option>
            </select>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-sm font-semibold">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
                className={`w-full rounded-xl border pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 ${
                  phoneError
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-emerald-400"
                }`}
              />
            </div>

            {phoneError && (
              <p className="mt-1 text-xs text-red-500">{phoneError}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-semibold">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 relative">
              <CalendarDays
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                required
                className="w-full rounded-xl border pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="text-sm font-semibold">
              Time <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">Select a time</option>
              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>01:00 PM</option>
              <option>02:00 PM</option>
              <option>03:00 PM</option>
              <option>04:00 PM</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-semibold">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                required
                placeholder="23 Main Street, Apt 4B"
                className="w-full rounded-xl border pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-600"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
