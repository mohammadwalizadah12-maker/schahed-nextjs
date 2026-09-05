import { chromium } from 'playwright';

/**
 * LAYOUT-PRUEFUNG — Dekor auf Schrift
 *
 * Sucht Dekor-Elemente (absolut positioniert, eigener Hintergrund, kein
 * eigener Text), die auf Textzeilen anderer Elemente liegen. Anlass war der
 * Unterstrich unter dem Akzentwort im Hero: ein 3 px hoher Balken, der aus
 * dem Textfluss ausbrach und bei umbrechendem Titel auf der naechsten Zeile
 * landete — auf dem Handy und im Farsi mit seinen tiefen Unterlaengen.
 *
 * Verwendung (lokal, Server muss laufen):
 *   npm run build && npx next start -p 3000
 *   npx playwright install chromium      # einmalig
 *   node scripts/layout-check.mjs
 *
 * Bewusst NICHT in package.json als devDependency: Playwright wuerde sonst
 * bei jedem Vercel-Build mitinstalliert und Browser nachladen.
 *
 * Exit-Code 1, wenn etwas gefunden wird — so laesst es sich in eine CI haengen.
 */
const CHECK = () => {
  const rects = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || ['SCRIPT', 'STYLE'].includes(el.tagName)) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none' || +st.opacity < 0.1) continue;
    const r = document.createRange();
    r.selectNodeContents(n);
    for (const box of r.getClientRects()) {
      if (box.width > 2 && box.height > 2) rects.push({ el, box });
    }
  }

  const hits = [];
  for (const el of document.querySelectorAll('body *')) {
    const st = getComputedStyle(el);
    if (st.position !== 'absolute' && st.position !== 'fixed') continue;
    if (el.textContent.trim()) continue;                 // traegt selbst Text -> kein reines Dekor
    const hasPaint = st.backgroundColor !== 'rgba(0, 0, 0, 0)' || st.backgroundImage !== 'none'
      || el.tagName === 'SVG' || el.tagName === 'svg';
    if (!hasPaint) continue;
    if (/blur/.test(st.filter || '')) continue;          // weiche Farbschleier liegen hinter dem Text
    if (+st.opacity < 0.5) continue;
    const b = el.getBoundingClientRect();
    if (b.width < 2 || b.height < 2) continue;
    // Ganzflaechige Overlays (Scrims) sind Absicht, keine Kollision
    if (b.width >= window.innerWidth * 0.9 && b.height >= window.innerHeight * 0.6) continue;

    for (const { el: tel, box } of rects) {
      if (el.contains(tel)) continue;                    // Text liegt IM Dekor-Container
      // Nur was NACH dem Text gemalt wird, kann ihn verdecken
      const after = tel.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING;
      if (!after) continue;
      // Grossflaechige Verlaeufe sind Hintergrund, kein Dekor auf der Schrift
      if (b.width * b.height > box.width * box.height * 6) continue;
      const ox = Math.min(b.right, box.right) - Math.max(b.left, box.left);
      const oy = Math.min(b.bottom, box.bottom) - Math.max(b.top, box.top);
      if (ox <= 0 || oy <= 0) continue;
      // Ein 3-px-Strich deckt flaechenmaessig kaum etwas ab, zerstoert die
      // Zeile aber trotzdem — deshalb zaehlt auch die absolute Ueberlappung.
      const share = (ox * oy) / (box.width * box.height);
      if (share < 0.01 && ox * oy < 60) continue;
      hits.push({
        dekor: (el.className || el.tagName).toString().slice(0, 70),
        text: tel.textContent.trim().slice(0, 40),
        anteil: Math.round(share * 100),
      });
    }
  }
  return hits;
};

const PAGES = ['/de', '/fa', '/de/about', '/fa/about', '/de/projects', '/de/news', '/de/donate', '/fa/donate'];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440];

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const b = await chromium.launch();
let total = 0;
for (const path of PAGES) {
  for (const w of WIDTHS) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(BASE + path, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    const hits = await p.evaluate(CHECK);
    const seen = new Set();
    for (const h of hits) {
      const k = h.dekor + '|' + h.text;
      if (seen.has(k)) continue;
      seen.add(k);
      console.log(`${path} @${w}px  ${h.anteil}% ueberdeckt  "${h.text}"\n    ${h.dekor}`);
      total++;
    }
    await p.close();
  }
}
await b.close();
if (total === 0) {
  console.log('\nKeine Ueberlappungen gefunden.');
} else {
  console.log(`\n${total} Ueberlappungen — bitte beheben.`);
  process.exitCode = 1;
}
