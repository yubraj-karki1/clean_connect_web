import axios from "@/lib/api/axios";
import { login, requestPasswordReset, resetPassword } from "@/lib/api/auth";
import { API } from "@/lib/api/endpoints";

jest.mock("@/lib/api/axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockedAxios = axios as unknown as { post: jest.Mock };

describe("unit: auth api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("login posts credentials to login endpoint", async () => {
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

  it("login throws backend message on failure", async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { message: "Invalid credentials" } } });
    await expect(login({ email: "u@example.com", password: "bad" })).rejects.toThrow("Invalid credentials");
  });

  it("requestPasswordReset posts email payload", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { sent: true } });
    await requestPasswordReset("u@example.com");
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.REQUEST_PASSWORD_RESET, { email: "u@example.com" });
  });

  it("resetPassword posts token-specific payload", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } });
    await resetPassword("tok-1", "new-pass");
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.RESET_PASSWORD("tok-1"), { newPassword: "new-pass" });
  });
});
