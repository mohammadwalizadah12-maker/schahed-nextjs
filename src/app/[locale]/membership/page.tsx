import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import PageHero from "@/components/PageHero";
import MembershipForm from "@/components/MembershipForm";
import { IconArrow } from "@/components/Icons";

export default async function MembershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);

  const benefits = ["membership.benefit1", "membership.benefit2", "membership.benefit3"];

  return (
    <>
      <PageHero eyebrow={tr("membership.eyebrow")} title={tr("membership.title")} subtitle={tr("membership.subtitle")} />

      <section className="mx-auto max-w-[1180px] px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-brand-800">
                  <IconArrow className="mt-1 h-4 w-4 text-accent-500" />
                  <span>{tr(b)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
            <MembershipForm />
          </div>
        </div>
      </section>
    </>
  );
}
