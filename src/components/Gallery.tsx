import Image from "next/image";
import { galleryImages } from "@/data/gallery";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

export function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            urduAccent="جھلکیاں"
            title="From the Stall"
            subtitle="Late nights, hot kettles and the street outside."
          />
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {galleryImages.map((image) => (
              <li
                key={image.src}
                className="warm-photo relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
