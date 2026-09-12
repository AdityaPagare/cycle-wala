/* Single source of truth for site-wide constants.
   Set NEXT_PUBLIC_SITE_URL in Vercel once the domain exists —
   everything (sitemap, robots, OG, JSON-LD) follows automatically. */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SHOP = {
  name: "Cycle Wala",
  tagline: "Store · Accessories · Services",
  description:
    "Your neighbourhood bicycle shop — new cycles, genuine accessories and expert servicing.",
  email: "hello@cyclewala.example",
  phone: "+91 92096 73730",
  phoneHref: "tel:+919209673730",
  address:
    "Kranti Chowk, opp. to Satya Electrical Shop, Paithan Gate, Sanmitra Colony, Nirala Bazar, Chhatrapati Sambhajinagar, Maharashtra 431001",
  hours: "Tue–Sun · 10am–11pm (Closed Mondays)",
  /* social/contact links — replace with the shop's real profiles */
  sameAs: [] as string[],
};
