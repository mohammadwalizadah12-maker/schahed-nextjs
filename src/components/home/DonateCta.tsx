import Link from "next/link";
import { t as translate, type Locale } from "@/lib/i18n";
import { DONATE_PATH } from "@/lib/nav";
import { IconArrow, IconHeart } from "@/components/Icons";

export default function DonateCta({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);
  const href = (p: string) => `/${locale}${p}`;

  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-400 to-accent-500 px-8 py-14 text-center">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-900/10 blur-2xl" />
        <div className="relative mx-auto max-w-2xl">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25 text-brand-900">
            <IconHeart className="h-7 w-7" />
          </span>
          <h2 className="mt-6 text-3xl font-extrabold text-brand-900 sm:text-4xl">
            {tr("donate.title")}
          </h2>
          <p className="mt-3 text-lg text-brand-900/80">{tr("donate.subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={href(DONATE_PATH)}
              className="inline-flex items-center gap-2 rounded-full bg-brand-800 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:bg-brand-900"
            >
              {tr("nav.donateCta")}
              <IconArrow />
            </Link>
            <Link
              href={href("/membership")}
              className="inline-flex items-center gap-2 rounded-full bg-white/70 px-8 py-3.5 font-semibold text-brand-900 transition hover:bg-white"
            >
              {tr("nav.membership")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
