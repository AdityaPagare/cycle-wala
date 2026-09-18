"use client";

import { useState } from "react";
import type { Product, ProductCategory } from "@/lib/products";
import { adminFetch } from "@/lib/admin-client";
import styles from "./ProductForm.module.css";

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: "kids", label: "Kids' Cycles" },
  { id: "mtb", label: "Mountain Cycles" },
  { id: "hybrid", label: "City & Hybrid" },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ProductForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Product;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const isEdit = !!initial;
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [category, setCategory] = useState<ProductCategory>(initial?.category ?? "mtb");
  const [sizes, setSizes] = useState(initial?.sizes ?? "");
  const [specsText, setSpecsText] = useState((initial?.specs ?? []).join("\n"));
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "");
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [image, setImage] = useState(initial?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const slug = initial?.slug ?? slugify(`${brand}-${model}`);

  const handleFile = async (file: File) => {
    if (!slug) {
      setError("Enter brand and model before choosing a photo.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("slug", slug);
      const res = await adminFetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImage(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!brand || !model || !sizes || !image) {
      setError("Brand, model, sizes and a photo are required.");
      return;
    }
    setSaving(true);
    const payload = {
      slug,
      brand,
      model,
      category,
      sizes,
      specs: specsText.split("\n").map((s) => s.trim()).filter(Boolean),
      price: price === "" ? null : Number(price),
      image,
      inStock,
    };
    try {
      const res = await adminFetch(
        isEdit ? `/api/admin/products/${initial!.slug}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <label className={styles.field}>
          Brand
          <input value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </label>
        <label className={styles.field}>
          Model
          <input value={model} onChange={(e) => setModel(e.target.value)} required />
        </label>
        <label className={styles.field}>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value as ProductCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Sizes
          <input
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="e.g. 24T / 26T / 27.5T"
            required
          />
        </label>
        <label className={styles.field}>
          Price (₹) — leave blank to show &quot;Add: price&quot;
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 12990"
          />
        </label>
        <label className={styles.fieldCheck}>
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In stock
        </label>
      </div>

      <label className={styles.field}>
        Specs — one per line
        <textarea
          value={specsText}
          onChange={(e) => setSpecsText(e.target.value)}
          rows={4}
          placeholder={"21-speed Shimano gearing\nDual disc brakes"}
        />
      </label>

      <label className={styles.field}>
        Photo
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </label>
      {uploading && <p className={styles.hint}>Uploading photo…</p>}
      {image && (
        <div className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" />
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.save} disabled={saving || uploading}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Cycle"}
        </button>
      </div>
    </form>
  );
}
