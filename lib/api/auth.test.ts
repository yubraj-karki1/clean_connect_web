import axios from "./axios";
import { API } from "./endpoints";
import { login, register, requestPasswordReset, resetPassword } from "./auth";

jest.mock("./axios", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAxios = axios as unknown as {
  post: jest.Mock;
  get: jest.Mock;
  put: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

const httpError = (message?: string) => ({
  response: { data: { message } },
  message: "network",
});

describe("auth api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("register posts mapped payload with trimmed full name", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } });

    await register({
      fullName: "  Jane Doe  ",
      email: "jane@example.com",
      phoneNumber: "12345678",
      address: "Kathmandu",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "user",
    });

    const [, payload] = mockedAxios.post.mock.calls[0];
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.REGISTER, expect.any(Object));
    expect(payload.fullName).toBe("Jane Doe");
    expect(payload.firstName).toBe("Jane");
    expect(payload.lastName).toBe("Doe");
    expect(payload.username).toBe("Jane Doe");
  });

  it("register keeps last name empty for one-word full name", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } });

    await register({
      fullName: "Prince",
      email: "p@example.com",
      phoneNumber: "12345678",
      address: "Pokhara",
      password: "secret123",
      confirmPassword: "secret123",
      terms: true,
      role: "worker",
    });

    const [, payload] = mockedAxios.post.mock.calls[0];
    expect(payload.firstName).toBe("Prince");
    expect(payload.lastName).toBe("");
  });

  it("register returns response data", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: "abc" } });
    await expect(
      register({
        fullName: "A B",
        email: "a@b.com",
        phoneNumber: "12345678",
        address: "Lalitpur",
        password: "secret123",
        confirmPassword: "secret123",
        terms: true,
        role: "user",
      })
    ).resolves.toEqual({ token: "abc" });
  });

  it("register throws backend message", async () => {
    mockedAxios.post.mockRejectedValueOnce(httpError("Email already used"));
    await expect(
      register({
        fullName: "A B",
        email: "a@b.com",
        phoneNumber: "12345678",
        address: "Lalitpur",
        password: "secret123",
        confirmPassword: "secret123",
        terms: true,
        role: "user",
      })
    ).rejects.toThrow("Email already used");
  });

  it("register uses fallback message", async () => {
    mockedAxios.post.mockRejectedValueOnce({ message: "boom" });
    await expect(
      register({
        fullName: "A B",
        email: "a@b.com",
        phoneNumber: "12345678",
        address: "Lalitpur",
        password: "secret123",
        confirmPassword: "secret123",
        terms: true,
        role: "user",
      })
    ).rejects.toThrow("boom");
  });

  it("login posts credentials to login endpoint", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { user: "x" } });
    await login({ email: "u@x.com", password: "secret123" });
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.LOGIN, {
      email: "u@x.com",
      password: "secret123",
    });
  });

  it("login returns response data", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: "t1" } });
    await expect(login({ email: "u@x.com", password: "secret123" })).resolves.toEqual({
      token: "t1",
    });
  });

  it("login throws backend message", async () => {
    mockedAxios.post.mockRejectedValueOnce(httpError("Invalid credentials"));
    await expect(login({ email: "u@x.com", password: "bad" })).rejects.toThrow(
      "Invalid credentials"
    );
  });

  it("requestPasswordReset posts email payload", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { sent: true } });
    await requestPasswordReset("u@x.com");
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.REQUEST_PASSWORD_RESET, {
      email: "u@x.com",
    });
  });

  it("requestPasswordReset throws fallback message", async () => {
    mockedAxios.post.mockRejectedValueOnce({ message: "reset failed" });
    await expect(requestPasswordReset("u@x.com")).rejects.toThrow("reset failed");
  });

  it("resetPassword posts token endpoint and newPassword", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true } });
    await resetPassword("tok1", "new-pass");
    expect(mockedAxios.post).toHaveBeenCalledWith(API.AUTH.RESET_PASSWORD("tok1"), {
      newPassword: "new-pass",
    });
  });

  it("resetPassword throws backend message", async () => {
    mockedAxios.post.mockRejectedValueOnce(httpError("Token expired"));
    await expect(resetPassword("tok1", "new-pass")).rejects.toThrow("Token expired");
  });
});
