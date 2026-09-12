/* Certifications — authorized dealer status and mechanic certifications.
 *
 * ⚠ PLACEHOLDER: no real issuer, year or credential ID is known yet, so
 * every entry below has `issuer: null` / `year: null` and renders as
 * "to confirm" rather than being guessed — printing a specific brand's
 * name as an authorized dealer without confirmation would be a false claim,
 * not a design detail. Fill in real certifications before publishing.
 * No `logo` files are referenced here — omit `logo` entirely unless a real,
 * verified issuer mark is supplied. */

export type Cert = {
  no: string;
  issuer: string | null;
  logo?: { src: string; aspect: number };
  title: string;
  year: string | null;
  credentialId: string | null;
  credentialUrl?: string;
  verified: boolean;
  skills: string[];
  metric?: { value: string; label: string };
  fr?: { title?: string; skills?: string[]; metricLabel?: string };
};

export const CERTS: Cert[] = [
  {
    no: "2.1",
    issuer: null,
    title: "Certified Bicycle Mechanic",
    year: null,
    credentialId: null,
    verified: false,
    skills: ["Tune-ups & repairs", "Gear & brake adjustment", "Wheel truing"],
    metric: { value: "In-house", label: "Certified staff" },
  },
  {
    no: "2.2",
    issuer: null,
    title: "Authorized Dealer",
    year: null,
    credentialId: null,
    verified: false,
    skills: ["Genuine parts", "Warranty service", "Manufacturer support"],
    metric: { value: "TBC", label: "Brand partnership" },
  },
  {
    no: "2.3",
    issuer: null,
    title: "Electric Cycle Servicing",
    year: null,
    credentialId: null,
    verified: false,
    skills: ["Battery & motor diagnostics", "Firmware updates", "Safety checks"],
    metric: { value: "TBC", label: "Certification" },
  },
];
