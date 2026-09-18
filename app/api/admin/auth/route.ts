import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";

/* Dedicated login check — the admin login form POSTs the token here
   instead of piggy-backing on a data endpoint. Never echoes the token
   back. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
