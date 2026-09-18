"use client";

import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/lib/orders";
import { adminFetch } from "@/lib/admin-client";
import styles from "./OrdersPanel.module.css";

const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "New",
  contacted: "Contacted",
  fulfilled: "Fulfilled",
  cancelled: "Cancelled",
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await adminFetch("/api/admin/orders");
      setOrders(await res.json());
    } catch {
      /* adminFetch redirects on 401 */
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: OrderStatus) => {
    setError("");
    try {
      const res = await adminFetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      setError("Couldn't update that order — try again.");
    }
  };

  if (orders === null) return <p className={styles.hint}>Loading…</p>;
  if (orders.length === 0) return <p className={styles.hint}>No orders yet.</p>;

  return (
    <div className={styles.list}>
      {error && <p className={styles.error}>{error}</p>}
      {orders.map((o) => (
        <div className={styles.card} key={o.id}>
          <div className={styles.top}>
            <div>
              <p className={styles.id}>{o.id}</p>
              <p className={styles.date}>{new Date(o.createdAt).toLocaleString("en-IN")}</p>
            </div>
            <select
              className={styles[`status_${o.status}`] ?? styles.status}
              value={o.status}
              onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
            >
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.customer}>
            <p className={styles.customerName}>{o.customer.name}</p>
            <a className={styles.customerPhone} href={`tel:${o.customer.phone}`}>
              {o.customer.phone}
            </a>
            <p className={styles.customerAddress}>{o.customer.address}</p>
            {o.customer.note && <p className={styles.customerNote}>Note: {o.customer.note}</p>}
          </div>

          <ul className={styles.items}>
            {o.items.map((i) => (
              <li key={i.slug}>
                <span>
                  {i.brand} {i.model} × {i.qty}
                </span>
                <span>{i.price === null ? "Add: price" : `₹${(i.price * i.qty).toLocaleString("en-IN")}`}</span>
              </li>
            ))}
          </ul>

          <div className={styles.total}>
            <span>Total</span>
            <span>₹{o.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
