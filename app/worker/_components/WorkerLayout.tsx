"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  LogOut,
  Search,
} from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-action";
import LogoutConfirmModal from "@/app/_components/LogoutConfirmModal";

interface WorkerLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/worker/dashboard", label: "Available Jobs", icon: Search },
  { href: "/worker/my-jobs", label: "My Jobs", icon: Briefcase },
];

export default function WorkerLayout({ children }: WorkerLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await handleLogout();
    } catch (_) {}
    document.cookie = "auth_token=; Max-Age=0; path=/";
    document.cookie = "user_data=; Max-Age=0; path=/";
    document.cookie = "token=; Max-Age=0; path=/";
    document.cookie = "role=; Max-Age=0; path=/";
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <LogoutConfirmModal
        open={showLogoutModal}
        onConfirm={onLogout}
        onCancel={() => setShowLogoutModal(false)}
        loading={loggingOut}
      />
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b">
          <div className="relative h-9 w-9 rounded-xl bg-emerald-100 overflow-hidden">
            <Image
              src="/images/cleanconnect.png"
              alt="CleanConnect"
              fill
              className="object-contain p-1"
              sizes="36px"
            />
          </div>
          <div>
            <span className="font-bold text-sm leading-none">CleanConnect</span>
            <span className="block text-[11px] text-emerald-600 font-medium">
              Worker Portal
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop top bar */}
        <header className="hidden md:flex sticky top-0 z-50 bg-white border-b px-6 py-3 items-center justify-end">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-lg bg-emerald-100 overflow-hidden">
              <Image
                src="/images/cleanconnect.png"
                alt="CleanConnect"
                fill
                className="object-contain p-0.5"
                sizes="32px"
              />
            </div>
            <span className="font-bold text-sm">Worker Portal</span>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-red-500 text-sm font-medium"
          >
            Logout
          </button>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                  active ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Page content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
