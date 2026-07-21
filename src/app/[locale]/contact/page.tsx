import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import { CONTACT } from "@/lib/site-config";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);
  const hours = locale === "fa" ? CONTACT.hoursFa : CONTACT.hours;

  return (
    <>
      <PageHero eyebrow={tr("contact.eyebrow")} title={tr("contact.title")} subtitle={tr("contact.subtitle")} />

      <section className="mx-auto max-w-[1180px] px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            {CONTACT.street && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-500">{tr("contact.address")}</h3>
                <p className="mt-2 text-brand-800">{CONTACT.street}<br />{CONTACT.zip} {CONTACT.city}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-500">{tr("contact.hours")}</h3>
              <p className="mt-2 text-brand-800">{hours}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-500">{tr("contact.phone")}</h3>
              <a href={`tel:${CONTACT.phone}`} className="mt-2 inline-block text-brand-800 hover:text-brand-600" dir="ltr">{CONTACT.phoneDisplay}</a>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-accent-500">{tr("contact.email")}</h3>
              <a href={`mailto:${CONTACT.email}`} className="mt-2 block text-brand-800 hover:text-brand-600">{CONTACT.email}</a>
            </div>
          </div>
          <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
