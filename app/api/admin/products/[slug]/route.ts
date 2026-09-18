import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { deleteProduct, getProductBySlug, updateProduct } from "@/lib/products";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  try {
    const body = await request.json();
    const updates: Record<string, unknown> = {};
    for (const key of ["brand", "model", "category", "sizes", "specs", "image", "inStock"] as const) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    if (body.price !== undefined) {
      updates.price = body.price === null || body.price === "" ? null : Number(body.price);
    }
    const product = updateProduct(slug, updates);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const deleted = deleteProduct(slug);
  if (!deleted) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ message: "Product deleted" });
}
