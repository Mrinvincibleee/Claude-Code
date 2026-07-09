interface SectionHeadingProps {
  urduAccent?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({
  urduAccent,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 text-center">
      {urduAccent ? (
        <p
          lang="ur"
          dir="rtl"
          aria-hidden="true"
          className="text-lg text-chai/80"
        >
          {urduAccent}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-bold tracking-tight text-cream sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-lg text-balance text-steel">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
