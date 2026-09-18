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

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

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

function initializeDb() {
  if (!fs.existsSync(DATA_FILE)) {
    const now = new Date().toISOString();
    const seeded: Product[] = SEED_PRODUCTS.map((p) => ({
      ...p,
      createdAt: now,
      updatedAt: now,
    }));
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(seeded, null, 2));
  }
}

export function getProducts(): Product[] {
  initializeDb();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
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
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
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
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
  return updated;
}

export function deleteProduct(slug: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.slug !== slug);
  if (filtered.length === products.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
