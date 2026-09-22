/* Order type + JSON-file persistence — same pattern as lib/products.ts.
 *
 * There's no payment gateway wired up (that needs a real merchant account
 * with Razorpay/Stripe/etc., which nobody has set up), so every order is
 * Pay at Store / Cash on Delivery: the customer submits their details and
 * what they want, the shop calls to confirm, payment happens in person.
 * Nothing here pretends to process a card or charge anyone.
 */
import path from "path";
import { DATA_DIR, newId, readJson, writeJsonAtomic } from "@/lib/storage";

const DATA_FILE = path.join(DATA_DIR, "orders.json");

export type OrderItem = {
  slug: string;
  brand: string;
  model: string;
  price: number | null;
  qty: number;
};

export type OrderStatus = "new" | "contacted" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    note?: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

const readAll = () => readJson<Order[]>(DATA_FILE, []);
const writeAll = (orders: Order[]) => writeJsonAtomic(DATA_FILE, orders);

export function getOrders(): Order[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrderById(id: string): Order | undefined {
  return readAll().find((o) => o.id === id);
}

export function createOrder(input: {
  customer: Order["customer"];
  items: OrderItem[];
}): Order {
  const orders = readAll();
  const now = new Date().toISOString();
  const total = input.items.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0);
  const order: Order = {
    id: newId("CW"),
    customer: input.customer,
    items: input.items,
    total,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };
  orders.push(order);
  writeAll(orders);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const orders = readAll();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
  writeAll(orders);
  return orders[index];
}
