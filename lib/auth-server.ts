import { cookies } from "next/headers";
import { verifyToken, type AuthUser } from "./auth";

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return {
    id: payload.id,
    username: payload.username,
    email: payload.email,
  };
}