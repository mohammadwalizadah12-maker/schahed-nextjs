/**
 * Browser-Regression: Beitragsverwaltung bleibt innerhalb des Viewports.
 * Node >= 22, lokal installiertes Chrome; keine Zusatzpakete.
 * Gegen einen lokalen Produktionsserver mit Test-Login ausfuehren:
 * BASE_URL=http://localhost:3117 ADMIN_TEST_PASSWORD=... node scripts/pruefe-admin-mobil.mjs <belegordner>
 * Es wird nichts veroeffentlicht: Speichern wird nur mit absichtlich
 * unvollstaendigen Testdaten ausgeloest (clientseitiger Fehler).
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const base = new URL(process.env.BASE_URL || 'http://localhost:3117');
assert(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Nur lokale Tests, keine Live-Redaktion.');
assert(process.env.ADMIN_TEST_PASSWORD, 'ADMIN_TEST_PASSWORD fehlt.');
const out = resolve(process.argv[2] || 'admin-mobil-belege');
mkdirSync(out, { recursive: true });
const login = await fetch(new URL('/api/auth/login', base), {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base.origin },
  body: JSON.stringify({ password: process.env.ADMIN_TEST_PASSWORD }),
});
assert.equal(login.status, 200, 'Test-Login fehlgeschlagen');
const cookie = login.headers.get('set-cookie')?.match(/schahed_admin=([^;]+)/)?.[1];
assert(cookie, 'Login-Cookie fehlt.');
const profile = mkdtempSync(join(tmpdir(), 'schahed-mobile-'));
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const child = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', '--no-first-run',
  `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let ws;
const report = [];
let sequence = 0;
try {
  const endpoint = await new Promise((res, rej) => {
    let stderr = '';
    const timer = setTimeout(() => rej(new Error('Chrome-Start abgebrochen (Zeitlimit).')), 20000);
    child.once('error', rej);
    child.stderr.on('data', chunk => {
      stderr += chunk.toString();
      const found = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (found) { clearTimeout(timer); res(found[1]); }
    });
  });
  ws = new WebSocket(endpoint);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const pending = new Map();
  const listeners = new Map();
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id) {
      const p = pending.get(msg.id);
      if (!p) return;
      clearTimeout(p.timer); pending.delete(msg.id);
      msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result);
    } else {
      for (const fn of listeners.get(msg.method) || []) fn(msg.params);
    }
  };
  function send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 20000);
      pending.set(id, { resolve, reject, timer });
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
  function once(method) {
    return new Promise((res, rej) => {
      const timer = setTimeout(() => rej(new Error(`Event timeout: ${method}`)), 20000);
      const fn = params => { clearTimeout(timer); listeners.get(method).delete(fn); res(params); };
      if (!listeners.has(method)) listeners.set(method, new Set());
      listeners.get(method).add(fn);
    });
  }
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const page = (method, params = {}) => send(method, params, sessionId);
  async function evaluate(expression) {
    const r = await page('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + r.exceptionDetails.exception?.description);
    return r.result?.value;
  }
  await page('Page.enable');
  await page('Network.enable');
  // Testdaten duerfen selbst bei einer Validierungsregression nie gespeichert werden.
  await page('Network.setBlockedURLs', { urls: [base.origin + '/api/admin/*'] });
  await page('Network.setCookie', { name: 'schahed_admin', value: cookie, url: base.origin, httpOnly: true, sameSite: 'Strict' });
  await page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await page('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const loaded = once('Page.loadEventFired');
  await page('Page.navigate', { url: new URL('/admin', base).href });
  await loaded;
  assert.equal(await evaluate('location.pathname'), '/admin');
  await evaluate(`new Promise(resolve => {
    const ready = () => [...document.querySelectorAll('button')].some(b => Object.keys(b).some(k => k.startsWith('__reactProps$')));
    if (ready()) return resolve(true);
    const observer = new MutationObserver(() => { if (ready()) { observer.disconnect(); resolve(true); } });
    observer.observe(document, { subtree:true, childList:true, attributes:true });
  })`);
  const settle = () => evaluate('document.fonts.ready.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(true)))))');
  await settle();
  const click = async text => {
    await evaluate(`(() => {
      const button = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)});
      if (!button) throw new Error('Button fehlt: ' + ${JSON.stringify(text)});
      button.click();
    })()`);
    await settle();
  };
  async function measure(state, width) {
    const result = await evaluate(`(() => {
      const width = document.documentElement.clientWidth;
      const visible = e => {
        const s = getComputedStyle(e), r = e.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 1 && r.height > 1;
      };
      const bad = [...document.querySelectorAll('body *')].filter(e => {
        if (e.closest('nav, svg') || ['OPTION','SCRIPT','STYLE'].includes(e.tagName) || !visible(e)) return false;
        const r = e.getBoundingClientRect();
        return r.left < -1 || r.right > width + 1;
      }).map(e => ({ tag: e.tagName, cls: String(e.className).slice(0,110),
        text: (e.innerText || '').slice(0,65), left: Math.round(e.getBoundingClientRect().left),
        right: Math.round(e.getBoundingClientRect().right) }));
      const nav = document.querySelector('nav');
      const rect = nav.getBoundingClientRect();
      return { width, scrollWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth,
        navWithinPage: rect.left >= -1 && rect.right <= width + 1, offenders: bad.slice(0,15), count: bad.length };
    })()`);
    const pass = result.width === width && result.scrollWidth <= width && result.bodyWidth <= width && result.navWithinPage && result.count === 0;
    report.push({ state, requestedWidth: width, pass, ...result });
    console.log(`${pass ? 'PASS' : 'FAIL'} ${width}px ${state}: body=${result.bodyWidth}, offenders=${result.count}`);
  }
  const widths = [320, 360, 375, 390, 414, 430, 640, 768, 1024, 1280, 1440];
  async function matrix(state, shot = false) {
    for (const width of widths) {
      await page('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 700 });
      await settle();
      await measure(state, width);
      if (shot && (width === 390 || width === 1280)) {
        await evaluate('window.scrollTo({top:0, behavior:"instant"})');
        const { data } = await page('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
        writeFileSync(join(out, `${state}-${width}.png`), Buffer.from(data, 'base64'));
      }
    }
  }
  const count = await evaluate('document.querySelectorAll("aside input ~ div > button").length');
  assert(count > 0, 'Keine Beitraege gefunden: Test darf nicht leer durchlaufen.');
  for (let i = 0; i < count; i++) {
    await evaluate(`document.querySelectorAll('aside input ~ div > button')[${i}].click()`);
    await settle();
    await matrix(`beitrag-${i + 1}`, i === 0);
  }
  await click('+ Neuer Beitrag');
  await matrix('neuer-beitrag');
  await evaluate(`(() => {
    const set = (e, value) => {
      const proto = e.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, value);
      e.dispatchEvent(new Event('input', { bubbles: true }));
    };
    const de = document.querySelector('section [dir=ltr].space-y-4');
    set(de.querySelector('input'), 'SehrLangerTitelOhneTrennzeichen'.repeat(10));
    const boxes = de.querySelectorAll('textarea');
    set(boxes[0], 'VorschautextOhneLeerzeichen'.repeat(24));
    set(boxes[1], 'https://schahed.com/' + 'langerpfad'.repeat(30));
    set(de.querySelectorAll('input')[1], 'LangesSchlagwortOhneLeerzeichen'.repeat(2));
    // FA-Titel bleibt leer, damit Speichern nur die Client-Validierung prueft.
    const fa = document.querySelector('section [dir=rtl].space-y-4');
    set(fa.querySelector('textarea'), 'متنطولانی'.repeat(60));
  })()`);
  await settle();
  await matrix('lange-texte');
  await click('Vorschau');
  await matrix('vorschau', true);
  await click('Bearbeiten');
  await evaluate(`(() => {
    const select = [...document.querySelectorAll('select')].find(s => [...s.options].some(o => o.text === 'Kein Bild'));
    const input = select.parentElement.parentElement.querySelector('input');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '/images/' + 'langes-bild'.repeat(40) + '.jpg');
    input.dispatchEvent(new Event('input', { bubbles:true }));
  })()`);
  await settle();
  await matrix('langer-bildpfad');
  await click('Speichern & veröffentlichen');
  assert((await evaluate('document.querySelector("[role=status]").textContent')).includes('Titel (FA) fehlt'));
  await matrix('fehlermeldung', true);
  await click('Beitrag löschen');
  await matrix('loeschbestaetigung');
  await click('Abbrechen');
  await click('Verwerfen');
  await matrix('verworfen');
  assert.equal(await evaluate('!!document.querySelector("[role=status]")'), false);
  writeFileSync(join(out, 'ergebnis.json'), JSON.stringify(report, null, 2) + '\n');
  const failed = report.filter(r => !r.pass);
  console.log(`${report.length} Layout-Pruefungen, ${failed.length} fehlgeschlagen.`);
  await send('Browser.close');
  if (failed.length) process.exitCode = 1;
} finally {
  ws?.close();
  if (child.exitCode === null) {
    const closed = new Promise(res => child.once('exit', res));
    child.kill(); await closed;
  }
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
