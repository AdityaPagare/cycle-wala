import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { createProduct, getProducts, type Product } from "@/lib/products";

const REQUIRED_FIELDS: (keyof Product)[] = [
  "slug",
  "brand",
  "model",
  "category",
  "sizes",
  "image",
];

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getProducts());
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    for (const field of REQUIRED_FIELDS) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    if (!["kids", "mtb", "hybrid"].includes(body.category)) {
      return NextResponse.json({ error: "category must be kids, mtb or hybrid" }, { status: 400 });
    }

    const product = createProduct({
      slug: String(body.slug),
      brand: String(body.brand),
      model: String(body.model),
      category: body.category,
      sizes: String(body.sizes),
      specs: Array.isArray(body.specs) ? body.specs.map(String) : [],
      price: body.price === null || body.price === undefined || body.price === "" ? null : Number(body.price),
      rating: typeof body.rating === "number" ? body.rating : 4.2,
      image: String(body.image),
      inStock: body.inStock !== false,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
