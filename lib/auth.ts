import { cookies } from "next/headers";

const COOKIE_NAME = process.env.COOKIE_NAME || "dg_token";
const USER_COOKIE = "dg_user";

export async function getAuthToken(): Promise<string | null> {
  return (await cookies()).get(COOKIE_NAME)?.value || null;
}

export async function getCurrentUser(): Promise<string | null> {
  return (await cookies()).get(USER_COOKIE)?.value || null;
}

export { COOKIE_NAME, USER_COOKIE };
