import jwt from "jsonwebtoken";
import type { NextResponse } from "next/server";

export const JWT_SECRET = process.env.JWT_SECRET || "gistme_secret";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface JwtPayload extends AuthUser {
  iat?: number;
  exp?: number;
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}

export function getTokenFromCookieHeader(cookieHeader: string): string | null {
  const match = cookieHeader.match(/token=([^;]+)/);
  return match ? match[1] : null;
}