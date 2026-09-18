"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { adminFetch, clearAdminToken, getAdminToken } from "@/lib/admin-client";
import ProductForm from "@/components/admin/ProductForm";
import OrdersPanel from "@/components/admin/OrdersPanel";
import styles from "./dashboard.module.css";

const CATEGORY_LABEL: Record<string, string> = {
  kids: "Kids' Cycles",
  mtb: "Mountain Cycles",
  hybrid: "City & Hybrid",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"cycles" | "orders">("cycles");
  const [products, setProducts] = useState<Product[] | null>(null);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await adminFetch("/api/admin/products");
      setProducts(await res.json());
    } catch {
      /* adminFetch already redirects on 401 */
    }
  };

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this cycle? This can't be undone.")) return;
    setError("");
    try {
      const res = await adminFetch(`/api/admin/products/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      load();
    } catch {
      setError("Couldn't delete that cycle — try again.");
    }
  };

  const logout = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  if (editing) {
    return (
      <main className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.formHead}>
            <h1 className={styles.h1}>{editing === "new" ? "Add a Cycle" : `Edit ${editing.model}`}</h1>
          </div>
          <ProductForm
            initial={editing === "new" ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              load();
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <p className={styles.kicker}>Cycle Wala Admin</p>
            <h1 className={styles.h1}>Manage the Shop</h1>
          </div>
          <div className={styles.headActions}>
            {tab === "cycles" && (
              <button className={styles.add} onClick={() => setEditing("new")}>
                + Add Cycle
              </button>
            )}
            <a href="/" className={styles.viewSite}>
              View site ↗
            </a>
            <button className={styles.logout} onClick={logout}>
              Log out
            </button>
          </div>
        </div>

        <div className={styles.tabs}>
          <button className={tab === "cycles" ? styles.tabOn : styles.tab} onClick={() => setTab("cycles")}>
            Cycles
          </button>
          <button className={tab === "orders" ? styles.tabOn : styles.tab} onClick={() => setTab("orders")}>
            Orders
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {tab === "orders" ? (
          <OrdersPanel />
        ) : products === null ? (
          <p className={styles.hint}>Loading…</p>
        ) : products.length === 0 ? (
          <p className={styles.hint}>No cycles yet — add the first one.</p>
        ) : (
          <div className={styles.table}>
            {products.map((p) => (
              <div className={styles.row} key={p.slug}>
                <div className={styles.rowPhoto}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" />
                </div>
                <div className={styles.rowInfo}>
                  <p className={styles.rowBrand}>{p.brand}</p>
                  <p className={styles.rowModel}>{p.model}</p>
                  <p className={styles.rowMeta}>
                    {CATEGORY_LABEL[p.category]} · {p.sizes}
                  </p>
                </div>
                <div className={styles.rowPrice}>
                  {p.price != null ? `₹${p.price.toLocaleString("en-IN")}` : "Add: price"}
                </div>
                <div className={p.inStock ? styles.stockOk : styles.stockOut}>
                  {p.inStock ? "In stock" : "Out of stock"}
                </div>
                <div className={styles.rowActions}>
                  <button onClick={() => setEditing(p)}>Edit</button>
                  <button className={styles.delete} onClick={() => handleDelete(p.slug)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
