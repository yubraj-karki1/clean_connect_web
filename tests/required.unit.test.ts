import { API } from "@/lib/api/endpoints";
import { loginSchema, registerSchema } from "@/app/(auth)/schema";
import axios from "@/lib/api/axios";
import { login, requestPasswordReset, resetPassword } from "@/lib/api/auth";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockedAxios = axios as unknown as { post: jest.Mock };

describe("required unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("API AUTH LOGIN path is correct", () => {
    expect(API.AUTH.LOGIN).toBe("/api/auth/login");
  });

  it("API AUTH REGISTER path is correct", () => {
    expect(API.AUTH.REGISTER).toBe("/api/auth/register");
  });

  it("API AUTH REQUEST_PASSWORD_RESET path is correct", () => {
    expect(API.AUTH.REQUEST_PASSWORD_RESET).toBe("/api/auth/request-password-reset");
  });

  it("API AUTH RESET_PASSWORD builds path", () => {
    expect(API.AUTH.RESET_PASSWORD("abc")).toBe("/api/auth/reset-password/abc");
  });

  it("API ADMIN USERS BY_ID builds path", () => {
    expect(API.ADMIN.USERS.BY_ID("u1")).toBe("/api/admin/users/u1");
  });

  it("API ADMIN USERS UPDATE builds path", () => {
    expect(API.ADMIN.USERS.UPDATE("u2")).toBe("/api/admin/users/u2");
  });

  it("API ADMIN USERS DELETE builds path", () => {
    expect(API.ADMIN.USERS.DELETE("u3")).toBe("/api/admin/users/u3");
  });

  it("API ADMIN BOOKINGS BY_ID builds path", () => {
    expect(API.ADMIN.BOOKINGS.BY_ID("b1")).toBe("/api/bookings/b1");
  });

  it("API ADMIN BOOKINGS ACCEPT builds path", () => {
    expect(API.ADMIN.BOOKINGS.ACCEPT("b2")).toBe("/api/bookings/b2/accept");
  });

  it("API WORKER AVAILABLE_JOBS path is correct", () => {
    expect(API.WORKER.AVAILABLE_JOBS).toBe("/api/bookings/available");
  });

  it("API WORKER MY_JOBS path is correct", () => {
    expect(API.WORKER.MY_JOBS).toBe("/api/bookings/worker/me");
  });

  it("API WORKER COMPLETE builds path", () => {
    expect(API.WORKER.COMPLETE("b3")).toBe("/api/bookings/b3/complete");
  });

  it("loginSchema accepts valid payload", () => {
    expect(loginSchema.safeParse({ email: "u@example.com", password: "secret1" }).success).toBe(true);
  });

  it("loginSchema rejects invalid email", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "secret1" }).success).toBe(false);
  });

  it("loginSchema rejects short password", () => {
    expect(loginSchema.safeParse({ email: "u@example.com", password: "123" }).success).toBe(false);
  });

  it("registerSchema accepts valid user payload", () => {
    expect(
      registerSchema.safeParse({
        fullName: "Jane Doe",
        email: "jane@example.com",
        phoneNumber: "12345678",
        address: "Kathmandu",
        password: "secret123",
        confirmPassword: "secret123",
        terms: true,
        role: "user",
      }).success
    ).toBe(true);
  });

  it("registerSchema accepts valid worker payload", () => {
    expect(
      registerSchema.safeParse({
        fullName: "Worker One",
        email: "worker@example.com",
        phoneNumber: "1234567890",
        address: "Pokhara",
        password: "secret123",
        confirmPassword: "secret123",
        terms: true,
        role: "worker",
      }).success
    ).toBe(true);
  });

  it("registerSchema rejects short phone number", () => {
    expect(
      registerSchema.safeParse({
        fullName: "Jane Doe",
        email: "jane@example.com",
        phoneNumber: "1234567",
        address: "Kathmandu",
        password: "secret123",
        confirmPassword: "secret123",
        terms: true,
        role: "user",
      }).success
    ).toBe(false);
  });

  it("registerSchema rejects unchecked terms", () => {
    expect(
      registerSchema.safeParse({
        fullName: "Jane Doe",
        email: "jane@example.com",
        phoneNumber: "12345678",
        address: "Kathmandu",
        password: "secret123",
        confirmPassword: "secret123",
        terms: false,
        role: "user",
      }).success
    ).toBe(false);
  });

  it("registerSchema rejects password mismatch", () => {
    expect(
      registerSchema.safeParse({
        fullName: "Jane Doe",
        email: "jane@example.com",
        phoneNumber: "12345678",
        address: "Kathmandu",
        password: "secret123",
        confirmPassword: "other123",
        terms: true,
        role: "user",
      }).success
    ).toBe(false);
  });

  it("login posts to auth login endpoint", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } });
    await login({ email: "u@example.com", password: "secret1" });
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.LOGIN, {
      email: "u@example.com",
      password: "secret1",
    });
  });

  it("login returns response data", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: "t1" } });
    await expect(login({ email: "u@example.com", password: "secret1" })).resolves.toEqual({ token: "t1" });
  });

  it("login throws backend message", async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { message: "Invalid credentials" } } });
    await expect(login({ email: "u@example.com", password: "bad" })).rejects.toThrow("Invalid credentials");
  });

  it("requestPasswordReset posts email payload", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { sent: true } });
    await requestPasswordReset("u@example.com");
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.REQUEST_PASSWORD_RESET, {
      email: "u@example.com",
    });
  });

  it("resetPassword posts token endpoint with password", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } });
    await resetPassword("tok-1", "new-pass");
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.RESET_PASSWORD("tok-1"), {
      newPassword: "new-pass",
    });
  });
});
