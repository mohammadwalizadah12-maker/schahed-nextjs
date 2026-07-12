import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import { DONATE } from "@/lib/site-config";
import PageHero from "@/components/PageHero";
import CopyField from "@/components/CopyField";
import { IconHeart } from "@/components/Icons";

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);

  return (
    <>
      <PageHero eyebrow={tr("donate.eyebrow")} title={tr("donate.title")} subtitle={tr("donate.subtitle")} />

      <section className="mx-auto max-w-[1180px] px-5 py-16">
        <div className={`grid gap-8 ${DONATE.paypalUrl ? "lg:grid-cols-2" : "max-w-2xl mx-auto"}`}>
          {/* PayPal — nur wenn konfiguriert */}
          {DONATE.paypalUrl && (
            <div className="flex flex-col rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <IconHeart />
              </span>
              <h2 className="mt-5 text-xl font-bold text-brand-900">{tr("donate.paypal")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-700/75">{tr("donate.subtitle")}</p>
              <a
                href={DONATE.paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-accent-400 px-6 py-3.5 font-semibold text-brand-900 transition hover:bg-accent-300"
              >
                {tr("donate.paypal")}
              </a>
            </div>
          )}

          {/* Ueberweisung — echte Haspa-Bankdaten */}
          <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-brand-900">{tr("donate.bankTitle")}</h2>
            <div className="mt-5">
              <CopyField label={tr("donate.accountHolder")} value={DONATE.bank.accountHolder} copyLabel={tr("common.copy")} copiedLabel={tr("common.copied")} />
              <CopyField label={tr("donate.bank")} value={DONATE.bank.bankName} copyLabel={tr("common.copy")} copiedLabel={tr("common.copied")} />
              <CopyField label={tr("donate.iban")} value={DONATE.bank.iban} copyLabel={tr("common.copy")} copiedLabel={tr("common.copied")} />
              <CopyField label={tr("donate.bic")} value={DONATE.bank.bic} copyLabel={tr("common.copy")} copiedLabel={tr("common.copied")} />
            </div>
            <p className="mt-4 rounded-xl bg-sand-100 px-4 py-3 text-sm text-brand-700">
              <strong>{tr("donate.reference")}:</strong> {tr("donate.referenceHint")}
            </p>
            {DONATE.taxDeductible && (
              <p className="mt-3 text-sm text-brand-600">{tr("donate.taxNote")}</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
