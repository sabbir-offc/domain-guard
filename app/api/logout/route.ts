import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, USER_COOKIE } from "@/lib/auth";

export async function POST() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
  c.delete(USER_COOKIE);
  return NextResponse.json({ ok: true });
}
