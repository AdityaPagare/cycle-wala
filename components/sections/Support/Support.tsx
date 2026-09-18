"use client";

import styles from "./Support.module.css";
import { useLang } from "@/lib/i18n";
import { SHOP } from "@/lib/site";

/* WE CARE — plain support strip, real contact details only. */
export default function Support() {
  const { t } = useLang();

  return (
    <section className={styles.support}>
      <div className={styles.wrap}>
        <div className={styles.photo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/gallery/shop-2.png" alt="Inside the Cycle Wala shop" loading="lazy" />
        </div>

        <div className={styles.body}>
          <h2 className={styles.h2}>{t("support.h2")}</h2>
          <p className={styles.lede}>{t("support.lede")}</p>

          <div className={styles.cards}>
            <a className={styles.card} href={SHOP.phoneHref}>
              <span className={styles.cardLabel}>{t("support.helpLabel")}</span>
              <span className={styles.cardValue}>{SHOP.phone}</span>
            </a>
            <div className={styles.card}>
              <span className={styles.cardLabel}>{t("support.fitLabel")}</span>
              <span className={styles.cardValue}>{t("support.fitValue")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
