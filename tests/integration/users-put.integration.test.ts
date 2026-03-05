import { PUT } from "@/app/api/users/[id]/route";
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
    cookies: { get: (name: string) => (cookies[name] ? { value: cookies[name] } : undefined) },
    formData: async () => opts?.formData || new FormData(),
  } as any;
};

describe("integration: users PUT behavior", () => {
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

  it("returns 401 when token missing", async () => {
    const res = await PUT(makeReq(), { params: Promise.resolve({ id: "u1" }) });
    expect(res.status).toBe(401);
  });

  it("forwards multipart form data and auth header", async () => {
    const fd = new FormData();
    fd.append("fullName", "Jane Doe");
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );
    const res = await PUT(makeReq({ headers: { authorization: "Bearer t1" }, formData: fd }), {
      params: Promise.resolve({ id: "u2" }),
    });
    expect(res.status).toBe(200);
    expect((global.fetch as jest.Mock).mock.calls[0][1].headers.Authorization).toBe("Bearer t1");
  });

  it("keeps uploaded file name/type when rebuilding form data", async () => {
    const fd = new FormData();
    fd.append("avatar", new File(["x"], "a.png", { type: "image/png" }));
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("{}", {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );
    await PUT(makeReq({ cookies: { auth_token: "t2" }, formData: fd }), { params: Promise.resolve({ id: "u3" }) });
    const body = (global.fetch as jest.Mock).mock.calls[0][1].body as FormData;
    const file = body.get("avatar") as File;
    expect(file.name).toBe("a.png");
    expect(file.type).toBe("image/png");
  });

  it("maps malformed backend json to invalid-json message", async () => {
    const fd = new FormData();
    fd.append("fullName", "Jane Doe");
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("{bad", {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    );
    const res = await PUT(makeReq({ cookies: { auth_token: "t3" }, formData: fd }), { params: Promise.resolve({ id: "u4" }) });
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ success: false, message: "Invalid JSON received from backend" });
  });

  it("returns 500 when backend fetch throws", async () => {
    const fd = new FormData();
    fd.append("fullName", "Jane Doe");
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("timeout"));
    const res = await PUT(makeReq({ cookies: { auth_token: "t4" }, formData: fd }), { params: Promise.resolve({ id: "u5" }) });
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ success: false, message: "Failed to update user profile" });
  });
});
