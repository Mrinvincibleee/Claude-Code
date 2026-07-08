/**
 * PLACEHOLDER GALLERY — TODO(client): replace these generated placeholder
 * images in /public/gallery with the cafe's real photos (interior, chai
 * pour, parathas, night exterior). Keep the same filenames to avoid code
 * changes, or update the paths here.
 */

export interface GalleryImage {
  src: string;
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  { src: "/gallery/chai-pour.jpg", alt: "Doodh patti being poured from a steel kettle into a glass" },
  { src: "/gallery/night-exterior.jpg", alt: "The cafe's lit storefront on the street at night" },
  { src: "/gallery/paratha-tawa.jpg", alt: "Parathas crisping on a hot tawa" },
  { src: "/gallery/chai-table.jpg", alt: "Glasses of karak chai on a table with friends around it" },
  { src: "/gallery/kettle-flame.jpg", alt: "A blackened kettle over a blue gas flame" },
  { src: "/gallery/interior-seating.jpg", alt: "Warmly lit seating inside the cafe" },
  { src: "/gallery/kashmiri-chai.jpg", alt: "Pink Kashmiri chai topped with crushed pistachio" },
  { src: "/gallery/late-night-crowd.jpg", alt: "Customers having chai outside the shop after midnight" },
];
