/* Our Story — shop milestones (was: professional experience).
 * Real: 2020 founding, 2022 storefront, 2023 accessories wall,
 * city (Chhatrapati Sambhajinagar).
 * ⚠ Still placeholder: the "Shop Today" headline number.
 * `type` reuses the original union (Internship/Full-time/Hackathon/Freelance)
 * only as internal category keys — the visible label comes from
 * lib/i18n.tsx (type.Internship etc.), which now reads "Milestone",
 * "Expansion", "Community", "Partnership". */

export type Role = {
  company: string;
  role: string;
  type: "Internship" | "Full-time" | "Hackathon" | "Freelance";
  location: string;
  period: string;
  summary: string;
  achievements: string[];
  outcome: string;
  skills: string[];
  color: string;
  fg: "light" | "dark";
  logo?: {
    src: string;
    variant: "tile" | "plate";
    aspect: number;
    placement?: "right" | "below";
  };
  fr?: { role?: string; summary?: string; outcome?: string; achievements?: string[] };
};

export const ROLES: Role[] = [
  {
    company: "Cycle Wala",
    role: "The Repair Bench",
    type: "Internship",
    location: "Chhatrapati Sambhajinagar",
    period: "2020",
    summary:
      "Cycle Wala began as a single repair bench — one mechanic, honest pricing, and word-of-mouth as the only marketing.",
    achievements: [
      "Built a reputation for straight answers on what a cycle actually needed",
      "Kept turnaround fast enough that riders came back instead of shopping around",
    ],
    outcome: "The bench outgrew itself within its first year",
    skills: ["Repairs", "Tune-Ups", "Customer Trust"],
    color: "#4CAF2E",
    fg: "light",
  },
  {
    company: "Cycle Wala",
    role: "First Storefront",
    type: "Full-time",
    location: "Chhatrapati Sambhajinagar",
    period: "2022",
    summary:
      "The shop moved into its first storefront — new and used cycles for sale alongside the service counter.",
    achievements: [
      "Stocked the first lineup of mountain, road and kids' cycles",
      "Added a dedicated service bay separate from the sales floor",
    ],
    outcome: "Store and service under one roof for the first time",
    skills: ["Retail", "Inventory", "Service Bay"],
    color: "#141414",
    fg: "light",
  },
  {
    company: "Cycle Wala",
    role: "Accessories Wall",
    type: "Freelance",
    location: "Chhatrapati Sambhajinagar",
    period: "2023",
    summary:
      "Helmets, locks, lights and bags joined the shelves — riders could now gear up completely in one visit.",
    achievements: [
      "Built out the accessories range based on what riders actually asked for",
      "Started stocking genuine spare parts for common repairs",
    ],
    outcome: "Accessories became a third of the shop's floor space",
    skills: ["Accessories", "Genuine Parts", "Merchandising"],
    color: "#3c8a24",
    fg: "light",
  },
  {
    company: "Cycle Wala",
    role: "The Shop Today",
    type: "Hackathon",
    location: "Chhatrapati Sambhajinagar",
    period: "Today",
    summary:
      "Store, accessories and service for every kind of rider — from a child's first cycle to a serious road build.",
    achievements: [
      "[Add real milestones: authorized dealer status, staff certifications, community rides organised]",
    ],
    outcome: "[Add a real headline number — cycles sold, riders served, years running]",
    skills: ["Store", "Accessories", "Services"],
    color: "#FFB200",
    fg: "dark",
  },
];
