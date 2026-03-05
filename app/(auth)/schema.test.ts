import { loginSchema, registerSchema } from "./schema";

describe("auth schemas", () => {
  it("loginSchema accepts valid payload", () => {
    const parsed = loginSchema.parse({ email: "user@example.com", password: "secret1" });
    expect(parsed.email).toBe("user@example.com");
  });

  it("loginSchema rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "bad", password: "secret1" });
    expect(result.success).toBe(false);
  });

  it("loginSchema rejects short password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "123" });
    expect(result.success).toBe(false);
  });

  it("registerSchema accepts valid user payload", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "12345678",
      address: "Kathmandu",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "user",
    });
    expect(result.success).toBe(true);
  });

  it("registerSchema accepts valid worker payload", () => {
    const result = registerSchema.safeParse({
      fullName: "Worker One",
      email: "worker@example.com",
      phoneNumber: "1234567890",
      address: "Pokhara",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "worker",
    });
    expect(result.success).toBe(true);
  });

  it("registerSchema rejects short fullName", () => {
    const result = registerSchema.safeParse({
      fullName: "A",
      email: "a@example.com",
      phoneNumber: "12345678",
      address: "Address",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "user",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema rejects invalid email", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "bad",
      phoneNumber: "12345678",
      address: "Address",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "user",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema rejects short phoneNumber", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "1234567",
      address: "Address",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "user",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema rejects long phoneNumber", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "12345678901",
      address: "Address",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "user",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema rejects short address", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "12345678",
      address: "A",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "user",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema rejects short password", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "12345678",
      address: "Address",
      password: "12345",
      confirmPassword: "12345",
      terms: true,
      role: "user",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema rejects empty confirmPassword", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "12345678",
      address: "Address",
      password: "secret123",
      confirmPassword: "",
      terms: true,
      role: "user",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema rejects unchecked terms", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "12345678",
      address: "Address",
      password: "secret123",
      confirmPassword: "secret123",
      terms: false,
      role: "user",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema rejects invalid role", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "12345678",
      address: "Address",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("registerSchema rejects password mismatch", () => {
    const result = registerSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phoneNumber: "12345678",
      address: "Address",
      password: "secret123",
      confirmPassword: "secret999",
      terms: true,
      role: "user",
    });
    expect(result.success).toBe(false);
  });
});
