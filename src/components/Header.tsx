import { business, whatsAppLink } from "@/data/business";
import { TrackedLink } from "@/components/TrackedLink";
import { WhatsAppIcon } from "@/components/icons";

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#story", label: "Story" },
  { href: "#visit", label: "Visit" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/10 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#hero"
          className="flex items-baseline gap-2.5 font-display text-lg font-bold tracking-tight"
        >
          <span lang="ur" dir="rtl" className="text-xl leading-none text-chai">
            {business.nameUrdu}
          </span>
          <span className="hidden sm:inline">{business.name}</span>
        </a>

        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-2.5 py-2 text-sm text-cream/80 transition-colors hover:text-cream sm:px-3"
            >
              {link.label}
            </a>
          ))}
          <TrackedLink
            event="whatsapp_click"
            eventData={{ source: "header" }}
            href={whatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex h-9 items-center gap-2 rounded-full bg-chai px-3 text-sm font-semibold text-bg transition-opacity hover:opacity-90 sm:px-4"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Order on WhatsApp</span>
            <span className="sm:hidden">Order</span>
          </TrackedLink>
        </nav>
      </div>
    </header>
  );
}
