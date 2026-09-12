/* Brands We Carry — shown in the spiral orbit (was: My Design Stack).
   `mono` + `color` render a styled monogram tile — no image asset needed.
   These are generic categories/departments, not specific brand claims —
   swap in real brand names/logos once the shop's actual lineup is confirmed. */

export type Tool = {
  name: string;
  group: "Cycles" | "Accessories" | "Service" | "Kids";
  src?: string;
  mono?: string;
  color?: string;
};

export const TOOLS: Tool[] = [
  /* — Cycles — */
  { name: "Mountain", group: "Cycles", mono: "MTB", color: "#4CAF2E" },
  { name: "Road", group: "Cycles", mono: "RD", color: "#3c8a24" },
  { name: "Hybrid", group: "Cycles", mono: "HY", color: "#141414" },
  { name: "Electric", group: "Cycles", mono: "E+", color: "#0891A6" },

  /* — Accessories — */
  { name: "Helmets", group: "Accessories", mono: "HL", color: "#D97A00" },
  { name: "Locks", group: "Accessories", mono: "LK", color: "#8a8a90" },
  { name: "Lights", group: "Accessories", mono: "LT", color: "#1E7FC4" },
  { name: "Bags & Racks", group: "Accessories", mono: "BG", color: "#5C4FE0" },

  /* — Service — */
  { name: "Tune-Ups", group: "Service", mono: "TU", color: "#141414" },
  { name: "Repairs", group: "Service", mono: "RP", color: "#3c3c42" },
  { name: "Custom Builds", group: "Service", mono: "CB", color: "#4CAF2E" },

  /* — Kids — */
  { name: "Kids' Cycles", group: "Kids", mono: "KD", color: "#D6431C" },
];
