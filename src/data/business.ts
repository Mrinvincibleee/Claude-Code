/**
 * Single source of truth for every business fact on the site.
 * Components must import from here — never hardcode the phone number,
 * address, or hours anywhere else.
 */

export const business = {
  name: "Chaye 25 Hai",
  nameUrdu: "چائے ۲۵ ہے",
  tagline: "Karachi's 24-hour chai stop.",
  address: {
    street: "Shop # 9, Shamim Skyline",
    area: "Federal B Area Yaseenabad",
    city: "Karachi",
    country: "Pakistan",
  },
  geo: {
    latitude: 24.9185626,
    longitude: 67.0730138,
  },
  /** E.164, digits only after +. Used for both tel: and wa.me links. */
  phone: "+923021022799",
  phoneDisplay: "+92 302 1022799",
  whatsAppNumber: "923021022799",
  rating: {
    value: 4.7,
    count: 11,
    /** TODO(client): swap for the canonical share link of the Google listing. */
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Chaye+25+Hai+Shamim+Skyline+Federal+B+Area+Karachi",
  },
  timezone: "Asia/Karachi",
  /**
   * TODO(client): replace with the purchased domain (chaye25hai.com / .pk).
   * Used for canonical URL, sitemap and Open Graph.
   */
  siteUrl: "https://chaye25hai.com",
} as const;

export const whatsAppDefaultMessage =
  "Assalam o Alaikum! I'd like to place an order from the website.";

export function whatsAppLink(message: string = whatsAppDefaultMessage): string {
  return `https://wa.me/${business.whatsAppNumber}?text=${encodeURIComponent(message)}`;
}

export function whatsAppOrderLink(itemName: string): string {
  return whatsAppLink(`Assalam o Alaikum! I'd like to order: ${itemName} x1`);
}

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${business.geo.latitude},${business.geo.longitude}`;

export const mapEmbedUrl = `https://maps.google.com/maps?q=${business.geo.latitude},${business.geo.longitude}&z=17&output=embed`;

/**
 * Weekly opening hours. Day index follows JS Date#getDay: 0 = Sunday.
 * `null` means open the full 24 hours of that day.
 *
 * TODO(client): confirm Saturday hours — the Google listing shows
 * 5:00 PM – 12:00 AM on Saturday vs 24h every other day, which may be
 * a listing error.
 */
export interface DayHours {
  /** Minutes after midnight, inclusive. */
  open: number;
  /** Minutes after midnight, exclusive. 1440 = midnight at end of day. */
  close: number;
}

export type WeeklyHours = readonly (DayHours | null)[];

export const weeklyHours: WeeklyHours = [
  null, // Sunday — open 24 hours
  null, // Monday — open 24 hours
  null, // Tuesday — open 24 hours
  null, // Wednesday — open 24 hours
  null, // Thursday — open 24 hours
  null, // Friday — open 24 hours
  { open: 17 * 60, close: 24 * 60 }, // Saturday — 5:00 PM to 12:00 AM
];

export const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
