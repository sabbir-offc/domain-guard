import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/api";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await backendFetch("/api/admin/allowlist", {
      method: "PUT",
      body: JSON.stringify(body)
    });
    return NextResponse.json(data);
  } catch (e: any) {
    const msg = e?.message || "Save failed";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
