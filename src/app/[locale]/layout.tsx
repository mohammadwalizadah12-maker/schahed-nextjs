import type { Metadata, Viewport } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import { notFound } from "next/navigation";
import {
  LOCALES,
  isLocale,
  dirOf,
  getDict,
  t as translate,
  type Locale,
} from "@/lib/i18n";
import { I18nProvider } from "@/components/I18nProvider";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import RevealObserver from "@/components/RevealObserver";
import { SITE_URL, SITE_NAME, SITE_NAME_FULL } from "@/lib/site-config";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Persische UI-Schrift (Farsi/Dari) — nur fuer FA relevant, daher nicht preloaden.
const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir",
  preload: false,
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "de";

  const title = translate(locale, "hero.title");
  const description = translate(locale, "hero.subtitle");

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME_FULL}`,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        de: `${SITE_URL}/de`,
        fa: `${SITE_URL}/fa`,
        "x-default": `${SITE_URL}/de`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_AF" : "de_DE",
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME_FULL,
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    category: "nonprofit",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#7d3818",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dir = dirOf(locale);
  const messages = getDict(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${vazir.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col antialiased">
        <I18nProvider locale={locale} messages={messages}>
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <RevealObserver />
        </I18nProvider>
      </body>
    </html>
  );
}
