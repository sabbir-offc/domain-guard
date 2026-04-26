"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backendLogin, COOKIE_NAME } from "@/lib/api";
import { USER_COOKIE } from "@/lib/auth";
import type { LoginState } from "@/lib/types";

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Enter username and password" };
  }

  const result = await backendLogin(username, password);
  if (!result) {
    return { error: "Invalid credentials" };
  }

  const c = await cookies();
  const maxAge = 7 * 24 * 60 * 60;

  c.set(COOKIE_NAME, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  });
  c.set(USER_COOKIE, result.username, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  });

  redirect("/");
}
