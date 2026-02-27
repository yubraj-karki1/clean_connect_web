import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/cookie";

async function parseBackendResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const raw = await response.text();

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(raw);
    } catch {
      return { success: false, message: "Invalid JSON received from backend" };
    }
  }

  return {
    success: false,
    message: "Backend returned a non-JSON response",
    detail: raw.slice(0, 160),
  };
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const tokenFromHeader = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const tokenFromCookie = req.cookies.get("auth_token")?.value || req.cookies.get("token")?.value || null;
  const token = tokenFromHeader || tokenFromCookie || await getAuthToken();
  const backendBaseUrl = process.env.BACKEND_URL || "http://localhost:5000";

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = `${backendBaseUrl}/api/users/${id}`;

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await parseBackendResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch user data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const tokenFromHeader = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const tokenFromCookie = req.cookies.get("auth_token")?.value || req.cookies.get("token")?.value || null;
  const token = tokenFromHeader || tokenFromCookie || await getAuthToken();
  const backendBaseUrl = process.env.BACKEND_URL || "http://localhost:5000";

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // Forward multipart/form-data (image upload) to backend
  const formData = await req.formData();
  const backendUrl = `${backendBaseUrl}/api/users/${id}`;

  try {
    // Rebuild FormData with proper Blob conversion for Node.js compatibility
    const fetchBody = new FormData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const buffer = await value.arrayBuffer();
        fetchBody.append(key, new Blob([buffer], { type: value.type }), value.name);
      } else {
        fetchBody.append(key, value);
      }
    }
    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: fetchBody,
    });
    const data = await parseBackendResponse(response);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Profile update proxy error:", error);
    return NextResponse.json({ success: false, message: "Failed to update user profile" }, { status: 500 });
  }
}
