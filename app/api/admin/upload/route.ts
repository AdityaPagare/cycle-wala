import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/* Admin photo upload — saves into public/images/shop/uploads/ and returns
   the path to store on the product. Filename is derived from the slug the
   admin is editing, never from the uploaded file's own name. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const slug = form.get("slug");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Missing or invalid slug" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG or WEBP images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "images", "shop", "uploads");
  fs.mkdirSync(dir, { recursive: true });

  const filename = `${slug}-${Date.now()}.${EXT[file.type]}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), bytes);

  return NextResponse.json({ path: `/images/shop/uploads/${filename}` });
}
