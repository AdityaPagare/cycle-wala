/* Product type + JSON-file persistence for the admin-managed catalogue.
 *
 * `data/products.json` is the live source of truth for the public Shop page
 * AND the admin dashboard — editing a product in /admin shows up on the
 * site immediately. It's seeded once (on first read) from the real,
 * verified starting catalogue in `data/products-seed.ts` (transcribed from
 * the shop's own supplier PDFs).
 *
 * This is a plain JSON file via `fs`, not a database — fine for a single
 * small shop on a persistent Node host (e.g. a VPS, Railway, Render). It
 * will NOT persist across deploys on a platform with an ephemeral/read-only
 * filesystem (e.g. Vercel's default serverless functions) — ask if the
 * site ends up hosted somewhere like that and this needs to move to a real
 * database instead.
 */
import fs from "fs";
import path from "path";
import { SEED_PRODUCTS } from "@/data/products-seed";
import { DATA_DIR, readJson, writeJsonAtomic } from "@/lib/storage";

const DATA_FILE = path.join(DATA_DIR, "products.json");

export type ProductCategory = "kids" | "mtb" | "hybrid";

export type Product = {
  slug: string;
  brand: string;
  model: string;
  category: ProductCategory;
  sizes: string;
  specs: string[];
  price: number | null;
  /** illustrative only — no real review data exists yet */
  rating: number;
  image: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
};

/* the catalogue that ships with the code — used to carry the current prices
   over the first time the site runs with DATA_DIR pointing elsewhere */
const SHIPPED_FILE = path.join(process.cwd(), "data", "products.json");

function initializeDb() {
  if (!fs.existsSync(DATA_FILE)) {
    if (DATA_FILE !== SHIPPED_FILE && fs.existsSync(SHIPPED_FILE)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.copyFileSync(SHIPPED_FILE, DATA_FILE);
      return;
    }
    const now = new Date().toISOString();
    const seeded: Product[] = SEED_PRODUCTS.map((p) => ({
      ...p,
      createdAt: now,
      updatedAt: now,
    }));
    writeJsonAtomic(DATA_FILE, seeded);
  }
}

export function getProducts(): Product[] {
  initializeDb();
  return readJson<Product[]>(DATA_FILE, []);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function createProduct(
  input: Omit<Product, "createdAt" | "updatedAt">
): Product {
  const products = getProducts();
  if (products.some((p) => p.slug === input.slug)) {
    throw new Error(`A product with slug "${input.slug}" already exists`);
  }
  const now = new Date().toISOString();
  const product: Product = { ...input, createdAt: now, updatedAt: now };
  products.push(product);
  writeJsonAtomic(DATA_FILE, products);
  return product;
}

export function updateProduct(
  slug: string,
  updates: Partial<Omit<Product, "slug" | "createdAt">>
): Product | null {
  const products = getProducts();
  const index = products.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  const updated: Product = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  products[index] = updated;
  writeJsonAtomic(DATA_FILE, products);
  return updated;
}

export function deleteProduct(slug: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.slug !== slug);
  if (filtered.length === products.length) return false;
  writeJsonAtomic(DATA_FILE, filtered);
  return true;
}

/* ---------- input validation for the admin API ---------- */

const CATEGORIES: ProductCategory[] = ["kids", "mtb", "hybrid"];
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max + 1) : "");

export type ProductFields = Partial<Omit<Product, "createdAt" | "updatedAt">>;

/** Validates admin-submitted product fields. `partial` (edits) allows any
 *  subset; otherwise every required field must be present. Returns a clean
 *  object or a message the admin can read. */
export function parseProductFields(
  body: Record<string, unknown>,
  partial: boolean
): { value: ProductFields } | { error: string } {
  const out: ProductFields = {};
  const has = (k: string) => body[k] !== undefined;
  const need = (k: string) => !partial && !has(k);

  if (has("slug") || need("slug")) {
    const slug = text(body.slug, 80);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 80) return { error: "Invalid slug" };
    out.slug = slug;
  }
  for (const [key, max, label] of [["brand", 80, "Brand"], ["model", 80, "Model"], ["sizes", 80, "Sizes"]] as const) {
    if (has(key) || need(key)) {
      const v = text(body[key], max);
      if (!v || v.length > max) return { error: `${label} is required (max ${max} characters)` };
      out[key] = v;
    }
  }
  if (has("category") || need("category")) {
    if (!CATEGORIES.includes(body.category as ProductCategory)) {
      return { error: "category must be kids, mtb or hybrid" };
    }
    out.category = body.category as ProductCategory;
  }
  if (has("specs")) {
    if (!Array.isArray(body.specs) || body.specs.length > 20) return { error: "specs must be a list of up to 20 lines" };
    out.specs = body.specs.map((x) => text(x, 200)).filter(Boolean);
  }
  if (has("price")) {
    if (body.price === null || body.price === "") out.price = null;
    else {
      const n = Number(body.price);
      if (!Number.isFinite(n) || n < 0 || n > 1_000_000) return { error: "Price must be a number between 0 and 10,00,000" };
      out.price = Math.round(n * 100) / 100;
    }
  }
  if (has("image") || need("image")) {
    const img = text(body.image, 200);
    if (!/^\/[A-Za-z0-9._\-/]+$/.test(img) || img.includes("..") || img.length > 200) return { error: "Invalid image path" };
    out.image = img;
  }
  if (has("inStock")) out.inStock = body.inStock !== false;
  if (has("rating")) {
    const r = Number(body.rating);
    if (Number.isFinite(r) && r >= 0 && r <= 5) out.rating = r;
  }
  return { value: out };
}
