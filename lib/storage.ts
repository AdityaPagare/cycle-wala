/* Shared file storage for the JSON "database" (products, orders, bookings)
 * and admin photo uploads.
 *
 * Everything lives under DATA_DIR. By default that is ./data inside the
 * project; in production set DATA_DIR to a folder on a persistent disk
 * *outside* the deployed code (e.g. /var/lib/cyclewala) so a redeploy never
 * wipes orders or overwrites catalogue edits.
 */
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";

export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

export function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

/** Write to a temp file, then rename over the target — a crash or power cut
 *  mid-write can never leave a half-written (corrupt) JSON file behind. */
export function writeJsonAtomic(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

/** Readable, collision-safe id: CW-MU56EPDY-3F9A */
export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`;
}
