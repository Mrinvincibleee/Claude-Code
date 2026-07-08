import { business } from "@/data/business";
import { reviewQuotes } from "@/data/reviews";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { StarIcon } from "@/components/icons";

export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 bg-surface px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading urduAccent="آراء" title="What the Street Says" />

          <p className="mb-10 flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="font-display text-4xl font-bold tabular-nums text-chai">
              {business.rating.value}
            </span>
            <StarIcon className="h-7 w-7 text-chai" />
            <a
              href={business.rating.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-steel underline-offset-4 hover:text-cream hover:underline"
            >
              {business.rating.count} reviews on Google
            </a>
          </p>

          <ul className="grid gap-4 sm:grid-cols-3">
            {reviewQuotes.map((review) => (
              <li key={review.id}>
                <figure className="flex h-full flex-col justify-between rounded-2xl border border-cream/10 bg-bg p-5">
                  <blockquote className="text-cream/90">
                    “{review.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-steel">
                    — {review.attribution}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
