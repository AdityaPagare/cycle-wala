"use client";

/*
 * LET'S CONNECT — the closing chapter (Patta "Let's connect" as the mood
 * reference: curved panel row, floating perspective, calm typography).
 * Our take: five memory panels on a shallow 3D arc that lean with the
 * cursor and breathe on idle; the site-wide Button carries the CTA; social
 * cards use the same circle-fill + roll language as the nav.
 */

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, EASE, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import styles from "./Connect.module.css";
import { useLang } from "@/lib/i18n";
import { SHOP } from "@/lib/site";

/* Placeholder shop photos — replace with real store/workshop photography. */
const PANELS = [
  { src: "/images/placeholder-1.svg", focus: "center", rotate: 26, z: -110, y: -26 },
  { src: "/images/placeholder-2.svg", focus: "center", rotate: 13, z: -40, y: -8 },
  { src: "/images/placeholder-3.svg", focus: "center", rotate: 0, z: 0, y: 0 },
  { src: "/images/placeholder-1.svg", focus: "center", rotate: -13, z: -40, y: -8 },
  { src: "/images/placeholder-2.svg", focus: "center", rotate: -26, z: -110, y: -26 },
];

/* Official brand marks, inlined so they inherit size and need no requests.
   Paths are the brands' own glyphs (Instagram camera outline, Facebook "f") —
   not generic lookalikes. */
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

/* Placeholder contact details — replace with the shop's real profiles/number. */
const SOCIALS = [
  { name: "Instagram", mark: "instagram", href: "[PENDING — add real Instagram URL]" },
  { name: "Facebook", mark: "facebook", href: "[PENDING — add real Facebook URL]" },
  { name: "Phone", glyph: "☎", href: SHOP.phoneHref },
  { name: "Email", glyph: "@", href: `mailto:${SHOP.email}` },
] as const;

export default function Connect() {
  const root = useRef<HTMLElement>(null);
  const { t } = useLang();

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      /* reveal */
      gsap.from(`.${styles.head} > *`, {
        y: 36,
        autoAlpha: 0,
        duration: 0.9,
        ease: EASE.outExpo,
        stagger: 0.09,
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
      gsap.from(`.${styles.panel}`, {
        y: 90,
        autoAlpha: 0,
        duration: 1.1,
        ease: EASE.outExpo,
        stagger: { each: 0.08, from: "center" },
        immediateRender: false,
        scrollTrigger: { trigger: `.${styles.arc}`, start: "top 82%" },
      });
      gsap.from(`.${styles.socials} > *`, {
        y: 26,
        autoAlpha: 0,
        duration: 0.8,
        ease: EASE.outExpo,
        stagger: 0.07,
        immediateRender: false,
        scrollTrigger: { trigger: `.${styles.socials}`, start: "top 88%" },
      });

      /* idle float — each panel bobs on its own rhythm */
      gsap.utils.toArray<HTMLElement>(`.${styles.panelInner}`).forEach((p, i) => {
        gsap.to(p, {
          y: `+=${6 + (i % 3) * 3}`,
          duration: 3 + (i % 3) * 0.7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      });

      /* cursor: the whole arc leans, each panel adds its own micro-tilt */
      const panels = gsap.utils.toArray<HTMLElement>(`.${styles.panel}`);
      const setters = panels.map((p, i) => ({
        rx: gsap.quickTo(p, "rotationX", { duration: 0.9, ease: "power3.out" }),
        add: gsap.quickTo(p, "rotationY", { duration: 0.9, ease: "power3.out" }),
        base: PANELS[i].rotate,
      }));
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const cy = ((e.clientY - r.top) / r.height - 0.5) * 2;
        setters.forEach((s) => {
          s.add(s.base + cx * 5);
          s.rx(-cy * 4);
        });
      };
      const onLeave = () => setters.forEach((s) => {
        s.add(s.base);
        s.rx(0);
      });
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.connect} id="contact" ref={root}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>
          <span>08</span> {t("connect.eyebrow")}
        </p>
        <h2 className={styles.h2}>
          {t("connect.h2a")}{" "}
          <em className={styles.serif}>{t("connect.h2Em")}</em>
        </h2>
        <p className={styles.lede}>
          {t("connect.lede")}
        </p>
        <p className={styles.address}>
          {SHOP.address}
          <br />
          <a href={SHOP.phoneHref}>{SHOP.phone}</a>
          <br />
          {SHOP.hours}
        </p>
        <div className={styles.cta}>
          <Button href={`mailto:${SHOP.email}`} variant="primary" arrow>
            {t("connect.cta")}
          </Button>
        </div>
      </div>

      {/* curved memory arc */}
      <div className={styles.arc} aria-hidden="true">
        {PANELS.map((p, i) => (
          <div
            className={styles.panel}
            key={`${p.src}-${i}`}
            style={
              {
                transform: `translate3d(0, ${p.y}px, ${p.z}px) rotateY(${p.rotate}deg)`,
              } as React.CSSProperties
            }
          >
            <div className={`${styles.panelInner} ${styles.hasPhoto}`}>
              <img
                className={styles.photo}
                src={p.src}
                alt=""
                style={{ objectPosition: p.focus }}
                loading="lazy"
                decoding="async"
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
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
            <span className={styles.glyph}>
              {"mark" in s ? MARKS[s.mark] : s.glyph}
            </span>
            <span className={styles.roll}>
              <span>{s.name}</span>
              <span aria-hidden="true">{s.name}</span>
            </span>
            <span className={styles.arrow}>↗</span>
          </a>
        ))}
      </div>

      <footer className={styles.footer}>
        <span>
          {t("connect.credit")} <b>{SHOP.name}</b>
        </span>
        <a href="#home" className={styles.top}>
          {t("connect.top")}
        </a>
        <span>© 2026 {SHOP.name}</span>
      </footer>
    </section>
  );
}
