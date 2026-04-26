import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await backendFetch(`/api/admin/access-requests/${id}`, {
      method: "PUT",
      body: JSON.stringify(body)
    });
    return NextResponse.json(data);
  } catch (e: any) {
    const msg = e?.message || "Failed";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
