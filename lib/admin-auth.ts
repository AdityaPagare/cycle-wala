/* Admin auth — email + password, checked against server-only env vars
 * (ADMIN_EMAIL / ADMIN_PASSWORD). Fails CLOSED: if either isn't set on the
 * server, every request is rejected rather than silently authorized.
 *
 * The credential travels as `Bearer base64(email:password)` — the same
 * header the rest of the admin API already expected, so only what's
 * *inside* the bearer value changed, not the request shape. It is never
 * echoed back by any API response.
 */
import type { NextRequest } from "next/server";

function decodeCredential(token: string): { email: string; password: string } | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const sep = decoded.indexOf(":");
    if (sep === -1) return null;
    return { email: decoded.slice(0, sep), password: decoded.slice(sep + 1) };
  } catch {
    return null;
  }
}

export function isAuthorized(request: NextRequest): boolean {
  const configuredEmail = process.env.ADMIN_EMAIL;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword) return false;

  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return false;

  const creds = decodeCredential(token);
  if (!creds) return false;

  return creds.email === configuredEmail && creds.password === configuredPassword;
}
