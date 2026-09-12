/* THE JOURNEY — the chapters the light tunnel travels through.
 *
 * Real: 2020 founding, 2022 storefront, 2023 accessories wall,
 * city (Chhatrapati Sambhajinagar).
 *
 * Shape per chapter:
 *   year   — shown large, the anchor
 *   title  — what the chapter is about
 *   place  — where it happened (context line)
 *   story  — what was actually happening, 2–3 sentences
 *   bridge — how it handed over to the next chapter (the transition line)
 */

export type Chapter = {
  id: string;
  year: string;
  title: string;
  place: string;
  story: string;
  bridge: string;
  fr?: { title?: string; place?: string; story?: string; bridge?: string };
};

export const CHAPTERS: Chapter[] = [
  {
    id: "bench",
    year: "2020",
    title: "One repair bench",
    place: "Chhatrapati Sambhajinagar",
    story:
      "Cycle Wala started as a single repair bench and a simple idea: treat every cycle like it matters, because to its rider, it does.",
    bridge: "Word got around, and the bench needed a shop front.",
  },
  {
    id: "storefront",
    year: "2022",
    title: "Opening the doors",
    place: "Chhatrapati Sambhajinagar",
    story:
      "The first storefront opened — cycles for sale alongside the service counter, so riders could buy, fix and upgrade in one place.",
    bridge: "Riders kept asking for gear we didn't stock yet.",
  },
  {
    id: "accessories",
    year: "2023",
    title: "Beyond the cycle",
    place: "Chhatrapati Sambhajinagar",
    story:
      "Helmets, lights, locks, bags — the accessories wall grew alongside the cycles, because a ride is only as good as what you bring with you.",
    bridge: "Kids started showing up on cycles we'd sold their parents.",
  },
  {
    id: "today",
    year: "Today",
    title: "The shop riders trust",
    place: "Chhatrapati Sambhajinagar",
    story:
      "Store, accessories and service, under one roof — new riders finding their first cycle, regulars keeping theirs running for years.",
    bridge: "The next chapter is whoever walks in next.",
  },
];
