"use client";

import { useEffect, useState } from "react";
import {
  categoryLabels,
  categoryOrder,
  menu,
  type MenuCategory,
} from "@/data/menu";
import { MenuItemCard } from "@/components/MenuItemCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ChevronIcon } from "@/components/icons";

const allCategories = new Set<MenuCategory>(categoryOrder);

/**
 * Desktop: all categories visible in a two-column layout.
 * Mobile: categories collapse into an accordion (first category open).
 * The server renders everything expanded, so content is always present
 * for search engines and no-JS visitors; mobile collapses after mount.
 */
export function MenuSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [openCategories, setOpenCategories] =
    useState<Set<MenuCategory>>(allCategories);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      setIsMobile(mq.matches);
      setOpenCategories(
        mq.matches ? new Set<MenuCategory>(["chai"]) : allCategories
      );
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const toggle = (category: MenuCategory) => {
    setOpenCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <section id="menu" className="scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            urduAccent="مینیو"
            title="The Menu"
            subtitle="Brewed and fried to order, all night long. Tap any item to order it on WhatsApp."
          />
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {categoryOrder.map((category) => {
              const isOpen = openCategories.has(category);
              const items = menu.filter((item) => item.category === category);
              const panelId = `menu-panel-${category}`;
              return (
                <div
                  key={category}
                  className="rounded-2xl border border-cream/10 p-4 sm:p-5"
                >
                  {isMobile ? (
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggle(category)}
                        className="flex w-full items-center justify-between gap-2 font-display text-xl font-bold text-cream"
                      >
                        {categoryLabels[category]}
                        <ChevronIcon
                          className={`h-5 w-5 text-chai transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>
                  ) : (
                    <h3 className="font-display text-xl font-bold text-cream">
                      {categoryLabels[category]}
                    </h3>
                  )}
                  <ul
                    id={panelId}
                    className={`mt-4 flex-col gap-3 ${isOpen ? "flex" : "hidden"}`}
                  >
                    {items.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-steel">
            Prices in Pakistani rupees. Menu and prices being confirmed with
            the cafe — call to double-check before a big order.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
