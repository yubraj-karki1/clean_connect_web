import { GET, PUT } from "@/app/api/users/[id]/route";
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

describe("required integration tests", () => {
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

  it("GET returns 401 when token missing", async () => {
    const res = await GET(makeReq(), { params: Promise.resolve({ id: "u1" }) });
    expect(res.status).toBe(401);
  });

  it("GET prefers header token over cookie", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq({ headers: { authorization: "Bearer h1" }, cookies: { auth_token: "c1" } }), { params: Promise.resolve({ id: "u2" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer h1");
  });

  it("GET uses auth_token cookie", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq({ cookies: { auth_token: "c2" } }), { params: Promise.resolve({ id: "u3" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer c2");
  });

  it("GET uses legacy token cookie", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq({ cookies: { token: "legacy" } }), { params: Promise.resolve({ id: "u4" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer legacy");
  });

  it("GET uses getAuthToken fallback", async () => {
    mockedGetAuthToken.mockResolvedValueOnce("s1" as any);
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq(), { params: Promise.resolve({ id: "u5" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer s1");
  });

  it("GET uses default backend url when env missing", async () => {
    delete process.env.BACKEND_URL;
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq({ cookies: { auth_token: "x" } }), { params: Promise.resolve({ id: "u6" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe("http://localhost:5000/api/users/u6");
  });

  it("GET trims bearer token", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq({ headers: { authorization: "Bearer    trim-token   " } }), { params: Promise.resolve({ id: "u7" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer trim-token");
  });

  it("GET preserves backend 404 status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response(JSON.stringify({ message: "Not found" }), { status: 404, headers: { "content-type": "application/json" } }));
    const res = await GET(makeReq({ cookies: { auth_token: "x" } }), { params: Promise.resolve({ id: "u8" }) });
    expect(res.status).toBe(404);
  });

  it("GET returns backend json payload", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response(JSON.stringify({ success: true, data: { id: "u9" } }), { status: 200, headers: { "content-type": "application/json" } }));
    const res = await GET(makeReq({ cookies: { auth_token: "x" } }), { params: Promise.resolve({ id: "u9" }) });
    await expect(res.json()).resolves.toEqual({ success: true, data: { id: "u9" } });
  });

  it("GET handles invalid backend json", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{bad", { status: 502, headers: { "content-type": "application/json" } }));
    const res = await GET(makeReq({ cookies: { auth_token: "x" } }), { params: Promise.resolve({ id: "u10" }) });
    expect(res.status).toBe(502);
  });

  it("GET handles non-json backend response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("<html>oops</html>", { status: 500, headers: { "content-type": "text/html" } }));
    const res = await GET(makeReq({ cookies: { auth_token: "x" } }), { params: Promise.resolve({ id: "u11" }) });
    const body = await res.json();
    expect(body.message).toBe("Backend returned a non-JSON response");
  });

  it("GET truncates non-json detail to 160 chars", async () => {
    const longText = "a".repeat(300);
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response(longText, { status: 500, headers: { "content-type": "text/plain" } }));
    const res = await GET(makeReq({ cookies: { auth_token: "x" } }), { params: Promise.resolve({ id: "u12" }) });
    const body = await res.json();
    expect(body.detail.length).toBe(160);
  });

  it("GET returns 500 when fetch throws", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("down"));
    const res = await GET(makeReq({ cookies: { auth_token: "x" } }), { params: Promise.resolve({ id: "u13" }) });
    expect(res.status).toBe(500);
  });

  it("PUT returns 401 when token missing", async () => {
    const res = await PUT(makeReq(), { params: Promise.resolve({ id: "u14" }) });
    expect(res.status).toBe(401);
  });

  it("PUT prefers header token", async () => {
    const fd = new FormData();
    fd.append("name", "A");
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await PUT(makeReq({ headers: { authorization: "Bearer h2" }, cookies: { auth_token: "c2" }, formData: fd }), { params: Promise.resolve({ id: "u15" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer h2");
  });

  it("PUT uses auth_token cookie", async () => {
    const fd = new FormData();
    fd.append("name", "A");
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await PUT(makeReq({ cookies: { auth_token: "c3" }, formData: fd }), { params: Promise.resolve({ id: "u16" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer c3");
  });

  it("PUT uses legacy cookie token", async () => {
    const fd = new FormData();
    fd.append("name", "A");
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await PUT(makeReq({ cookies: { token: "legacy2" }, formData: fd }), { params: Promise.resolve({ id: "u17" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer legacy2");
  });

  it("PUT uses getAuthToken fallback", async () => {
    mockedGetAuthToken.mockResolvedValueOnce("sv2" as any);
    const fd = new FormData();
    fd.append("name", "A");
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await PUT(makeReq({ formData: fd }), { params: Promise.resolve({ id: "u18" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer sv2");
  });

  it("PUT forwards form fields", async () => {
    const fd = new FormData();
    fd.append("fullName", "Jane Doe");
    fd.append("phone", "123");
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await PUT(makeReq({ cookies: { auth_token: "x" }, formData: fd }), { params: Promise.resolve({ id: "u19" }) });
    const body = (global.fetch as jest.Mock).mock.calls[0][1].body as FormData;
    expect(body.get("fullName")).toBe("Jane Doe");
    expect(body.get("phone")).toBe("123");
  });

  it("PUT converts File to Blob and keeps filename", async () => {
    const fd = new FormData();
    const file = new File(["avatar"], "a.png", { type: "image/png" });
    fd.append("avatar", file);
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await PUT(makeReq({ cookies: { auth_token: "x" }, formData: fd }), { params: Promise.resolve({ id: "u20" }) });
    const body = (global.fetch as jest.Mock).mock.calls[0][1].body as FormData;
    const outFile = body.get("avatar") as File;
    expect(outFile.name).toBe("a.png");
    expect(outFile.type).toBe("image/png");
  });

  it("PUT preserves backend 201 status", async () => {
    const fd = new FormData();
    fd.append("name", "A");
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 201, headers: { "content-type": "application/json" } }));
    const res = await PUT(makeReq({ cookies: { auth_token: "x" }, formData: fd }), { params: Promise.resolve({ id: "u21" }) });
    expect(res.status).toBe(201);
  });

  it("PUT handles invalid backend json", async () => {
    const fd = new FormData();
    fd.append("name", "A");
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{bad", { status: 400, headers: { "content-type": "application/json" } }));
    const res = await PUT(makeReq({ cookies: { auth_token: "x" }, formData: fd }), { params: Promise.resolve({ id: "u22" }) });
    expect(res.status).toBe(400);
  });

  it("PUT handles non-json backend response", async () => {
    const fd = new FormData();
    fd.append("name", "A");
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("oops", { status: 500, headers: { "content-type": "text/plain" } }));
    const res = await PUT(makeReq({ cookies: { auth_token: "x" }, formData: fd }), { params: Promise.resolve({ id: "u23" }) });
    const body = await res.json();
    expect(body.message).toBe("Backend returned a non-JSON response");
  });

  it("PUT returns 500 when fetch throws", async () => {
    const fd = new FormData();
    fd.append("name", "A");
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("timeout"));
    const res = await PUT(makeReq({ cookies: { auth_token: "x" }, formData: fd }), { params: Promise.resolve({ id: "u24" }) });
    expect(res.status).toBe(500);
  });

  it("PUT uses default backend url when env missing", async () => {
    delete process.env.BACKEND_URL;
    const fd = new FormData();
    fd.append("name", "A");
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await PUT(makeReq({ cookies: { auth_token: "x" }, formData: fd }), { params: Promise.resolve({ id: "u25" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe("http://localhost:5000/api/users/u25");
  });
});
