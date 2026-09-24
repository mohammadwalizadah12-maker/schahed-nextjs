import { isLocale, t as translate, type Locale } from "@/lib/i18n";
import PageHero from "@/components/PageHero";
import FeedbackForm from "@/components/FeedbackForm";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  return pageMetadata(isLocale(raw) ? raw : "de", "feedback");
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";
  const tr = (k: string) => translate(locale, k);

  return (
    <>
      <PageHero eyebrow={tr("feedback.eyebrow")} title={tr("feedback.title")} subtitle={tr("feedback.subtitle")} />

      <section className="mx-auto max-w-2xl px-5 py-16">
        <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
          <FeedbackForm />
        </div>
      </section>
    </>
  );
}
