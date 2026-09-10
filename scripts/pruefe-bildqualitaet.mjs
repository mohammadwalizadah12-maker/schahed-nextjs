/**
 * Baupruefung: jedes quality={n} an <Image> muss in next.config.ts unter
 * images.qualities stehen.
 *
 * Anlass: quality={80} bei freigegebenen [75, 90, 100]. Der Bildoptimierer
 * antwortet dann mit HTTP 400, das Bild bleibt unsichtbar — der Build war
 * gruen, die Seite trotzdem kaputt. Genau das faellt hier auf.
 *
 * Exit-Code 1 bei einem Treffer, damit der Build abbricht.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const cfg = readFileSync("next.config.ts", "utf8");
const m = cfg.match(/qualities:\s*\[([^\]]*)\]/);
if (!m) {
  console.error("pruefe-bildqualitaet: images.qualities nicht in next.config.ts gefunden.");
  process.exit(1);
}
const allowed = m[1].split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts|jsx|js)$/.test(e)) files.push(p);
  }
})("src");

let bad = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const lines = src.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const hit of line.matchAll(/quality=\{?\s*(\d+)\s*\}?/g)) {
      const q = Number(hit[1]);
      if (!allowed.includes(q)) {
        console.error(`${f}:${i + 1}  quality={${q}} ist nicht freigegeben (erlaubt: ${allowed.join(", ")})`);
        bad++;
      }
    }
  });
}

if (bad > 0) {
  console.error(`\npruefe-bildqualitaet: ${bad} unzulaessige${bad === 1 ? "r" : ""} Wert${bad === 1 ? "" : "e"}.`);
  console.error("Entweder den Wert auf einen freigegebenen aendern oder images.qualities in next.config.ts erweitern.");
  process.exit(1);
}
console.log(`pruefe-bildqualitaet: in Ordnung (${files.length} Dateien, erlaubt: ${allowed.join(", ")}).`);
