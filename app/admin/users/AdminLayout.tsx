"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <aside className="w-64 bg-gradient-to-b from-blue-700 via-purple-700 to-pink-700 text-white border-r flex flex-col p-6 shadow-xl">
        <h2 className="text-2xl font-extrabold mb-10 tracking-wide text-white drop-shadow">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/admin/users" && pathname.startsWith("/admin/users/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                  isActive
                    ? "bg-white/20 text-white ring-1 ring-white/40"
                    : "bg-black/15 hover:bg-black/25 text-white/95"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
