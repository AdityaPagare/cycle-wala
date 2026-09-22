/* Service bookings — same JSON-file pattern as lib/orders.ts. A booking is a
 * request: the shop calls to confirm a time. No payment is taken online. */
import path from "path";
import type { OrderStatus } from "@/lib/orders";
import { DATA_DIR, newId, readJson, writeJsonAtomic } from "@/lib/storage";

const DATA_FILE = path.join(DATA_DIR, "bookings.json");

export type Booking = {
  id: string;
  service: { id: string; title: string; price: number };
  customer: {
    name: string;
    phone: string;
    address?: string;
    cycle?: string;
    date?: string;
    note?: string;
  };
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

const readAll = () => readJson<Booking[]>(DATA_FILE, []);
const writeAll = (bookings: Booking[]) => writeJsonAtomic(DATA_FILE, bookings);

export function getBookings(): Booking[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createBooking(input: Pick<Booking, "service" | "customer">): Booking {
  const bookings = readAll();
  const now = new Date().toISOString();
  const booking: Booking = {
    id: newId("SV"),
    service: input.service,
    customer: input.customer,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };
  bookings.push(booking);
  writeAll(bookings);
  return booking;
}

export function updateBookingStatus(id: string, status: OrderStatus): Booking | null {
  const bookings = readAll();
  const i = bookings.findIndex((b) => b.id === id);
  if (i === -1) return null;
  bookings[i] = { ...bookings[i], status, updatedAt: new Date().toISOString() };
  writeAll(bookings);
  return bookings[i];
}
