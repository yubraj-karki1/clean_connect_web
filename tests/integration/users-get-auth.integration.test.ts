import { GET } from "@/app/api/users/[id]/route";
import { getAuthToken } from "@/lib/cookie";

jest.mock("@/lib/cookie", () => ({
  getAuthToken: jest.fn(),
}));

const mockedGetAuthToken = getAuthToken as jest.MockedFunction<typeof getAuthToken>;

const makeReq = (opts?: { headers?: Record<string, string>; cookies?: Record<string, string> }) => {
  const headers = new Headers(opts?.headers || {});
  const cookies = opts?.cookies || {};
  return {
    headers,
    cookies: { get: (name: string) => (cookies[name] ? { value: cookies[name] } : undefined) },
  } as any;
};

describe("integration: users GET auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetAuthToken.mockReset();
    mockedGetAuthToken.mockResolvedValue(null as any);
    process.env.BACKEND_URL = "http://backend.test";
    (global as any).fetch = jest.fn();
  });

  it("returns 401 when no token found", async () => {
    const res = await GET(makeReq(), { params: Promise.resolve({ id: "u1" }) });
    expect(res.status).toBe(401);
  });

  it("prefers header token over cookie", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq({ headers: { authorization: "Bearer h1" }, cookies: { auth_token: "c1" } }), { params: Promise.resolve({ id: "u2" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer h1");
  });

  it("uses auth_token cookie when no header", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq({ cookies: { auth_token: "cookie-token" } }), { params: Promise.resolve({ id: "u3" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer cookie-token");
  });

  it("uses legacy token cookie fallback", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq({ cookies: { token: "legacy-token" } }), { params: Promise.resolve({ id: "u4" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer legacy-token");
  });

  it("uses getAuthToken fallback when header/cookies absent", async () => {
    mockedGetAuthToken.mockResolvedValueOnce("server-token" as any);
    (global.fetch as jest.Mock).mockResolvedValueOnce(new Response("{}", { status: 200, headers: { "content-type": "application/json" } }));
    await GET(makeReq(), { params: Promise.resolve({ id: "u5" }) });
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer server-token");
  });
});
