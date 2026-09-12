import type { Metadata } from "next";
import { Inter, Instrument_Serif, Caveat, Baloo_2 } from "next/font/google";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";
import { SITE_URL, SHOP } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-script",
});

/* Rounded display font — closer to the Cycle Wala logo's letterforms than
   Inter, used for the brand wordmark treatments (tunnel-intro text). */
const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-brand",
});

const DESCRIPTION = SHOP.description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SHOP.name} — ${SHOP.tagline}`,
    template: "%s",
  },
  description: DESCRIPTION,
  openGraph: {
    title: `${SHOP.name} — ${SHOP.tagline}`,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SHOP.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SHOP.name} — ${SHOP.tagline}`,
    description: DESCRIPTION,
  },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BicycleStore",
  name: SHOP.name,
  description: SHOP.description,
  email: SHOP.email,
  telephone: SHOP.phone,
  address: SHOP.address,
  openingHours: "Tu-Su 10:00-23:00",
  url: SITE_URL,
  sameAs: SHOP.sameAs,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${caveat.variable} ${baloo.variable}`}
    >
      <body>
        <LanguageProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </body>
    </html>
  );
}
