import { SESSION_COOKIE_NAME, type CookieResponse } from "./auth.types.js";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function getSessionCookieOptions() {
  const domain = process.env.COOKIE_DOMAIN || undefined;

  return {
    domain,
    httpOnly: true,
    maxAge: THIRTY_DAYS_MS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };
}

export function setSessionCookie(response: CookieResponse, token: string) {
  response.cookie(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
}

export function clearSessionCookie(response: CookieResponse) {
  const { maxAge: _maxAge, httpOnly: _httpOnly, ...options } = getSessionCookieOptions();

  response.clearCookie(SESSION_COOKIE_NAME, options);
}
