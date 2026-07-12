# Schahed — Hilfsorganisation (Next.js, DE/FA)

Neubau von **schahed.com** — zweisprachig **Deutsch / Dari (FA, RTL)**.
Stack: Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript.

## Setup

```bash
npm install
npm run dev      # http://localhost:3000  ->  leitet auf /de bzw. /fa um
npm run build
```

## Architektur-Entscheidung (Qualitäts-Upgrade ggü. belal-moschee)

- **Server-seitiges Locale-Routing** `/[locale]` (`/de`, `/fa`) statt rein
  client-seitigem `localStorage`-Toggle.
  → Beide Sprachen sind **eigenständige, indexierbare URLs**, `<html lang/dir>`
  wird **server-seitig** korrekt gerendert (**kein RTL-Flash**), plus
  `hreflang`-Alternates (`sitemap.ts` + `generateMetadata`).
- `src/middleware.ts` leitet `/` je nach `Accept-Language` auf `/de` bzw. `/fa`.
- Übersetzungen zentral in `src/lib/i18n.ts` (`MESSAGES`), server-geseedet über
  `I18nProvider` → Client-Komponenten nutzen `useT()`/`useI18n()` ohne Flash.

## Struktur

```
src/
  app/
    [locale]/            layout (html lang/dir), page (Home), about, projects,
                         donate, membership, news, contact, impressum, datenschutz
    api/contact          Formular-Endpunkt (TODO: SMTP)
    api/membership       Formular-Endpunkt (TODO: SMTP)
    globals.css          Design-System (Petrol/Teal + Safran/Amber + Sand)
    sitemap.ts, robots.ts
  components/            SiteNav, SiteFooter, LanguageSwitcher, Logo, Icons,
                         home/* (Hero, Mission, Impact, Projects, DonateCta), Formulare
  lib/                   i18n.ts, site-config.ts, nav.ts, projects.ts
```

## ⚠️ Vor dem Livegang ausfüllen (>>> PLATZHALTER <<<)

Alle im Code mit `>>> PLATZHALTER <<<` markiert:

1. **`src/lib/site-config.ts`**
   - Vereinsname, Adresse, Telefon, Registernummer (`CONTACT`)
   - Spenden: **PayPal-Link**, **IBAN/BIC/Bank/Kontoinhaber** (`DONATE`)
   - `DONATE.taxDeductible` auf `true`, sobald Freistellungsbescheid vorliegt
   - Social-Media-Links (`SOCIAL`)
2. **Impressum & Datenschutz** (`app/[locale]/impressum`, `datenschutz`)
   - Vertretungsberechtigte, Registergericht, verantwortliche Person
   - DSGVO: AVV Vercel, PayPal-Hinweise → rechtlich prüfen lassen
3. **E-Mail-Versand** (`api/contact`, `api/membership`)
   - Vercel-ENV: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`
   - nodemailer o. Ä. ergänzen (aktuell wird nur validiert + geloggt)
4. **Inhalte**: echte Impact-Zahlen (`ImpactSection`), echte Projekt-Texte,
   Aktuelles-Meldungen (`news`), Logo unter `public/schahed-logo.svg`
5. **`NEXT_PUBLIC_SITE_URL`** in Vercel setzen (Default: `https://schahed.com`)

## Deployment

GitHub → Vercel (wie alghadir/belal). `NEXT_PUBLIC_SITE_URL` als Env-Var setzen.
