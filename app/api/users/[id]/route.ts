export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  // Forward multipart/form-data (image upload) to backend
  const formData = await req.formData();
  const backendUrl = `http://localhost:5000/api/users/${id}`;

  try {
    // Convert FormData to fetch-compatible body
    const fetchBody = new FormData();
    for (const [key, value] of formData.entries()) {
      fetchBody.append(key, value);
    }
    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Content-Type is set automatically for FormData
      },
      body: fetchBody,
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update user profile" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/cookie";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = `http://localhost:5000/api/users/${id}`;

  try {
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch user data" }, { status: 500 });
  }
}
