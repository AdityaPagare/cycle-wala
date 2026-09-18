"use client";

/* Client-side helpers for the admin panel. After a successful email +
   password check, the login page stores the base64(email:password)
   credential here — in localStorage only, never sent anywhere except the
   Authorization header on admin API calls. Every admin fetch goes through
   `adminFetch` so a 401 always bounces back to the login screen instead of
   showing a silently-broken dashboard. */

const KEY = "cw_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(KEY);
}

export async function adminFetch(input: string, init: RequestInit = {}) {
  const token = getAdminToken();
  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token ?? ""}`,
    },
  });
  if (res.status === 401) {
    clearAdminToken();
    window.location.href = "/admin/login";
    throw new Error("Session expired");
  }
  return res;
}
