import { loginSchema, registerSchema } from "@/app/(auth)/schema";

describe("unit: auth schema", () => {
  it("login schema accepts valid payload", () => {
    expect(loginSchema.safeParse({ email: "user@example.com", password: "secret1" }).success).toBe(true);
  });

  it("login schema rejects invalid email", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "secret1" }).success).toBe(false);
  });

  it("register schema accepts valid user payload", () => {
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

  it("register schema rejects unchecked terms", () => {
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

  it("register schema rejects password mismatch", () => {
    expect(
      registerSchema.safeParse({
        fullName: "Jane Doe",
        email: "jane@example.com",
        phoneNumber: "12345678",
        address: "Kathmandu",
        password: "secret123",
        confirmPassword: "different123",
        terms: true,
        role: "user",
      }).success
    ).toBe(false);
  });
});
