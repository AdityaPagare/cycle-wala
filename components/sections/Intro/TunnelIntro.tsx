"use client";

/*
 * SECTION 01 — THE OPENING.
 *
 * A 300-frame image sequence (public/images/cycle-frames/) drawn to a
 * <canvas>, one frame per scroll tick — the classic Apple-product-page
 * technique. No video element (seeking/buffering quirks across browsers),
 * no WebGL, no big masked wordmark text. The frames ARE the opening.
 *
 * Loading strategy: every frame starts loading immediately (they're small —
 * ~50KB each, ~15MB total), but nothing blocks on "all 300 ready". The
 * canvas always draws the highest-numbered frame that HAS finished loading
 * at or before the scroll-computed target index, so scrubbing is responsive
 * from frame 1 onward instead of waiting on the full set.
 *
 * Mechanics kept from the original: the Scene's sticky hold pins this
 * section (no `pin` here — see lib/scene.ts), progress comes from
 * sceneScrub() against the runway, and the nav stays hidden
 * (`intro-active` body class) until the journey is almost done, at which
 * point a white wash fades in to hand off cleanly to the light Hero below.
 */

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { sceneScrub } from "@/lib/scene";
import styles from "./TunnelIntro.module.css";
import { useLang } from "@/lib/i18n";

const STAGES = 6;
const FRAME_COUNT = 300;
const FRAME_PATH = (n: number) => `/images/cycle-frames/frame-${String(n).padStart(3, "0")}.jpg`;
/* the white wash begins this far through the runway, so the cut to the
   light Hero below never feels abrupt */
const RELEASE_START = 0.86;

export default function TunnelIntro({ text = "CYCLE WALA" }: { text?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { t } = useLang();

  useEffect(() => {
    const rootEl = rootRef.current;
    const canvas = canvasRef.current;
    if (!rootEl || !canvas) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    /* ---------- preload: every frame starts now, nothing blocks on "all done" ---------- */
    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT + 1).fill(null);
    let highestLoaded = 0;
    let alive = true;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (!alive) return;
        images[i] = img;
        if (i > highestLoaded) highestLoaded = i;
        if (i === 1) draw(1);
      };
      img.src = FRAME_PATH(i);
    }

    let currentDrawn = 0;
    function draw(targetIndex: number) {
      /* the nearest frame at-or-before target that has actually finished
         loading — keeps scrubbing responsive even mid-preload */
      let idx = Math.min(targetIndex, highestLoaded || 1);
      while (idx > 1 && !images[idx]) idx--;
      const img = images[idx];
      if (!img || idx === currentDrawn) return;
      currentDrawn = idx;

      const w = canvas.width;
      const h = canvas.height;
      const canvasAr = w / h;
      const imgAr = img.naturalWidth / img.naturalHeight;
      /* cover: fill the frame, crop the overflow, never letterbox */
      let dw = w;
      let dh = h;
      if (imgAr > canvasAr) {
        dh = h;
        dw = h * imgAr;
      } else {
        dw = w;
        dh = w / imgAr;
      }
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx2d.clearRect(0, 0, w, h);
      ctx2d.drawImage(img, dx, dy, dw, dh);
    }

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(rootEl.clientWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      currentDrawn = 0; /* force a redraw at the new size */
      draw(Math.max(1, highestLoaded));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(rootEl);
    resize();

    if (prefersReducedMotion()) {
      /* settled state: hold on a representative frame once it's in, no pin */
      document.body.classList.remove("intro-active");
      return () => {
        alive = false;
        ro.disconnect();
      };
    }

    document.body.classList.add("intro-active");

    const stageEl = rootEl.querySelector<HTMLElement>(`.${styles.stageNow}`);
    const fillEl = rootEl.querySelector<HTMLElement>(`.${styles.progFill}`);
    const hintEl = rootEl.querySelector<HTMLElement>(`.${styles.hint}`);
    const washEl = rootEl.querySelector<HTMLElement>(`.${styles.wash}`);
    let stageShown = 1;

    const st = ScrollTrigger.create({
      ...sceneScrub(rootEl),
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        document.body.classList.toggle("intro-active", p < 0.94);

        const target = Math.max(1, Math.min(FRAME_COUNT, Math.round(p * (FRAME_COUNT - 1)) + 1));
        draw(target);

        const stage = Math.min(STAGES, 1 + Math.floor(p * STAGES));
        if (stage !== stageShown && stageEl) {
          stageShown = stage;
          stageEl.textContent = `0${stage}`;
        }
        if (fillEl) fillEl.style.transform = `scaleX(${p.toFixed(4)})`;
        if (hintEl) hintEl.style.opacity = String(Math.max(0, 1 - p * 6));

        const release = gsap.utils.clamp(0, 1, (p - RELEASE_START) / (1 - RELEASE_START));
        if (washEl) washEl.style.opacity = String(release);
      },
    });

    return () => {
      alive = false;
      document.body.classList.remove("intro-active");
      st.kill();
      ro.disconnect();
    };
  }, []);

  return (
    <section className={styles.intro} id="intro" ref={rootRef}>
      <div className={styles.frame}>
        <canvas ref={canvasRef} className={styles.video} aria-hidden="true" />
        <div className={styles.wash} aria-hidden="true" />

        <h1 className={styles.srOnly}>{text} — Store, Accessories &amp; Services</h1>

        <p className={styles.hint} aria-hidden="true">
          {t("intro.scroll")}
        </p>

        {/* 01 ━━━━━━ 06 — you're entering the experience */}
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.stageNow}>01</span>
          <span className={styles.progLine}>
            <span className={styles.progFill} />
          </span>
          <span>0{STAGES}</span>
        </div>
      </div>
    </section>
  );
}
