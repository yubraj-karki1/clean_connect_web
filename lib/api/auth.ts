import { LoginData, RegisterData } from "@/app/(auth)/schema"
import axios from "./axios"
import { API } from "./endpoints"


export const register = async (registerData: RegisterData) => {
    try {
        // Map frontend model to backend auth DTO
        const { terms, fullName, ...rest } = registerData as any;
        const cleanFullName = (fullName || "").trim();
        const nameParts = cleanFullName.split(/\s+/).filter(Boolean);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ");

        const payload = {
            ...rest,
            fullName: cleanFullName,
            full_name: cleanFullName,
            name: cleanFullName,
            username: cleanFullName,
            firstName,
            lastName,
        };
        const response = await axios.post(API.AUTH.REGISTER, payload)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
}

export const login = async (loginData: LoginData) => {
    const endpoints = [
        API.AUTH.LOGIN,
        "/api/auth/signin",
        "/api/login",
    ];

    const payloads = [
        { email: loginData.email, password: loginData.password },
        { emailOrPhone: loginData.email, password: loginData.password },
        { identifier: loginData.email, password: loginData.password },
        { username: loginData.email, password: loginData.password },
    ];

    let lastError: Error | any = null;

    for (const endpoint of endpoints) {
        for (const payload of payloads) {
            try {
                const response = await axios.post(endpoint, payload);
                return response.data;
            } catch (error: Error | any) {
                const status = error?.response?.status;
                const message =
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.response?.data?.detail ||
                    error?.message;

                lastError = new Error(message || "Login failed");

                // Credentials/auth issues should stop immediately.
                if (status === 401 || status === 403) {
                    throw lastError;
                }

                if (
                    typeof message === "string" &&
                    /(invalid|incorrect|unauthorized|wrong password|user not found|credentials)/i.test(message)
                ) {
                    throw lastError;
                }

                // Try next variant on common route/payload mismatch statuses.
                if (status === 400 || status === 404 || status === 405 || status === 422 || status === 500) {
                    continue;
                }
            }
        }
    }

    throw lastError || new Error("Login failed");
}



export const requestPasswordReset = async (email: string) => {
    const endpoints = [
        API.AUTH.REQUEST_PASSWORD_RESET,
        "/api/auth/forgot-password",
        "/api/auth/forget-password",
        "/api/auth/request-reset",
        "/api/auth/password-reset-request",
        "/api/auth/forgot",
    ];

    let lastError: Error | any = null;

    for (const endpoint of endpoints) {
        try {
            const response = await axios.post(endpoint, { email });
            return response.data;
        } catch (error: Error | any) {
            const status = error?.response?.status;
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.response?.data?.detail ||
                error?.message ||
                "Request password reset failed";

            lastError = new Error(message);

            // Try next route only when the route itself is likely wrong.
            if (status === 404 || status === 405) {
                continue;
            }

            throw lastError;
        }
    }

    throw lastError || new Error("Request password reset failed");
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD(token), { newPassword: newPassword });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
};
