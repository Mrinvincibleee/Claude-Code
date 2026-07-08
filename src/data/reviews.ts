/**
 * PLACEHOLDER REVIEW QUOTES — TODO(client): replace with real (permission-
 * granted) quotes from the Google listing before launch. These are short
 * paraphrases of the review themes; no reviewer names are fabricated.
 */

export interface ReviewQuote {
  id: string;
  quote: string;
  /** Context line shown under the quote, never a fabricated name. */
  attribution: string;
}

export const reviewQuotes: ReviewQuote[] = [
  {
    id: "best-in-area",
    quote: "Best chai in the area — the doodh patti is worth the trip alone.",
    attribution: "Google review",
  },
  {
    id: "open-late",
    quote: "Open when nothing else is. 2 AM chai and hot parathas.",
    attribution: "Google review",
  },
  {
    id: "price",
    quote: "Honest prices, fast service, and they remember your order.",
    attribution: "Google review",
  },
];
