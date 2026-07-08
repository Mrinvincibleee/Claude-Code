"use client";

import { whatsAppOrderLink } from "@/data/business";
import { formatPKR, type MenuItem } from "@/data/menu";
import { TrackedLink } from "@/components/TrackedLink";

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-xl bg-surface p-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h4 className="font-semibold text-cream">{item.name}</h4>
          {item.nameUrdu ? (
            <span lang="ur" dir="rtl" className="text-sm text-steel">
              {item.nameUrdu}
            </span>
          ) : null}
          {item.popular ? (
            <span className="rounded-full bg-chai/15 px-2 py-0.5 text-xs font-semibold text-chai">
              Most loved
            </span>
          ) : null}
        </div>
        {item.description ? (
          <p className="mt-1 text-sm text-steel">{item.description}</p>
        ) : null}
        <TrackedLink
          event="whatsapp_click"
          eventData={{ source: "menu", item: item.id }}
          href={whatsAppOrderLink(item.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-chai underline-offset-4 hover:underline"
          aria-label={`Order ${item.name} on WhatsApp`}
        >
          Order
        </TrackedLink>
      </div>
      <p className="shrink-0 font-semibold tabular-nums text-chai">
        {formatPKR(item.pricePKR)}
      </p>
    </li>
  );
}
