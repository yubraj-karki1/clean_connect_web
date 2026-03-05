import { API } from "@/lib/api/endpoints";

describe("unit: endpoints", () => {
  it("auth login endpoint is correct", () => {
    expect(API.AUTH.LOGIN).toBe("/api/auth/login");
  });

  it("auth register endpoint is correct", () => {
    expect(API.AUTH.REGISTER).toBe("/api/auth/register");
  });

  it("auth reset endpoint builder works", () => {
    expect(API.AUTH.RESET_PASSWORD("abc")).toBe("/api/auth/reset-password/abc");
  });

  it("worker available jobs endpoint is correct", () => {
    expect(API.WORKER.AVAILABLE_JOBS).toBe("/api/bookings/available");
  });

  it("admin booking complete endpoint builder works", () => {
    expect(API.ADMIN.BOOKINGS.COMPLETE("10")).toBe("/api/bookings/10/complete");
  });
});
