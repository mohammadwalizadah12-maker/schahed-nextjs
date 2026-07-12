import { t as translate, type Locale } from "@/lib/i18n";
import { IconShield, IconHandHeart, IconUsers } from "@/components/Icons";

export default function MissionSection({ locale }: { locale: Locale }) {
  const tr = (k: string) => translate(locale, k);

  const values = [
    { Icon: IconShield, title: "mission.value1.title", text: "mission.value1.text" },
    { Icon: IconHandHeart, title: "mission.value2.title", text: "mission.value2.text" },
    { Icon: IconUsers, title: "mission.value3.title", text: "mission.value3.text" },
  ];

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20">
      <div className="mx-auto max-w-2xl text-center" data-reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-500">
          {tr("mission.eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-brand-900 sm:text-4xl">
          {tr("mission.title")}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-brand-700/80">
          {tr("mission.text")}
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3" data-reveal-stagger>
        {values.map(({ Icon, title, text }) => (
          <div
            key={title}
            className="lift rounded-2xl border border-sand-200 bg-white p-7 shadow-sm hover:border-brand-200 hover:shadow-md"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-brand-900">{tr(title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-700/75">{tr(text)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
