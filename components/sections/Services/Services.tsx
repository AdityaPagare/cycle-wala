"use client";

import { SHOP } from "@/lib/site";
import styles from "./Services.module.css";
import { useLang } from "@/lib/i18n";

/* Generic, standard bicycle-service tasks — not specific claims beyond what
   any repair bench does. Prices are unconfirmed, so each card shows a
   visible "Add: price" placeholder instead of a guessed number. */
const SERVICES = [
  {
    title: "Basic Tune-Up",
    note: "For regular & kids' cycles",
    items: [
      "Check & adjust brakes",
      "Check & adjust gears",
      "Wheel truing check",
      "Lubrication & general clean-up",
    ],
  },
  {
    title: "Full Gear Service",
    note: "For MTB & geared cycles",
    items: [
      "Everything in the Basic Tune-Up",
      "Degrease & re-lubricate drivetrain",
      "Spoke tension & wheel alignment",
      "Full safety check before handover",
    ],
  },
];

export default function Services() {
  const { t } = useLang();

  return (
    <section className={styles.services} id="services">
      <div className={styles.wrap}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>{t("services.eyebrow")}</p>
          <h2 className={styles.h2}>{t("services.h2")}</h2>
          <p className={styles.lede}>{t("services.lede")}</p>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <div className={styles.card} key={s.title}>
              <p className={styles.cardNote}>{s.note}</p>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.cardPrice}>{t("shop.addPrice")}</p>
              <ul className={styles.cardList}>
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <a className={styles.cardCta} href={SHOP.phoneHref}>
                {t("services.book")}
              </a>
            </div>
          ))}

          <div className={styles.card}>
            <p className={styles.cardNote}>{t("services.otherNote")}</p>
            <h3 className={styles.cardTitle}>{t("services.otherTitle")}</h3>
            <p className={styles.cardQuote}>{t("services.quote")}</p>
            <a className={styles.cardCta} href={SHOP.phoneHref}>
              {t("services.ask")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
