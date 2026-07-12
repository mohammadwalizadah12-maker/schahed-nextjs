import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-brand-900">
        Seite nicht gefunden · صفحه یافت نشد
      </h1>
      <p className="mt-3 text-brand-700/80">
        Die gewünschte Seite existiert nicht (mehr).
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/de"
          className="rounded-full bg-brand-600 px-6 py-2.5 font-medium text-white transition hover:bg-brand-700"
        >
          Zur Startseite
        </Link>
        <Link
          href="/fa"
          className="rounded-full border border-brand-200 px-6 py-2.5 font-medium text-brand-700 transition hover:bg-brand-50"
        >
          صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
