import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Noto_Nastaliq_Urdu,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { business } from "@/data/business";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

// Heavy family — only the arabic subset is loaded, and it is used solely
// for the brand lockup and small section flourishes.
const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  display: "swap",
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
        className={`${bricolage.variable} ${instrument.variable} ${nastaliq.variable}`}
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
