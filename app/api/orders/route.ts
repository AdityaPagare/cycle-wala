import { NextRequest, NextResponse } from "next/server";
import { createOrder, type OrderItem } from "@/lib/orders";

/* Public endpoint — anyone checking out submits here, no auth (this is
   the same trust level as walking into the shop and giving your name).
   Basic shape/length validation only; no payment is processed. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items } = body ?? {};

    if (!customer?.name?.trim() || !customer?.phone?.trim() || !customer?.address?.trim()) {
      return NextResponse.json({ error: "Name, phone and address are required" }, { status: 400 });
    }
    if (customer.name.length > 100 || customer.phone.length > 30 || customer.address.length > 400) {
      return NextResponse.json({ error: "One of the fields is too long" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your list is empty" }, { status: 400 });
    }

    const cleanItems: OrderItem[] = items.map((i) => ({
      slug: String(i.slug ?? ""),
      brand: String(i.brand ?? ""),
      model: String(i.model ?? ""),
      price: i.price === null || i.price === undefined ? null : Number(i.price),
      qty: Math.max(1, Math.min(20, Number(i.qty) || 1)),
    }));

    const order = createOrder({
      customer: {
        name: String(customer.name).trim(),
        phone: String(customer.phone).trim(),
        address: String(customer.address).trim(),
        note: customer.note ? String(customer.note).trim().slice(0, 400) : undefined,
      },
      items: cleanItems,
    });

    return NextResponse.json({ id: order.id, total: order.total }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Couldn't place the order — try again" }, { status: 400 });
  }
}
