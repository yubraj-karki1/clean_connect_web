"use server";

import { cookies } from "next/headers";

/* ===================== TYPES ===================== */
export type AuthUser = {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
};

/* ===================== GET AUTH USER ===================== */
export const getAuthUser = async (): Promise<AuthUser | null> => {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("user_data");

  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie.value) as AuthUser;
  } catch {
    return null;
  }
};

/* ===================== LOGOUT ===================== */
export const handleLogout = async () => {
  const cookieStore = cookies();

  (await cookieStore).set("auth_token", "", { maxAge: 0 });
  (await cookieStore).set("user_data", "", { maxAge: 0 });
};
