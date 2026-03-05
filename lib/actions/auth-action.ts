"use server";

import { cookies } from "next/headers";
import { register, login, 
    requestPasswordReset, resetPassword } from "../api/auth";
import { register as apiRegister } from "@/lib/api/auth";
import { setAuthToken, setUserData } from "@/lib/cookie";
import { RegisterData } from "@/app/(auth)/schema";

/* ===================== TYPES ===================== */
export type AuthUser = {
  id: string;
  email: string;
  role: "admin" | "user" | "worker";
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
  const cookieStore = await cookies();

  cookieStore.set("auth_token", "", { maxAge: 0, path: "/" });
  cookieStore.set("user_data", "", { maxAge: 0, path: "/" });
  cookieStore.set("token", "", { maxAge: 0, path: "/" });
  cookieStore.set("role", "", { maxAge: 0, path: "/" });
};

export const handleRequestPasswordReset = async (email: string) => {
    try {
        const response = await requestPasswordReset(email);
        if (response.success) {
            return {
                success: true,
                message: 'Password reset email sent successfully'
            }
        }
        return { success: false, message: response.message || 'Request password reset failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Request password reset action failed' }
    }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await resetPassword(token, newPassword);
        if (response.success) {
            return {
                success: true,
                message: 'Password has been reset successfully'
            }
        }
        return { success: false, message: response.message || 'Reset password failed' }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Reset password action failed' }
    }
};

/* ===================== REGISTER ===================== */
export const handleRegister = async (data: RegisterData) => {
  try {
    const response = await apiRegister(data);
    // Backend returns { success: true, message, data } — no token on register
    if (response.success) {
      return { success: true, message: response.message || "Registration successful" };
    }
    return { success: false, message: response.message || "Registration failed" };
  } catch (error: any) {
    return { success: false, message: error.message || "Registration failed" };
  }
};

