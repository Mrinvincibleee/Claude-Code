import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { business } from "@/data/business";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

// Not preloaded: on slow 4G these would compete with the lockup font for
// bandwidth and push out LCP. They swap in with metric-adjusted fallbacks
// (no layout shift).
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Noto Nastaliq Urdu is a heavy family, so two hand-subset files are
// self-hosted (Google's css2 API with a &text= query produced them; both
// URLs are recorded in src/fonts/README.md):
//
//  - lockup subset (~20 KB, preloaded): just "چائے ۲۵ ہے" — the hero
//    lockup is the LCP element, so its font must arrive fast.
//  - full subset (~95 KB, not preloaded): every Urdu string on the site
//    (flourishes, menu names), all below the fold.
const nastaliqLockup = localFont({
  src: "../fonts/noto-nastaliq-urdu-lockup.woff2",
  variable: "--font-nastaliq-lockup",
  display: "swap",
  preload: true,
});

const nastaliq = localFont({
  src: "../fonts/noto-nastaliq-urdu-subset.woff2",
  variable: "--font-nastaliq",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: "Chaye 25 Hai — 24-Hour Chai in Federal B Area, Karachi",
  description:
    "Doodh patti, karak chai and fresh parathas — open 24 hours in Federal B Area Yaseenabad, Karachi. Order on WhatsApp or drop by Shop 9, Shamim Skyline.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Chaye 25 Hai — 24-Hour Chai in Federal B Area, Karachi",
    description:
      "Doodh patti, karak chai and fresh parathas, open 24 hours in Yaseenabad, Karachi.",
    url: "/",
    siteName: business.name,
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${instrument.variable} ${nastaliq.variable} ${nastaliqLockup.variable}`}
      >
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <JsonLd />
        <Analytics />
      </body>
    </html>
  );
}
