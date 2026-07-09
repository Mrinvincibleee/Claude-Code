import {
  business,
  directionsUrl,
  mapEmbedUrl,
} from "@/data/business";
import { HoursTable } from "@/components/HoursTable";
import { OpenNowBadge } from "@/components/OpenNowBadge";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TrackedLink } from "@/components/TrackedLink";
import { DirectionsIcon, PhoneIcon } from "@/components/icons";

export function VisitSection() {
  return (
    <section id="visit" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            urduAccent="آئیے"
            title="Find Us"
            subtitle="On the main Yaseenabad stretch, Federal B Area. The kettle's already on."
          />

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <address className="not-italic leading-relaxed text-cream/90">
                {business.address.street}
                <br />
                {business.address.area}
                <br />
                {business.address.city}, {business.address.country}
              </address>

              <p className="mt-4">
                <TrackedLink
                  event="call_click"
                  eventData={{ source: "visit" }}
                  href={`tel:${business.phone}`}
                  className="inline-flex items-center gap-2 font-semibold text-chai underline-offset-4 hover:underline"
                >
                  <PhoneIcon className="h-4 w-4" />
                  {business.phoneDisplay}
                </TrackedLink>
              </p>

              <div className="mt-4">
                <OpenNowBadge />
              </div>

              <div className="mt-6 max-w-sm rounded-2xl border border-cream/10 p-5">
                <h3 className="mb-2 font-display text-lg font-bold">Hours</h3>
                <HoursTable />
              </div>

              <TrackedLink
                event="directions_click"
                eventData={{ source: "visit" }}
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-12 items-center gap-2.5 rounded-full bg-chai px-6 font-semibold text-bg transition-opacity hover:opacity-90"
              >
                <DirectionsIcon className="h-5 w-5" />
                Get Directions
              </TrackedLink>
            </div>

            <div className="overflow-hidden rounded-2xl border border-cream/10">
              <iframe
                src={mapEmbedUrl}
                title={`Map showing ${business.name} at ${business.address.street}, ${business.address.area}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-80 w-full lg:h-full lg:min-h-96"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
