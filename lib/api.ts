import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const COOKIE_NAME = process.env.COOKIE_NAME || "dg_token";

/**
 * Server-side fetch helper. Forwards JWT from httpOnly cookie.
 * Use in server components, server actions, and route handlers.
 */
export async function backendFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(BACKEND_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers
    },
    cache: "no-store"
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.error || msg;
    } catch (_) {}
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Login does not need a cookie yet. Used by login server action and route.
 */
export async function backendLogin(username: string, password: string) {
  const res = await fetch(BACKEND_URL + "/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store"
  });

  if (!res.ok) {
    return null;
  }
  return res.json() as Promise<{ token: string; username: string }>;
}

export { COOKIE_NAME, BACKEND_URL };
