"use client";

import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import styles from "./Connect.module.css";
import { useLang } from "@/lib/i18n";
import { SHOP } from "@/lib/site";

/* Official brand marks, inlined so they inherit size and need no requests. */
const MARKS: Record<string, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.8 8.44-4.94 8.44-9.94z" />
    </svg>
  ),
};

/* Placeholder contact details — replace with the shop's real profiles once confirmed. */
const SOCIALS = [
  { name: "Instagram", mark: "instagram", href: "[PENDING — add real Instagram URL]" },
  { name: "Facebook", mark: "facebook", href: "[PENDING — add real Facebook URL]" },
  { name: "Phone", glyph: "☎", href: SHOP.phoneHref },
  { name: "Email", glyph: "@", href: `mailto:${SHOP.email}` },
] as const;

export default function Connect() {
  const { t } = useLang();

  return (
    <section className={styles.connect} id="contact">
      <div className={styles.head}>
        <p className={styles.eyebrow}>
          <span>04</span> {t("connect.eyebrow")}
        </p>
        <h2 className={styles.h2}>
          {t("connect.h2a")} <em className={styles.serif}>{t("connect.h2Em")}</em>
        </h2>
        <p className={styles.lede}>{t("connect.lede")}</p>
        <p className={styles.address}>
          {SHOP.address}
          <br />
          <a href={SHOP.phoneHref}>{SHOP.phone}</a>
          <br />
          {SHOP.hours}
        </p>
        <div className={styles.cta}>
          <Button href={SHOP.phoneHref} variant="primary" arrow magnetic={false}>
            {t("connect.cta")}
          </Button>
        </div>
      </div>

      {/* social cards */}
      <div className={styles.socials}>
        {SOCIALS.map((s) => (
          <a
            key={s.name}
            href={s.href}
            className={styles.social}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noreferrer" : undefined}
          >
            <span className={styles.glyph}>{"mark" in s ? MARKS[s.mark] : s.glyph}</span>
            <span>{s.name}</span>
          </a>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footGrid}>
          <div className={styles.footCol}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-wordmark.png" alt={SHOP.name} className={styles.footLogo} />
            <p>{SHOP.description}</p>
          </div>

          <div className={styles.footCol}>
            <h5>{t("connect.navHeading")}</h5>
            <a href="#home">{t("nav.home")}</a>
            <a href="#about">{t("nav.about")}</a>
            <a href="#shop">{t("nav.shop")}</a>
            <a href="#services">{t("nav.services")}</a>
            <a href="#gallery">{t("nav.gallery")}</a>
          </div>

          <div className={styles.footCol}>
            <h5>{t("connect.categoriesHeading")}</h5>
            <a href="#shop">Kids' Cycles</a>
            <a href="#shop">Mountain Cycles</a>
            <a href="#shop">City & Hybrid</a>
          </div>

          <div className={styles.footCol}>
            <h5>{t("connect.contactHeading")}</h5>
            <p>{SHOP.address}</p>
            <a href={SHOP.phoneHref}>{SHOP.phone}</a>
            <p>{SHOP.hours}</p>
          </div>
        </div>

        <div className={styles.footBottom}>
          <span>
            {t("connect.credit")} <b>{SHOP.name}</b>
          </span>
          <a href="#home" className={styles.top}>
            {t("connect.top")}
          </a>
          <span>© 2026 {SHOP.name}</span>
        </div>
      </footer>
    </section>
  );
}
