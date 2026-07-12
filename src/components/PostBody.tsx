/**
 * Rendert den Body eines Beitrags aus der schlichten Zeilen-Konvention:
 *   "## ..." -> Zwischenueberschrift
 *   "- ..."  -> Aufzaehlungspunkt (aufeinanderfolgende werden gruppiert)
 *   "> ..."  -> Zitat
 *   sonst   -> Absatz
 */
export default function PostBody({ lines }: { lines: string[] }) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={key} className="my-4 space-y-2 ps-5">
        {list.map((li, i) => (
          <li key={i} className="list-disc leading-relaxed text-brand-800/85 marker:text-accent-400">
            {li}
          </li>
        ))}
      </ul>
    );
    list = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }
    flushList(`ul-${i}`);
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={i} className="mt-8 text-xl font-bold text-brand-900">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("> ")) {
      blocks.push(
        <blockquote
          key={i}
          className="my-6 border-s-4 border-accent-400 bg-sand-100 px-5 py-4 text-lg font-medium italic text-brand-700"
        >
          {line.slice(2)}
        </blockquote>
      );
    } else {
      blocks.push(
        <p key={i} className="mt-4 leading-relaxed text-brand-800/85">
          {line}
        </p>
      );
    }
  });
  flushList("ul-final");

  return <div>{blocks}</div>;
}
