/* In the Shop — store/accessories/service categories (was: featured
   portfolio case studies). Same Project/Study shape as the reference so
   Work.tsx and /work/[slug] need no structural changes — only the data.

   ⚠ PLACEHOLDER copy: generic, honest category descriptions — no specific
   brand names, prices or claims are asserted. Replace with the shop's real
   lineup, pricing and photography before publishing. */

export type Study = {
  role: string;
  timeline: string;
  context: string;
  problem: string;
  process: { title: string; body: string }[];
  decisions: { title: string; why: string }[];
  outcomes: string[];
  reflection: string;
  note?: string;
};

export type StudyFr = Partial<Study>;

export type Cover = {
  bg: string;
  ink: "light" | "dark";
  src?: string;
  aspect?: number;
  variant?: "brand" | "photo";
  focus?: string;
  mark?: string;
};

export type Project = {
  slug: string;
  title: string;
  tags: string[];
  year: string;
  oneLiner: string;
  contribution: string;
  coverLabel: string;
  cover?: Cover;
  site?: { url: string; label: string };
  repo?: string;
  award?: string;
  study: Study;
  fr?: {
    title?: string;
    oneLiner?: string;
    contribution?: string;
    tags?: string[];
    study?: StudyFr;
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "mountain-cycles",
    title: "Mountain Cycles",
    tags: ["Trail", "Hardtail", "Full-Suspension"],
    year: "In Store",
    oneLiner: "Trail-ready mountain cycles for weekend riders and serious off-roaders alike.",
    contribution: "Sized, set up and ready to ride out the door.",
    coverLabel: "MOUNTAIN BIKES",
    cover: { bg: "#eafbe7", ink: "dark", mark: "MTB" },
    study: {
      role: "Store category",
      timeline: "In stock",
      context: "[Add: which brands/models the shop actually carries, and price range.]",
      problem: "Riders need a cycle sized and set up for the terrain they'll actually ride.",
      process: [
        { title: "Fit first", body: "Every cycle is sized to the rider before it leaves the shop." },
        { title: "Test the trail setup", body: "Suspension, tyre pressure and gearing checked for the rider's actual routes." },
      ],
      decisions: [
        { title: "No cycle leaves unsized", why: "A mountain cycle that doesn't fit is a mountain cycle that gets returned for repairs, not ridden." },
      ],
      outcomes: ["[Add: real inventory highlights, financing options, trade-in policy]"],
      reflection: "[Add a real note from the shop about what makes the mountain-cycle range worth visiting for.]",
    },
  },
  {
    slug: "road-cycles",
    title: "Road Cycles",
    tags: ["Road", "Endurance", "Fitness"],
    year: "In Store",
    oneLiner: "Lightweight road cycles for commuting, fitness and long-distance riding.",
    contribution: "From first-timer hybrids to serious road machines.",
    coverLabel: "ROAD BIKES",
    cover: { bg: "#eaf2ff", ink: "dark", mark: "ROAD" },
    study: {
      role: "Store category",
      timeline: "In stock",
      context: "[Add: which brands/models, gearing options, and price range.]",
      problem: "A road cycle bought for the wrong use case gets ridden once and shelved.",
      process: [
        { title: "Ask how it'll be used", body: "Commuting, fitness or distance riding each point to a different cycle." },
        { title: "Set up before delivery", body: "Gearing, brakes and contact points adjusted before the cycle goes home." },
      ],
      decisions: [
        { title: "Match the cycle to the use, not the budget alone", why: "The right cycle for the rider's actual riding gets ridden — the flashiest one doesn't always." },
      ],
      outcomes: ["[Add: real inventory highlights, service package included with purchase]"],
      reflection: "[Add a real note from the shop about the road range.]",
    },
  },
  {
    slug: "kids-cycles",
    title: "Kids' Cycles",
    tags: ["Kids", "Balance Cycles", "First Cycles"],
    year: "In Store",
    oneLiner: "First cycles and balance cycles, sized to grow with the rider.",
    contribution: "Safety-checked, sized right, and fun to ride.",
    coverLabel: "KIDS' BIKES",
    cover: { bg: "#fff8e1", ink: "dark", mark: "KIDS" },
    study: {
      role: "Store category",
      timeline: "In stock",
      context: "[Add: age/size ranges carried, balance-cycle vs pedal options.]",
      problem: "A kid's cycle that's the wrong size teaches bad habits or gets abandoned.",
      process: [
        { title: "Size to the child, not the age label", body: "Inseam and confidence matter more than the number on the box." },
        { title: "Safety check every unit", body: "Brakes, reflectors and fasteners checked before sale." },
      ],
      decisions: [
        { title: "Trade-in friendly", why: "Kids outgrow cycles fast — [confirm: does the shop actually offer a trade-in/upgrade programme?]." },
      ],
      outcomes: ["[Add: real sizing chart, trade-in terms if offered]"],
      reflection: "[Add a real note from the shop about fitting kids' first cycles.]",
    },
  },
  {
    slug: "accessories",
    title: "Accessories",
    tags: ["Helmets", "Locks", "Lights", "Bags"],
    year: "In Store",
    oneLiner: "Everything a ride needs beyond the cycle itself.",
    contribution: "Helmets, locks, lights, bags and genuine spare parts.",
    coverLabel: "ACCESSORIES",
    cover: { bg: "#f0ebfd", ink: "dark", mark: "ACC" },
    study: {
      role: "Store category",
      timeline: "In stock",
      context: "[Add: brands/lines carried for helmets, locks, lights, bags.]",
      problem: "The right accessories are a safety question, not just an upsell.",
      process: [
        { title: "Fit the helmet properly", body: "Sized and adjusted in-store, not guessed off a size chart." },
        { title: "Match the lock to the risk", body: "Where and how long a cycle is parked changes what lock actually makes sense." },
      ],
      decisions: [
        { title: "Stock genuine parts", why: "A part that doesn't fit right fails right when it's needed most." },
      ],
      outcomes: ["[Add: real accessory range highlights and price points]"],
      reflection: "[Add a real note from the shop about the accessories wall.]",
    },
  },
  {
    slug: "repair-and-service",
    title: "Repair & Service",
    tags: ["Tune-Ups", "Repairs", "Diagnostics"],
    year: "Services",
    oneLiner: "Tune-ups, repairs and diagnostics from trained mechanics.",
    contribution: "Honest assessments — fixed right the first time.",
    coverLabel: "REPAIR & SERVICE",
    cover: { bg: "#0E1F38", ink: "light", mark: "SVC" },
    study: {
      role: "Service department",
      timeline: "[Add: typical turnaround time, walk-in vs appointment]",
      context: "[Add: what a standard tune-up includes, and pricing.]",
      problem: "Riders need to trust that a quoted repair is the repair the cycle actually needs.",
      process: [
        { title: "Diagnose before quoting", body: "A full check before any work starts, so the quote reflects the real issue." },
        { title: "Show, don't just tell", body: "Worn parts are shown to the rider, not just described on an invoice." },
      ],
      decisions: [
        { title: "No unnecessary upsells", why: "Trust is what brings a rider back for the next service — a padded invoice doesn't." },
      ],
      outcomes: ["[Add: real turnaround times, warranty on repairs, pricing tiers]"],
      reflection: "[Add a real note from the shop's mechanics about the service philosophy.]",
    },
  },
  {
    slug: "custom-builds",
    title: "Custom Builds",
    tags: ["Custom", "Upgrades", "Fit"],
    year: "Services",
    oneLiner: "Built up from the frame, exactly to the rider's spec.",
    contribution: "Component selection, fit and assembly, done properly.",
    coverLabel: "CUSTOM BUILDS",
    cover: { bg: "#0B0B0E", ink: "light", mark: "CUS" },
    study: {
      role: "Service department",
      timeline: "[Add: typical build lead time]",
      context: "[Add: what component brands/options are available for a custom build.]",
      problem: "A rider with specific needs — racing, touring, comfort — often doesn't fit an off-the-shelf cycle.",
      process: [
        { title: "Start with the fit", body: "Frame size and geometry chosen for the rider before any component is picked." },
        { title: "Build to spec, test before handover", body: "Every custom build is ridden and checked before it goes home." },
      ],
      decisions: [
        { title: "One point of contact through the build", why: "A custom build with too many hand-offs is where mistakes creep in." },
      ],
      outcomes: ["[Add: real examples of past custom builds, starting price]"],
      reflection: "[Add a real note from the shop about a build worth featuring.]",
    },
  },
];
