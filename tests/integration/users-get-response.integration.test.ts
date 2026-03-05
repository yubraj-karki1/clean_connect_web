import { GET } from "@/app/api/users/[id]/route";

const makeReq = (opts?: { cookies?: Record<string, string> }) => {
  const headers = new Headers();
  const cookies = opts?.cookies || {};
  return {
    headers,
    cookies: { get: (name: string) => (cookies[name] ? { value: cookies[name] } : undefined) },
  } as any;
};

describe("integration: users GET response handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.BACKEND_URL = "http://backend.test";
    (global as any).fetch = jest.fn();
  });

  it("returns backend JSON payload and status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, data: { id: "u1" } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );
    const res = await GET(makeReq({ cookies: { auth_token: "t1" } }), { params: Promise.resolve({ id: "u1" }) });
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true, data: { id: "u1" } });
  });

  it("maps malformed backend JSON to invalid-json message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("{bad", {
        status: 502,
        headers: { "content-type": "application/json" },
      })
    );
    const res = await GET(makeReq({ cookies: { auth_token: "t1" } }), { params: Promise.resolve({ id: "u2" }) });
    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toEqual({ success: false, message: "Invalid JSON received from backend" });
  });

  it("maps non-JSON backend response with detail", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("<html>oops</html>", {
        status: 500,
        headers: { "content-type": "text/html" },
      })
    );
    const res = await GET(makeReq({ cookies: { auth_token: "t1" } }), { params: Promise.resolve({ id: "u3" }) });
    const body = await res.json();
    expect(res.status).toBe(500);
    expect(body.message).toBe("Backend returned a non-JSON response");
  });

  it("returns 500 with fetch-failure message when backend fetch throws", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("network down"));
    const res = await GET(makeReq({ cookies: { auth_token: "t1" } }), { params: Promise.resolve({ id: "u4" }) });
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ success: false, message: "Failed to fetch user data" });
  });

  it("uses default localhost backend when BACKEND_URL is missing", async () => {
    delete process.env.BACKEND_URL;
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("{}", {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );
    await GET(makeReq({ cookies: { auth_token: "t1" } }), { params: Promise.resolve({ id: "u5" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe("http://localhost:5000/api/users/u5");
  });
});
