import { isLocale, type Locale } from "@/lib/i18n";
import Hero from "@/components/home/Hero";
import StatsSection from "@/components/home/StatsSection";
import HumanityAppeal from "@/components/home/HumanityAppeal";
import MissionSection from "@/components/home/MissionSection";
import ImpactSection from "@/components/home/ImpactSection";
import Gallery from "@/components/home/Gallery";
import ProjectsSection from "@/components/home/ProjectsSection";
import DonateCta from "@/components/home/DonateCta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";

  return (
    <>
      <Hero locale={locale} />
      <StatsSection locale={locale} />
      <HumanityAppeal locale={locale} />
      <MissionSection locale={locale} />
      <ImpactSection locale={locale} />
      <Gallery locale={locale} />
      <ProjectsSection locale={locale} />
      <DonateCta locale={locale} />
    </>
  );
}
