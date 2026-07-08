import { business, whatsAppLink } from "@/data/business";
import { TrackedLink } from "@/components/TrackedLink";

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-surface px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        <div>
          <p className="flex items-baseline gap-2 font-display text-lg font-bold">
            <span lang="ur" dir="rtl" className="urdu-lockup text-chai">
              {business.nameUrdu}
            </span>
            {business.name}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-steel">
            {business.address.street}, {business.address.area},{" "}
            {business.address.city}
          </p>
        </div>

        <div className="text-sm">
          <h2 className="mb-2 font-semibold text-cream">Contact</h2>
          <p>
            <TrackedLink
              event="call_click"
              eventData={{ source: "footer" }}
              href={`tel:${business.phone}`}
              className="text-steel underline-offset-4 hover:text-cream hover:underline"
            >
              {business.phoneDisplay}
            </TrackedLink>
          </p>
          <p className="mt-1">
            <TrackedLink
              event="whatsapp_click"
              eventData={{ source: "footer" }}
              href={whatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-steel underline-offset-4 hover:text-cream hover:underline"
            >
              WhatsApp orders
            </TrackedLink>
          </p>
        </div>

        <div className="text-sm">
          <h2 className="mb-2 font-semibold text-cream">Hours</h2>
          <p className="text-steel">Open 24 hours, every day</p>
          <p className="mt-1 text-steel">Saturday: 5:00 PM – 12:00 AM</p>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl border-t border-cream/10 pt-6 text-center text-xs text-steel">
        © {new Date().getFullYear()} {business.name} · Yaseenabad,{" "}
        {business.address.city} · Chai since it was 25 rupees.
      </p>
    </footer>
  );
}
