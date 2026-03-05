"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Briefcase, LogOut, Moon, Search, Sun } from "lucide-react";
import { handleLogout } from "@/lib/actions/auth-action";
import LogoutConfirmModal from "@/app/_components/LogoutConfirmModal";

interface WorkerLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/worker/dashboard", label: "Available Jobs", icon: Search },
  { href: "/worker/my-jobs", label: "My Jobs", icon: Briefcase },
  { href: "/worker/notifications", label: "Notifications", icon: Bell },
];

export default function WorkerLayout({ children }: WorkerLayoutProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const initial = saved === "dark" ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const changeTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

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
    <div className="min-h-screen flex bg-gray-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <LogoutConfirmModal
        open={showLogoutModal}
        onConfirm={onLogout}
        onCancel={() => setShowLogoutModal(false)}
        loading={loggingOut}
      />
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b bg-gradient-to-r from-emerald-50 to-white px-6 py-5 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
          <div className="relative h-9 w-9 rounded-xl bg-emerald-100 overflow-hidden dark:bg-slate-800">
            <Image
              src="/images/cleanconnect.png"
              alt="CleanConnect"
              fill
              className="object-contain p-1"
              sizes="36px"
            />
          </div>
          <div>
            <span className="text-sm font-bold leading-none text-slate-900 dark:text-slate-100">CleanConnect</span>
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
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                    : "text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop top bar */}
        <header className="hidden md:flex sticky top-0 z-50 bg-white border-b px-6 py-3 items-center justify-end gap-2 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => changeTheme("light")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                theme === "light"
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <Sun size={13} />
                Day
              </span>
            </button>
            <button
              onClick={() => changeTheme("dark")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                theme === "dark"
                  ? "bg-emerald-900/60 text-emerald-200"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <Moon size={13} />
                Night
              </span>
            </button>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors dark:text-rose-300 dark:hover:bg-rose-900/30"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>

        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-lg bg-emerald-100 overflow-hidden dark:bg-slate-800">
              <Image
                src="/images/cleanconnect.png"
                alt="CleanConnect"
                fill
                className="object-contain p-0.5"
                sizes="32px"
              />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Worker Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeTheme(theme === "light" ? "dark" : "light")}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-red-500 text-sm font-medium dark:text-rose-300"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex dark:bg-slate-900 dark:border-slate-800">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                  active
                    ? "text-emerald-600 dark:text-emerald-300"
                    : "text-gray-400 dark:text-slate-500"
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
