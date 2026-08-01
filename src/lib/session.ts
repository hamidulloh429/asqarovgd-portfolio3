import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "asqarovgd_session";
// Falls back to a fixed secret if JWT_SECRET isn't set in the environment,
// so admin login still works out of the box. For stronger security, set
// JWT_SECRET as an environment variable (Vercel → Settings → Environment
// Variables) — any value you set there overrides this fallback.
const SECRET =
  process.env.JWT_SECRET || "asqarovgd-portfolio-fallback-secret-8f2a1c";

export type SessionPayload = {
  adminId: string;
  email: string;
};

function requireSecret() {
  if (!SECRET) {
    throw new Error(
      "JWT_SECRET is not set. Add it to your .env file (see .env.example)."
    );
  }
  return SECRET;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, requireSecret(), { expiresIn: "7d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, requireSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

// For use in Server Components / Route Handlers (reads the cookie jar).
export function getSessionFromCookies(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

// Throws-free guard for use at the top of mutating API route handlers.
// Returns the session if valid, or null if the request is unauthenticated —
// callers should respond with 401 when this returns null.
export function requireSession(): SessionPayload | null {
  return getSessionFromCookies();
}
