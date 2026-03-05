import { GET, PUT } from "./route";
import { getAuthToken } from "@/lib/cookie";

jest.mock("@/lib/cookie", () => ({
  getAuthToken: jest.fn(),
}));

const mockedGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;

const makeReq = (opts?: {
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  formData?: FormData;
}) => {
  const headers = new Headers(opts?.headers || {});
  const cookies = opts?.cookies || {};

  return {
    headers,
    cookies: {
      get: (name: string) => (cookies[name] ? { value: cookies[name] } : undefined),
    },
    formData: async () => opts?.formData || new FormData(),
  } as any;
};

describe("users [id] route integration", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    jest.clearAllMocks();
    mockedGetAuthToken.mockReset();
    mockedGetAuthToken.mockResolvedValue(null as any);
    process.env.BACKEND_URL = "http://backend.test";
    (global as any).fetch = jest.fn();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("GET returns 401 when token is missing", async () => {
    mockedGetAuthToken.mockResolvedValueOnce(null as any);

    const res = await GET(makeReq(), { params: Promise.resolve({ id: "u1" }) });
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(body).toEqual({ success: false, message: "Unauthorized" });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("GET uses authorization header token", async () => {
    mockedGetAuthToken.mockResolvedValueOnce("fallback-token" as any);
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, data: { id: "u1" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const res = await GET(makeReq({ headers: { authorization: "Bearer header-token" } }), {
      params: Promise.resolve({ id: "u1" }),
    });

    expect(global.fetch).toHaveBeenCalledWith("http://backend.test/api/users/u1", {
      method: "GET",
      headers: {
        Authorization: "Bearer header-token",
        "Content-Type": "application/json",
      },
    });

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true, data: { id: "u1" } });
  });

  it("GET uses auth_token cookie when header missing", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    await GET(makeReq({ cookies: { auth_token: "cookie-token" } }), {
      params: Promise.resolve({ id: "u2" }),
    });

    expect(global.fetch).toHaveBeenCalledWith("http://backend.test/api/users/u2", {
      method: "GET",
      headers: {
        Authorization: "Bearer cookie-token",
        "Content-Type": "application/json",
      },
    });
  });

  it("GET uses legacy token cookie when auth_token missing", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    await GET(makeReq({ cookies: { token: "legacy-cookie-token" } }), {
      params: Promise.resolve({ id: "u3" }),
    });

    expect(global.fetch).toHaveBeenCalledWith("http://backend.test/api/users/u3", {
      method: "GET",
      headers: {
        Authorization: "Bearer legacy-cookie-token",
        "Content-Type": "application/json",
      },
    });
  });

  it("GET falls back to getAuthToken when header and cookies are missing", async () => {
    mockedGetAuthToken.mockResolvedValueOnce("server-token" as any);
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    await GET(makeReq(), { params: Promise.resolve({ id: "u4" }) });

    expect(global.fetch).toHaveBeenCalledWith("http://backend.test/api/users/u4", {
      method: "GET",
      headers: {
        Authorization: "Bearer server-token",
        "Content-Type": "application/json",
      },
    });
  });

  it("GET returns invalid-json message when backend json is malformed", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("{bad", {
        status: 502,
        headers: { "content-type": "application/json" },
      })
    );

    const res = await GET(makeReq({ cookies: { auth_token: "t1" } }), {
      params: Promise.resolve({ id: "u5" }),
    });

    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toEqual({
      success: false,
      message: "Invalid JSON received from backend",
    });
  });

  it("GET handles non-json backend response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("<html>oops</html>", {
        status: 500,
        headers: { "content-type": "text/html" },
      })
    );

    const res = await GET(makeReq({ cookies: { auth_token: "t1" } }), {
      params: Promise.resolve({ id: "u6" }),
    });
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Backend returned a non-JSON response");
    expect(body.detail).toContain("<html>");
  });

  it("GET returns 500 when fetch throws", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("network down"));

    const res = await GET(makeReq({ cookies: { auth_token: "t1" } }), {
      params: Promise.resolve({ id: "u7" }),
    });

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      success: false,
      message: "Failed to fetch user data",
    });
  });

  it("PUT returns 401 when token is missing", async () => {
    mockedGetAuthToken.mockResolvedValueOnce(null as any);

    const res = await PUT(makeReq(), { params: Promise.resolve({ id: "u1" }) });

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ success: false, message: "Unauthorized" });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("PUT forwards multipart form data and auth header", async () => {
    const formData = new FormData();
    formData.append("fullName", "Jane Doe");
    formData.append("phone", "12345");

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const res = await PUT(
      makeReq({ headers: { authorization: "Bearer put-token" }, formData }),
      { params: Promise.resolve({ id: "u8" }) }
    );

    const call = (global.fetch as jest.Mock).mock.calls[0];
    expect(call[0]).toBe("http://backend.test/api/users/u8");
    expect(call[1].method).toBe("PUT");
    expect(call[1].headers).toEqual({ Authorization: "Bearer put-token" });
    expect(call[1].body).toBeInstanceOf(FormData);
    expect(res.status).toBe(200);
  });

  it("PUT returns invalid-json message when backend json is malformed", async () => {
    const formData = new FormData();
    formData.append("fullName", "Jane Doe");

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("{bad", {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    );

    const res = await PUT(makeReq({ cookies: { auth_token: "t1" }, formData }), {
      params: Promise.resolve({ id: "u9" }),
    });

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      success: false,
      message: "Invalid JSON received from backend",
    });
  });

  it("PUT returns 500 when fetch throws", async () => {
    const formData = new FormData();
    formData.append("fullName", "Jane Doe");
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("timeout"));

    const res = await PUT(makeReq({ cookies: { auth_token: "t1" }, formData }), {
      params: Promise.resolve({ id: "u10" }),
    });

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      success: false,
      message: "Failed to update user profile",
    });
  });
});

