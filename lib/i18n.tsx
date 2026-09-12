"use client";

/*
 * Centralised store for every user-facing string on the site.
 *
 * English only — the reference this was ported from supported an EN/FR
 * toggle; Cycle Wala is a single-language local shop site, so `fr` is kept
 * as an optional field (unused) rather than removing the lookup machinery
 * every section still calls into.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "fr";

type Entry = { en: string; fr?: string };

export const DICT: Record<string, Entry> = {
  /* ---------------- nav ---------------- */
  "nav.home": { en: "Home" },
  "nav.about": { en: "About" },
  "nav.work": { en: "Shop" },
  "nav.contact": { en: "Contact" },
  "nav.menu": { en: "Open menu" },
  "nav.close": { en: "Close menu" },

  /* ---------------- intro ---------------- */
  "intro.scroll": { en: "Scroll to enter" },

  /* ---------------- hero ---------------- */
  "hero.kicker": { en: "Store · Accessories · Services" },
  "hero.h1a": { en: "Rides that feel" },
  "hero.h1aEm": { en: "alive." },
  "hero.h1b": { en: "Service you can" },
  "hero.h1bEm": { en: "trust." },
  "hero.sub": {
    en: "Your neighbourhood bicycle shop — new cycles, genuine accessories and expert servicing, for every kind of rider.",
  },
  "hero.cta1": { en: "Browse the Shop" },
  "hero.cta2": { en: "Book a Service" },
  "hero.scroll": { en: "Scroll to Explore" },
  "stat.projects": { en: "Cycles Serviced" },
  "stat.years": { en: "Years Serving Riders" },
  "stat.countries": { en: "Brands Stocked" },
  "stat.satisfaction": { en: "Customer Satisfaction" },

  /* ---------------- about ---------------- */
  "about.eyebrow": { en: "About" },
  "about.h2a": { en: "Cycling is how we think —" },
  "about.h2b": { en: "service is how we" },
  "about.h2Em": { en: "prove" },
  "about.h2c": { en: "it." },
  "about.m1": { en: "Founded as a single repair bench" },
  "about.m2": { en: "Years serving local riders" },
  "about.m3": { en: "Cycles sold and serviced" },
  "about.m4": { en: "Riders who came back for a second cycle" },
  "about.edu": {
    en: "Trained mechanics · genuine parts · honest advice — [add real shop credentials, certifications and staff details here].",
  },
  "about.cta": { en: "Explore the Shop" },

  /* ---------------- journey ----------------
     Chapter copy lives in content/journey.ts; only the chrome is here. */
  "journey.eyebrow": { en: "Our Journey" },
  "journey.enter": { en: "Scroll to travel" },
  "journey.chapter": { en: "Chapter" },
  "journey.lede": {
    en: "From a single repair bench to the neighbourhood's go-to cycle shop — the chapters of Cycle Wala.",
  },

  /* ---------------- brands we carry (was: design stack) ---------------- */
  "stack.eyebrow": { en: "In Store" },
  "stack.h2": { en: "Brands We" },
  "stack.h2Em": { en: "Carry." },
  "stack.lede": {
    en: "The categories and brands we stock, service and stand behind — from first cycles to serious road machines.",
  },
  "stack.count": { en: "categories" },
  "stack.disciplines": { en: "departments" },

  /* ---------------- work (was: featured work) ---------------- */
  "work.eyebrow": { en: "In the Shop" },
  "work.h2a": { en: "Cycles and services," },
  "work.h2b": { en: "ready to" },
  "work.h2Em": { en: "ride." },
  "work.lede": {
    en: "Store, accessories and services — everything a rider needs, explained in one place.",
  },
  "work.open": { en: "View details" },
  "work.hint": { en: "SCROLL TO BROWSE" },

  /* ---------------- experience (was: work history) ---------------- */
  "exp.eyebrow": { en: "Our Story" },
  "exp.h2": { en: "How we became the shop" },
  "exp.h2Em": { en: "riders trust." },
  "exp.worked": { en: "What happened" },
  "exp.impact": { en: "Impact" },
  "exp.tools": { en: "Focus areas" },
  "exp.hint": { en: "SCROLL · CLICK TO JUMP" },
  "type.Internship": { en: "Milestone" },
  "type.Full-time": { en: "Expansion" },
  "type.Hackathon": { en: "Community" },
  "type.Freelance": { en: "Partnership" },

  /* ---------------- certifications ---------------- */
  "cert.introLabel": { en: "Introduction" },
  "cert.introTitle1": { en: "AUTHORIZED &" },
  "cert.introTitle2": { en: "CERTIFIED" },
  "cert.introBody": {
    en: "Trained mechanics and authorized service relationships — the technical base underneath every repair and sale.",
  },
  "cert.introNote": {
    en: "[Add real certifications, authorized-dealer status and staff training here.]",
  },
  "cert.eyebrow": { en: "Certifications" },
  "cert.h2": { en: "Certifications" },
  "cert.lede": {
    en: "Authorized dealer status and mechanic certifications — confirm the real list before publishing.",
  },
  "cert.certified": { en: "Certified" },
  "cert.brandRole": { en: "Cycle Wala" },
  "cert.issuerTBC": { en: "Issuer — to confirm" },
  "cert.certification": { en: "Certification" },
  "cert.verified": { en: "✓ Verified" },
  "cert.onRequest": { en: "Details on request" },
  "cert.issuedBy": { en: "Issued by" },
  "cert.year": { en: "Year" },
  "cert.id": { en: "Reference ID" },
  "cert.tbc": { en: "To confirm" },
  "cert.skills": { en: "Covers" },
  "cert.verify": { en: "Verify ↗" },
  "cert.foot": { en: "Certifications" },

  /* ---------------- gallery ---------------- */
  "gallery.eyebrow": { en: "The Shop Floor" },
  "gallery.h2a": { en: "A look inside" },
  "gallery.h2Em": { en: "the shop" },
  "gallery.lede": {
    en: "Riders picking up their new cycles, right from the shop floor.",
  },
  "gallery.alt": { en: "A photo from inside Cycle Wala" },
  "gallery.frames": { en: "Photos" },
  "gallery.hint": { en: "Scroll to browse" },

  /* ---------------- connect ---------------- */
  "connect.eyebrow": { en: "Visit Us" },
  "connect.h2a": { en: "Ready for your" },
  "connect.h2Em": { en: "next ride?" },
  "connect.lede": {
    en: "Come by the store, book a service, or ask us anything — new riders and regulars are always welcome.",
  },
  "connect.cta": { en: "Get in Touch" },
  "connect.credit": { en: "A shop by" },
  "connect.top": { en: "Back to top ↑" },

  /* ---------------- case study (/work/[slug]) ---------------- */
  "case.back": { en: "← Back to shop" },
  "case.kicker": { en: "In the Shop" },
  "case.role": { en: "Category" },
  "case.timeline": { en: "Availability" },
  "case.focus": { en: "Focus" },
  "case.site": { en: "More info" },
  "case.repo": { en: "Source" },
  "case.cover": { en: "COVER" },
  "case.context": { en: "Overview" },
  "case.problem": { en: "Who It's For" },
  "case.process": { en: "What We Offer" },
  "case.decisions": { en: "Why It's Worth It" },
  "case.outcome": { en: "What You Get" },
  "case.reflection": { en: "Good to Know" },
  "case.all": { en: "← All categories" },
  "case.next": { en: "Next category" },

  /* ---------------- lab (/tunnel) ---------------- */
  "lab.back": { en: "← CYCLE WALA" },
  "lab.hint": { en: "LAB · TUNNEL TYPE — SCROLL TO TRAVEL · MOVE THE MOUSE" },

  /* ---------------- 404 ---------------- */
  "nf.label": { en: "404 — NOT FOUND" },
  "nf.h1": { en: "This page rolled" },
  "nf.h1Em": { en: "off the road." },
  "nf.cta": { en: "Back to the shop →" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };

const LanguageContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => DICT[k]?.en ?? k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("lang") as Lang | null;
    if (saved === "en" || saved === "fr") {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("lang", l);
    } catch {
      /* private mode — the choice simply won't persist */
    }
    document.documentElement.lang = l;
  };

  const t = (k: string) => DICT[k]?.[lang] ?? DICT[k]?.en ?? k;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);

/** Pick a translated field off a content record: `L(lang, item, "summary")`
 *  returns `item.fr.summary` when available, else the English original. */
export function L<T extends { fr?: Record<string, unknown> }>(
  lang: Lang,
  item: T,
  field: keyof T & string
): string {
  if (lang === "fr" && item.fr && typeof item.fr[field] === "string") {
    return item.fr[field] as string;
  }
  return item[field] as unknown as string;
}
