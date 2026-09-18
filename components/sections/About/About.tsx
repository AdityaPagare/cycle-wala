"use client";

import styles from "./About.module.css";
import { useLang } from "@/lib/i18n";

/* Real milestones — 2020 founding, 2022 storefront, 2023 accessories wall,
   Chhatrapati Sambhajinagar. Plain static timeline, no scroll-driven tunnel. */
const MILESTONES = [
  {
    year: "2020",
    title: "One repair bench",
    story:
      "Cycle Wala started as a single repair bench and a simple idea: treat every cycle like it matters, because to its rider, it does.",
  },
  {
    year: "2022",
    title: "Opening the doors",
    story:
      "The first storefront opened — cycles for sale alongside the service counter, so riders could buy, fix and upgrade in one place.",
  },
  {
    year: "2023",
    title: "Beyond the cycle",
    story:
      "Helmets, lights, locks, bags — the accessories wall grew alongside the cycles, because a ride is only as good as what you bring with you.",
  },
  {
    year: "Today",
    title: "The shop riders trust",
    story:
      "Store, accessories and service, under one roof — new riders finding their first cycle, regulars keeping theirs running for years.",
  },
];

/* Real, defensible numbers only — no fabricated customer/repair counts. */
const STATS = [
  { value: "2020", label: "Founded in" },
  { value: "5", label: "Brands stocked" },
  { value: "3", label: "Cycle categories" },
];

/* Honest, generic highlights consistent with the shop's own real story
   above — no fabricated certifications or e-commerce features. */
const HIGHLIGHTS = [
  { title: "Expert Service", body: "Trained mechanics, honest pricing, fast turnaround." },
  { title: "Genuine Parts", body: "Manufacturer parts for every repair — no substitutes." },
  { title: "Local Focus", body: "Serving riders in Chhatrapati Sambhajinagar since 2020." },
  { title: "Customer First", body: "Walk in, ask, and ride away knowing your cycle's sorted." },
];

export default function About() {
  const { t } = useLang();

  return (
    <section className={styles.about} id="about">
      <div className={styles.wrap}>
        <div className={styles.top}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>{t("about.eyebrow")}</p>
            <h2 className={styles.h2}>
              {t("about.h2a")} <em className={styles.serif}>{t("about.h2Em")}</em>
            </h2>
            <p className={styles.lede}>{t("about.lede")}</p>

            <div className={styles.highlights}>
              {HIGHLIGHTS.map((h) => (
                <div className={styles.highlight} key={h.title}>
                  <h4>{h.title}</h4>
                  <p>{h.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.photoCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/gallery/shop-1.png" alt="Inside the Cycle Wala shop" loading="lazy" />
          </div>
        </div>

        <div className={styles.stats}>
          {STATS.map((s) => (
            <div className={styles.stat} key={s.label}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.timelineBlock}>
          <p className={styles.timelineKicker}>{t("about.journey")}</p>
          <ol className={styles.timeline}>
            {MILESTONES.map((m) => (
              <li className={styles.beat} key={m.year}>
                <span className={styles.beatYear}>{m.year}</span>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.story}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
