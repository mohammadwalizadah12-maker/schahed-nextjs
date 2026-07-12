export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-800 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-accent-400/15 blur-3xl" />
      <div className="relative mx-auto max-w-[1180px] px-5 py-16 sm:py-20">
        {eyebrow && (
          <p className="reveal text-sm font-semibold uppercase tracking-widest text-accent-200">
            {eyebrow}
          </p>
        )}
        <h1 className="reveal mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl" style={{ animationDelay: "60ms" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="reveal mt-4 max-w-2xl text-lg text-sand-100/85" style={{ animationDelay: "120ms" }}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
