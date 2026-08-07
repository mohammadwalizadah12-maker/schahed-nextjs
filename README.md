# Schahed — Afghanisches Hilfswerk Schahed e.V. (Next.js, DE/FA)

Neubau von **schahed.com** — zweisprachig **Deutsch / Farsi (FA, RTL)**.
Stack: **Next.js 16.3** (App Router) · React 19.2 · Tailwind CSS 4 · TypeScript 5

## Setup

```bash
npm install
npm run dev      # http://localhost:3000  ->  leitet auf /de bzw. /fa um
npm run build
npm start
```

> Build/Dev laufen bewusst mit `--webpack` (siehe `package.json`), nicht mit Turbopack.
> Node >= 20 erforderlich.

## Architektur-Entscheidungen

- **Server-seitiges Locale-Routing** `/[locale]` (`/de`, `/fa`) statt client-seitigem
  `localStorage`-Toggle. Beide Sprachen sind eigenständige, indexierbare URLs;
  `<html lang/dir>` wird server-seitig gerendert (**kein RTL-Flash**), plus
  `hreflang`-Alternates (`sitemap.ts` + `generateMetadata`).
- **`src/proxy.ts`** (Next-16-Konvention, früher `middleware.ts`) leitet `/`
  je nach `Accept-Language` auf `/de` bzw. `/fa`.
- **Übersetzungen** zentral in `src/lib/i18n.ts` (`MESSAGES`, ~170 Schlüssel),
  server-geseedet über `I18nProvider` → Client-Komponenten nutzen `useT()` /
  `useI18n()` ohne Flash.
  Sprachumschalter-Label ist **فارسی** (Farsi), nicht دری.
- **Inhalte redaktionell pflegbar** über ein eigenes Admin-CMS (siehe unten) —
  Texte, Beiträge und Links liegen als JSON in `data/` und werden per
  GitHub-API committet (`src/lib/github.ts`), nicht im Dateisystem persistiert.
- **SEO**: JSON-LD (NGO / WebSite / DonateAction), Article-Schema + OG-Metadaten
  für Beiträge, `sitemap.ts`, `robots.ts`.
- **Performance**: AVIF + WebP aktiviert, `next/image` durchgängig
  (Hero mit LCP-Priorität), Lazy-Loading für Link-Vorschaubilder.

## Struktur

```
src/
  app/
    [locale]/            layout (html lang/dir), page (Home), about, projects,
                         donate, membership, news + news/[slug], links,
                         feedback, contact, impressum, datenschutz
                         + loading.tsx / error.tsx (gebrandet)
    admin/               login, texte, links   (redaktionelle Oberfläche)
    api/
      auth/login|logout  Cookie-Session für den Admin-Bereich
      admin/ui-text      speichert src-Texte (170 Schlüssel)
      admin/posts        Beiträge (Aktuelles)
      admin/links        Nützliche Links
      contact            Kontaktformular      -> SMTP
      membership         Mitgliedsantrag      -> SMTP
      feedback           Feedbackformular     -> SMTP
    globals.css          Design-System (Petrol/Teal + Safran/Amber + Sand)
    sitemap.ts, robots.ts
  components/            SiteNav, SiteFooter, LanguageSwitcher, Logo, Icons,
                         home/* (Hero, Mission, Impact, Projects, DonateCta),
                         Formulare
  lib/                   i18n.ts, site-config.ts, nav.ts, projects.ts,
                         posts.ts, links.ts, github.ts, mailer.ts,
                         member-auth.ts, rate-limit.ts
data/                    ui-text.json, posts.json, links.json  (CMS-Inhalte)
```

## Vereinsdaten

`src/lib/site-config.ts` ist die **Single Source of Truth** und mit den echten
Daten aus dem Vereinsflyer gefüllt: Register (VR 21688, AG Hamburg),
Steuernummer, Postfach Hamburg, Telefon, `info@schahed.com`,
Bankverbindung (Haspa) und PayPal. `DONATE.taxDeductible` steht auf `true`.

**Noch offen:** `SOCIAL` (Instagram / Facebook / YouTube / WhatsApp / Telegram)
ist leer — leere Werte werden im Footer nicht gerendert, das ist unkritisch.

## E-Mail-Versand (SMTP)

Implementiert in `src/lib/mailer.ts` über **nodemailer**; genutzt von
`api/contact`, `api/membership` und `api/feedback`.

| Env-Variable | Bedeutung |
|---|---|
| `SMTP_HOST` | z. B. `smtp.your-provider.de` |
| `SMTP_PORT` | `465` (SSL) oder `587` (STARTTLS) |
| `SMTP_USER` | Postfach-Benutzer |
| `SMTP_PASS` | Passwort |
| `CONTACT_TO` | Empfänger (Default: `SMTP_USER`) |
| `SMTP_FROM` | Absender (Default: `SMTP_USER`) |

Verhalten ohne Konfiguration: `isMailConfigured()` liefert `false`, die Routen
antworten mit **HTTP 503 `mail_not_configured`** und loggen die Eingabe —
**kein vorgetäuschter Erfolg**. Sendefehler ergeben **502 `send_failed`**.

`src/lib/rate-limit.ts` begrenzt Login und die drei Formular-Endpunkte, um
Missbrauch des Vereinspostfachs zu verhindern.

## Admin-Bereich

`/admin` mit Cookie-Session (`src/lib/member-auth.ts`).

| Env-Variable | Bedeutung |
|---|---|
| `MEMBER_PASSWORD` | Zugangspasswort |
| `MEMBER_AUTH_SECRET` | Signaturgeheimnis (Hex, ausreichend lang) |
| `GITHUB_TOKEN` | Schreibzugriff für CMS-Commits (`src/lib/github.ts`) |

> ⚠️ `.env.local` enthält derzeit nur Entwicklungswerte
> (`schahed-test-2026`, `dev_only_secret_change_me_...`).
> **Vor dem Livegang in Vercel durch echte Werte ersetzen.**

## Vor dem Livegang

1. **Vercel-Env setzen:** `NEXT_PUBLIC_SITE_URL` (Default `https://schahed.com`),
   `SMTP_*`, `CONTACT_TO`, `MEMBER_PASSWORD`, `MEMBER_AUTH_SECRET`, `GITHUB_TOKEN`
2. **Impressum & Datenschutz** juristisch prüfen lassen — insb. vertretungs-
   berechtigte Personen, Registergericht, AVV Vercel, PayPal-Hinweise
3. **`SOCIAL`-Links** in `site-config.ts` ergänzen (optional)
4. **Inhalte:** echte Impact-Zahlen (`ImpactSection`), Projekt-Texte,
   Aktuelles-Meldungen — über `/admin` pflegbar

## Deployment

GitHub → Vercel (wie alghadir / belal).
Repo: `github.com/mohammadwalizadah12-maker/schahed-nextjs`
