"use client";

import Button from "@/components/ui/Button";
import styles from "./Hero.module.css";
import { useLang } from "@/lib/i18n";
import { SHOP } from "@/lib/site";

/* HERO — simple, static, no scroll-jacking, no canvas, no particles.
   Headline + copy + CTAs on one side, one real photo on the other. */
export default function Hero() {
  const { t } = useLang();

  return (
    <section className={styles.hero} id="home">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <p className={styles.kicker}>{t("hero.kicker")}</p>
          <h1 className={styles.h1}>
            {t("hero.h1a")} <em className={styles.serif}>{t("hero.h1aEm")}</em>
            <br />
            {t("hero.h1b")} <em className={`${styles.serif} ${styles.red}`}>{t("hero.h1bEm")}</em>
          </h1>
          <p className={styles.sub}>{t("hero.sub")}</p>

          <div className={styles.ctas}>
            <Button href="#shop" variant="primary" arrow magnetic={false}>
              {t("hero.cta1")}
            </Button>
            <Button href={SHOP.phoneHref} variant="ghost" magnetic={false}>
              {t("hero.cta2")}
            </Button>
          </div>

          <p className={styles.fact}>
            {SHOP.address.split(",").slice(0, 3).join(", ")} · {SHOP.hours}
          </p>
        </div>

        <div className={styles.stage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.photo}
            src="/images/hero-cycle.jpg"
            alt="A cycle ready for the road"
            width={1280}
            height={720}
          />
        </div>
      </div>
    </section>
  );
}
