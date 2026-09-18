"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_META } from "@/data/products-seed";
import type { Product, ProductCategory } from "@/lib/products";
import { useCart } from "@/lib/cart";
import StarRating from "@/components/ui/StarRating";
import ProductModal from "@/components/shop/ProductModal";
import styles from "./Shop.module.css";
import { useLang } from "@/lib/i18n";

/* The 5 brands behind the models above — real, from the shop's own supplier
   catalogues (public/documents/). */
const BRANDS = [
  { name: "Neufman", note: "Mountain cycles — TIG-welded frames, disc brakes." },
  { name: "Denvok", note: "City, hybrid and kids' cycles for everyday riding." },
  { name: "Schnell", note: "MTB, hybrid and road cycles for serious riders." },
  { name: "Keysto", note: "MTB, women's and kids' cycles, wide range." },
  { name: "Oyekid", note: "Dedicated kids' cycles, sized to grow with your child." },
];

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const CIRCLES: { id: "all" | ProductCategory; label: string; image: string }[] = [
  { id: "all", label: "All Cycles", image: "/images/hero-cycle.jpg" },
  ...CATEGORY_META.map((c) => ({ id: c.id as ProductCategory, label: c.label, image: c.circleImage })),
];

function BikeGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M5.5 17.5 11 8h4l3.5 9.5" />
        <path d="M11 8 9 12.5 5.5 17.5" />
        <path d="M9 12.5h5.5" />
        <path d="M11 8l1.3-2h2.2" />
      </g>
    </svg>
  );
}

/* tiny inline icon set for the filter sidebar — no external icon library */
const Icon = {
  sliders: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h10M18 6h2M4 12h2M8 12h12M4 18h14M20 18h0" />
      <circle cx="16" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  bike: <BikeGlyph />,
  target: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
      <path d="M10 1.5l2.47 5.5 5.98.55-4.53 4.02 1.37 5.93L10 14.77l-5.29 2.73 1.37-5.93L1.55 7.55l5.98-.55z" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M3 8l9-5 9 5-9 5-9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  ),
};

function FilterSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className={styles.section}>
      <button type="button" className={styles.sectionHead} onClick={() => setOpen((o) => !o)}>
        <span className={styles.sectionIcon}>{icon}</span>
        <span className={styles.sectionTitle}>{title}</span>
        <span className={styles.chevron}>{open ? "▴" : "▾"}</span>
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

export default function Shop() {
  const { t } = useLang();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const circlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(id);
  }, [selectedCategories]);

  const scrollCircles = (dir: 1 | -1) => circlesRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });

  const toggleCategory = (c: ProductCategory) => {
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = products;
    if (selectedCategories.length) list = list.filter((p) => selectedCategories.includes(p.category));
    if (minPrice) list = list.filter((p) => p.price !== null && p.price >= Number(minPrice));
    if (maxPrice) list = list.filter((p) => p.price !== null && p.price <= Number(maxPrice));
    if (minRating) list = list.filter((p) => p.rating >= minRating);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.model.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sizes.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else if (sort === "price-desc") sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [products, selectedCategories, minPrice, maxPrice, minRating, inStockOnly, query, sort]);

  const activeFilterCount =
    selectedCategories.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating ? 1 : 0) + (inStockOnly ? 1 : 0) + (query ? 1 : 0);
  const clearAll = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setInStockOnly(false);
    setQuery("");
  };

  return (
    <section className={styles.shop} id="shop">
      <div className={styles.wrap}>
        {/* ---------- circular category selector ---------- */}
        <div className={styles.circlesRow}>
          <button type="button" className={styles.circleNav} aria-label="Scroll categories left" onClick={() => scrollCircles(-1)}>
            ‹
          </button>
          <div className={styles.circles} ref={circlesRef} role="tablist" aria-label="Categories">
            {CIRCLES.map((c) => {
              const on = c.id === "all" ? selectedCategories.length === 0 : selectedCategories.length === 1 && selectedCategories[0] === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  className={styles.circleItem}
                  onClick={() => setSelectedCategories(c.id === "all" ? [] : [c.id])}
                >
                  <span className={`${styles.circlePhoto} ${on ? styles.circleOn : ""}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt="" loading="lazy" />
                  </span>
                  <span className={on ? styles.circleLabelOn : styles.circleLabel}>{c.label}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className={styles.circleNav} aria-label="Scroll categories right" onClick={() => scrollCircles(1)}>
            ›
          </button>
        </div>

        {loading || !products ? (
          <div className={styles.loader}>
            <span className={styles.loaderIcon}>
              <BikeGlyph />
            </span>
            <p>{t("shop.loading")}</p>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* ---------- sidebar filters ---------- */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarHead}>
                <h2>
                  <span className={styles.sidebarHeadIcon}>{Icon.sliders}</span> Filters
                </h2>
                <button onClick={clearAll} className={styles.clearAll}>
                  Clear all
                </button>
              </div>

              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>⌕</span>
                <input
                  className={styles.search}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search filters…"
                />
              </div>

              <FilterSection icon={Icon.bike} title="Categories">
                <ul className={styles.checkList}>
                  {CATEGORY_META.map((c) => (
                    <li key={c.id}>
                      <label className={styles.checkRow}>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(c.id)}
                          onChange={() => toggleCategory(c.id)}
                        />
                        {c.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </FilterSection>

              <FilterSection icon={Icon.target} title="Price Range">
                <div className={styles.priceRow}>
                  <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  <span>–</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
              </FilterSection>

              <FilterSection icon={Icon.star} title="Rating">
                <ul className={styles.ratingList}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <li key={n}>
                      <label className={styles.checkRow}>
                        <input type="radio" name="minRating" checked={minRating === n} onChange={() => setMinRating(n)} />
                        <StarRating value={n} /> <span className={styles.andUp}>&amp; up</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </FilterSection>

              <FilterSection icon={Icon.box} title="Availability">
                <label className={styles.checkRow}>
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                  In Stock Only
                </label>
              </FilterSection>
            </aside>

            {/* ---------- results ---------- */}
            <div>
              <div className={styles.resultsBar}>
                <p className={styles.count}>{filtered.length} cycles</p>
                <div className={styles.resultsActions}>
                  <select className={styles.sort} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                    <option value="featured">Sort: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                  <div className={styles.viewToggle}>
                    <button
                      className={view === "grid" ? styles.viewOn : styles.viewOff}
                      onClick={() => setView("grid")}
                      aria-label="Grid view"
                    >
                      ▦
                    </button>
                    <button
                      className={view === "list" ? styles.viewOn : styles.viewOff}
                      onClick={() => setView("list")}
                      aria-label="List view"
                    >
                      ☰
                    </button>
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className={styles.chips}>
                  {selectedCategories.map((c) => (
                    <span className={styles.chip} key={c}>
                      {CATEGORY_META.find((m) => m.id === c)?.label}{" "}
                      <button onClick={() => toggleCategory(c)}>×</button>
                    </span>
                  ))}
                  {query && (
                    <span className={styles.chip}>
                      &quot;{query}&quot; <button onClick={() => setQuery("")}>×</button>
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className={styles.chip}>
                      ₹{minPrice || 0} – ₹{maxPrice || "∞"}{" "}
                      <button
                        onClick={() => {
                          setMinPrice("");
                          setMaxPrice("");
                        }}
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className={styles.chip}>
                      {minRating}★ &amp; up <button onClick={() => setMinRating(0)}>×</button>
                    </span>
                  )}
                  {inStockOnly && (
                    <span className={styles.chip}>
                      In stock <button onClick={() => setInStockOnly(false)}>×</button>
                    </span>
                  )}
                </div>
              )}

              {filtered.length === 0 ? (
                <div className={styles.empty}>
                  <p className={styles.emptyTitle}>No cycles match these filters</p>
                  <p className={styles.emptySub}>Try clearing a filter or widening the price range.</p>
                  <button className={styles.emptyClear} onClick={clearAll}>
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className={view === "grid" ? styles.grid : styles.list}>
                  {filtered.map((item) => (
                    <article className={view === "grid" ? styles.card : styles.cardList} key={item.slug}>
                      <div className={styles.cardPhoto}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={`${item.brand} ${item.model}`} loading="lazy" />
                        <span className={item.inStock ? styles.stockBadge : styles.stockBadgeOut}>
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <div className={styles.cardBody}>
                        <p className={styles.brand}>
                          {item.brand} · {item.sizes}
                        </p>
                        <h4 className={styles.model}>{item.model}</h4>
                        <div className={styles.rating}>
                          <StarRating value={item.rating} />
                        </div>
                        <div className={styles.foot}>
                          <span className={item.price === null ? styles.priceTbc : styles.price}>
                            {item.price === null ? t("shop.addPrice") : `₹${item.price.toLocaleString("en-IN")}`}
                          </span>
                          <div className={styles.cardCtas}>
                            <button className={styles.viewBtn} onClick={() => setSelectedProduct(item)}>
                              View
                            </button>
                            <button
                              className={styles.addBtnSmall}
                              disabled={!item.inStock}
                              onClick={() =>
                                addToCart({
                                  slug: item.slug,
                                  brand: item.brand,
                                  model: item.model,
                                  image: item.image,
                                  price: item.price,
                                })
                              }
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------- brands we carry ---------- */}
        <div className={styles.brandsBlock}>
          <p className={styles.catNo}>{t("shop.brandsNo")}</p>
          <h3 className={styles.catLabel}>{t("shop.brandsLabel")}</h3>
          <div className={styles.brandsGrid}>
            {BRANDS.map((b) => (
              <div className={styles.brandCard} key={b.name}>
                <span className={styles.brandName}>{b.name}</span>
                <span className={styles.brandNote}>{b.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
}
