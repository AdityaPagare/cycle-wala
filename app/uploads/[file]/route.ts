import fs from "fs";
import path from "path";
import { UPLOAD_DIR } from "@/lib/storage";

/* Serves admin-uploaded product photos. Photos added after `next build` are
   not part of the built /public folder, so they're streamed from DATA_DIR
   here instead. Only the exact filenames the upload route creates are
   accepted — no path segments, nothing else in the folder is reachable. */
const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const match = /^[a-z0-9-]{1,80}-\d{10,15}\.(jpg|png|webp)$/.exec(file);
  if (!match) return new Response("Not found", { status: 404 });

  try {
    const bytes = fs.readFileSync(path.join(UPLOAD_DIR, file));
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": TYPES[match[1]],
        // the filename carries a timestamp, so a given URL never changes
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
