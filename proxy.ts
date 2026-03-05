import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = req.cookies.get("token")?.value; // set on login
  const role = req.cookies.get("role")?.value;   // set on login (e.g. "admin" | "user" | "worker")

  const isAdminRoute = path.startsWith("/admin");
  const isUserRoute = path.startsWith("/user");
  const isWorkerRoute = path.startsWith("/worker");
  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/booking") ||
    path.startsWith("/favorite") ||
    path.startsWith("/profile");

  // must be logged in for any protected area
  if ((isAdminRoute || isUserRoute || isWorkerRoute || isProtectedRoute) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // must be admin
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // must be worker
  if (isWorkerRoute && role !== "worker") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/worker/:path*",
    "/dashboard/:path*",
    "/booking/:path*",
    "/favorite/:path*",
    "/profile/:path*",
  ],
};
