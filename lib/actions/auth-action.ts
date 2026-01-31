"use server";

import { LoginData, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken, setUserData, clearAuthCookies } from "../cookie";
import { redirect } from "next/navigation";

/* ===================== REGISTER ===================== */
export const handleRegister = async (values: RegisterData) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    return {
      success: data.success,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: "Server is offline or unreachable",
    };
  }
};

/* ===================== LOGIN (🔥 FIXED) ===================== */
export const handleLogin = async (values: LoginData) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Invalid email or password",
      };
    }

    // ✅ Set cookies only on success
    await setAuthToken(data.token);
    await setUserData(data.data);

    return {
      success: true,
      message: "Login successful",
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Login failed. Server unreachable.",
    };
  }
};

/* ===================== LOGOUT ===================== */
export const handleLogout = async () => {
  await clearAuthCookies();
  redirect("/login");
};
