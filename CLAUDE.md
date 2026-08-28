# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dil / Language

Bu layihənin bütün kodu, şərhləri, commit mesajları, sənədləri və UI mətnləri **Azərbaycan dilindədir**.
Yeni kod yazarkən eyni dildə davam et — İngilis dilinə keçmə.

All code comments, docs, commit messages and UI strings in this repo are in Azerbaijani. Keep writing in Azerbaijani.

## What this is

Zarafat Notariat Palatası — a document generator (Azerbaijani market). Documents are built as SVG in
the browser, exported as PNG via canvas; paying 1 AZN publishes them into a registry and attaches a QR
code. 204 templates · 17 categories · 10 SVG layouts · 6 palettes · **2 tones**.

The site has two modes, switched at the top of the page and persisted in `localStorage`:
`zarafat` (jokes — 132 templates, 11 categories) and `xatire` (keepsakes — 72 templates,
6 categories, ids prefixed `x-`). The structure of the document is identical in both; only the
wording softens. See "Tone system" below.

## Commands

```bash
# Frontend build (from repo root)
npm install
npm run build            # frontend/* → dist/zarafat-mvp.html (single-file, works over file://)
npm run build:laravel    # frontend/* → backend-php/public/assets/ + resources/views/spa.blade.php
npm run fonts            # re-subset IBM Plex woff2 (only needed when fonts change)

# Frontend / generator tests (Node, no backend needed unless noted)
npm run test:qr          # QR encoder vs the `qrcode` reference library
npm run test:barcode     # Code-39 table invariants + round-trip decode
npm run test:doc         # 2 tones × 10 layouts × 6 palettes: <g> balance, tone marks, element counts, MRZ
npm run test:templates   # 204 templates: unique ids, tone/category match, text budgets, layout spread
node tools/decode-test.js  # real jsQR scan of generated QR
npm run test:dist        # dist/zarafat-mvp.html under file:// (build first)
npm run test:e2e         # Playwright + backend-node end-to-end
npm run test:api         # backend-node API suite
npm run render           # full-size sample of every layout + contact sheet → tools/render/
npm run shots            # desktop + mobile screenshots → tools/shots/

# Laravel backend (from backend-php/)
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed      # seeds admin from ADMIN_EMAIL / ADMIN_PASSWORD
php artisan serve
php tests/logic.php             # framework-free logic: packs, Epoint signature, reg no, moderation, sanitizer
php tests/audit.php             # static: PHP syntax, Blade balance, route names, view paths, PSR-4
php tests/security.php http://127.0.0.1:8000   # behavioural: rate limits, CSRF, admin guard, guest-row creation
                                #   (needs a running `php artisan serve`)
php ../backend-php/doctor.php   # environment diagnostics

# One-command local setup (does all of the Laravel steps above)
bash setup.sh      # Windows: .\setup.ps1
```

There is no linter, no formatter, no PHPUnit suite. The `tests/*.php` and `tools/*.js` files are
hand-rolled harnesses that print `✓ / ✗` and exit non-zero on failure. To run a single check, run its
script directly — they are not parameterized.

## Build outputs vs sources

**`frontend/` is the only source of truth for client code.** These are generated — never edit them:

- `backend-php/public/assets/*` and `backend-php/resources/views/spa.blade.php` ← `npm run build:laravel`
- `dist/zarafat-mvp.html` ← `npm run build`

After any change under `frontend/`, run `npm run build:laravel` (and `npm run build` if the single-file
demo matters), otherwise the Laravel site keeps serving the old assets.

`build-laravel.js` refuses to run if `index.html` contains `@directive`, `{{` or `{!!` — Blade would
misparse them. Keep those sequences out of the markup.

## Three backends, one API contract

| Path | Role |
|---|---|
| `backend-php/` | **Primary.** Laravel (composer requires `^12.0`, docs say 13) / PHP 8.4. API + `/kabinet` + `/admin`. |
| `backend-node/` | **Archive.** Fastify + SQLite first MVP. Same API contract; `test:e2e` and `test:api` still run against it. Do not add features here. |
| none | `app.js` falls back to `localStorage` when `GET /api/health` fails — this is the `dist/` demo mode. |

Because `app.js` has to work against all three, every API-touching change must keep the JSON shape
identical on both backends or explicitly go through the `API.online` fallback branch.

## Architecture

### `frontend/doc.js` — the SVG document engine (~1850 lines, no dependencies but `qr.js`)

Exports `window.DOCGEN` with `a4(doc, opts)` / `story(doc, opts)`, plus `LAYOUTS`, `LAYOUT_NAMES`,
`PALETTES`, `TONES`, `TONE_NAMES`. Each layout is a `L_<name>(doc, C)` function registered in the
`LAYOUTS` map; `C` carries the palette `P` and an id prefix `idp` used to namespace `<defs>`
gradients/patterns.

**Tone system.** A `TONE` table at the top holds every string that differs between `zarafat` and
`xatire` (institution name, seal text, notary, watermark, disclaimer band, court wording, MRZ
optional-data, printing house, …). `ctxFor()` — called by both `a4()` and `story()` — sets the
module-level `CUR` from `doc.tone`, and `TT()`/`CUR` is what layouts and helpers read. This exists
because `seal()`, `crest()`, `emboss()` and `intakeStamp()` do not receive `doc`; rendering is
synchronous, so a module-level current tone is safe and avoids changing those signatures.
Two more tone helpers: `penC(P)` (penalty-box accent — palette `accent` in `xatire`, `P.seal` in
`zarafat`) and `lbl(doc, key, layoutFallback)` (soft generic labels in `xatire`, each layout's own
fallback in `zarafat`, case-matched to the fallback).

**`zarafat` output must stay byte-identical** when refactoring here. There is no golden-file test for
this; verify by hashing `a4()` output across every layout × palette before and after a change.

Two composition helpers and one hard ordering rule ("üç qat qaydası"):

1. `paperBase(doc, C, o)` — substrate (paper, grain, fibers, ghost crest, fold marks, microtext).
   Must be emitted **before** the `var bs = out.length` line.
2. body content — everything between `bs` and `centerBody(...)` is wrapped in a translate group and
   can shift down by up to 130px for short documents.
3. `pageFurniture(doc, C, o)` — form number, page mark, watermark, disclaimer. Must be emitted
   **after** `centerBody(...)`, at the very end of the layout.

Anything accidentally placed between `bs` and `centerBody` will move with the body.

`inner(doc, C)` is a mechanical gate: if a layout's output lacks a `data-wm="1"` attribute it appends
the watermark, and if it lacks `data-dc="1"` it appends the disclaimer. New layouts inherit the parody
marks even if their author forgets them. Do not bypass `inner()`. The gate keys on those data
attributes rather than on text **because the `xatire` watermark has no text at all** — a text-based
gate would emit a second watermark for every layout in that tone.

**Adding a layout** touches four places:
`doc.js` (`L_x`, `LAYOUTS`, `LAYOUT_NAMES`) → `app.js` (`LAYOUT_EDGE`, `LAYOUT_ICON`) →
`backend-php/config/zarafat.php` `'layouts'` whitelist (server rejects unknown values via
`Sanitizer::pick`) → the hard-coded counts in `tools/check-doc.js`, `tools/check-templates.js`,
`tools/dist-check.js`.

### `frontend/templates.js` + `frontend/templates-xatire.js` — content catalog

`templates.js` defines `window.CATEGORIES` / `window.TEMPLATES` (11 categories, 132 templates, all
`tone: 'zarafat'`). `templates-xatire.js` **pushes onto those same arrays** (6 categories, 72
templates, all `tone: 'xatire'`, category ids prefixed `x-` to avoid colliding with `family`), so it
must load *after* `templates.js` everywhere: `index.html`, `build.js`, `tools/build-laravel.js`,
`tools/check-templates.js`.

Invariants asserted by `check-templates.js`: exactly 12 templates per category, every category covers
all 10 layouts, at least 5 distinct palettes per category, every palette used somewhere, and each
template's `tone` matches its category's. Each template pins a `layout` and `palette`, but the user can
override both at runtime. Text lengths are budgeted against `config/zarafat.php` `limits` (the server
silently truncates) and against a tighter visual range in `check-templates.js`. The template id
`weekend-pass` is depended on by other tests — don't rename it.

### `frontend/app.js` — app logic + API layer

The `API` object is the single boundary: each method has an online branch (`fetch('/api/...')`) and an
offline branch (`localStorage`). CSRF token is read from `<meta name="csrf-token">` and the
`XSRF-TOKEN` cookie and sent on every POST. Error responses are read as text first because 419/500
pages are not always JSON.

`state.mode` drives the tone switch, persisted as `zrf_mode`. `catsOf(mode)` / `tplsOf(mode)` filter
the catalog, `MODE_COPY` holds every mode-dependent site string (title, masthead, hero), and
`setMode()` resets category/template/search and re-renders. Anything that picks a template at random
or by index must go through `tplsOf(state.mode)` — otherwise `state.cat` lands on the other mode's
category and the tab bar breaks. Note `#modeBadge` (server/demo indicator) is unrelated to
`#modeSwitch`.

### `backend-php/` — Laravel

- **Visitor identity.** `IdentifyVisitor` middleware runs on every `web` request: authenticated user →
  `zrf_uid` guest cookie → new guest row. Registered *before* `ThrottleRequests` in the priority list
  because throttle keys are derived from the visitor id. Result is available as `$request->visitor()`.
- **Guest → account merge.** Registering converts the guest row in place; logging in from another
  device merges that device's guest session (`AccountService::mergeGuestInto`).
- **Credits.** `users.credits` is the balance; `CreditService::apply()` is the only writer — it locks
  the row (`lockForUpdate`) inside a DB transaction and appends a `transactions` row
  (`topup` · `spend` · `grant` · `refund`). Never mutate `credits` directly.
- **Publishing.** `DocumentService::publish()` is idempotent — republishing an already-published
  document does not spend a second credit.
- **Tone.** `documents.tone` (migration `..._000007_add_tone_to_documents_table`) is whitelisted
  through `Sanitizer::pick($input['tone'], config('zarafat.tones'), 'zarafat')` and returned by
  `toApiArray()`, so a document opened from the registry renders in the tone it was created in.
  The archived `backend-node/` does **not** store it — documents created through it come back as
  `zarafat`.
- **Payments.** `App\Support\Payments\PaymentProvider` interface with `SimulationProvider` (default)
  and `EpointProvider` (`base64(json)` payload + `base64(sha1(private+data+private))` signature,
  `hash_equals` on callback, idempotent credit application). Provider chosen by `PAYMENT_PROVIDER`.
- **Routes** are Azerbaijani (`/kabinet/senedler`, `/admin/istifadeciler`) and named
  (`account.*`, `admin.*`); `tests/audit.php` verifies every `route()` name used in Blade exists.
  Only `api/payments/callback` is CSRF-exempt.
- `App\Support\*` is deliberately framework-free so `tests/logic.php` can `require` it without Laravel.
  Keep it that way — no facades or helpers in `app/Support/`.

Note from `QURASDIRMA.md`: the Laravel code was written in an environment where `composer install` was
impossible, so it has been verified statically (`tests/audit.php`) rather than booted. Expect the
occasional runtime wrinkle on first run.

## Values duplicated across files — keep in sync

- **Credit packs** `p1/p3/p10`: `frontend/app.js` `PACKS`, `backend-php/config/zarafat.php` `'packs'`
  (+ `app/Support/Packs.php`), `backend-node/payments.js` `PACKS`. `GET /api/packs` serves the
  server-side copy.
- **Layout, palette and tone lists**: `doc.js` ↔ `config/zarafat.php` whitelists
  (`layouts`, `palettes`, `tones`).
- **Palette labels/swatches**: `doc.js` `PALETTES` ↔ `app.js` `PAL_LABEL` / `PAL_SWATCH`.
- **Counts (204 / 17 / 10 / 6 / 2)**: asserted literally in `tools/check-templates.js`,
  `tools/check-doc.js`, `tools/dist-check.js`, `tools/e2e.js`.

## Gotchas

- **Azerbaijani casing.** `'i'.toUpperCase()` is `I`, not `İ`; `'İ'.toLowerCase()` is two code points.
  `doc.js` has its own `upper()` for this. JS case-insensitive regex does **not** match `İ` — write
  test substrings that avoid the letter.
- **`String.replace` with a string RHS** treats `$$`, `$&`, `$'` specially. Build scripts must pass a
  **function** as the replacement (see the comment in `build.js`).
- **The document must stay pure SVG.** No `foreignObject`, no external images, no web fonts — PNG
  export goes through canvas and would drop them. Fonts are named generically (Georgia/Helvetica/Courier
  stacks) inside `doc.js` for the same reason.
- **No CSS framework.** `site.css` (~19 KB) and `panel.css` are hand-written with real class names and
  CSS custom properties (`--paper`, `--ink`, `--blue`, `--red`, `--mono`). Do not introduce Tailwind or
  any CDN stylesheet.
- **Fonts are local and subset** to the Azerbaijani alphabet (8 woff2, ~27 KB total). Never add a font CDN.
- **`APP_URL` is baked into QR codes.** Changing the domain breaks QR codes on already-published documents.

## Security posture

Verified by `backend-php/tests/security.php` (behavioural, needs a running server). Do not weaken
these without replacing them:

- **Rate limits are load-bearing.** `throttle:login` / `register` / `registry` / `documents` /
  `payments` / `reports` are defined in `AppServiceProvider::boot()`. They run on the **cache store**
  — `CACHE_STORE=database` needs the `cache` table (migration `..._000008_create_cache_and_queue_tables`).
  If that table is missing, every limit silently stops working.
- **Guest rows are created lazily.** `IdentifyVisitor` only *recognises* a visitor; the row is created
  in the `$request->visitor()` macro on first use. Creating it in the middleware (the old behaviour)
  let a cookie-less loop of plain GETs fill the `users` table.
- **Simulated payments are impossible in production.** `PaymentService::provider()` throws if the
  provider is not `epoint` under `APP_ENV=production`, and `simulationAllowed()` returns false there
  regardless of `ALLOW_SIMULATED_PAYMENTS`. `SimulationProvider::parseCallback()` verifies no
  signature, so leaving it reachable in production would mean free credits.
- **Blocked users are read-only.** `is_blocked` is checked in document store/publish, payment
  simulate/checkout, reports, and the account top-up.
- **`markPaid()` is idempotent and amount-checked**, under a row lock.
- **Session and guest cookies go `secure`** when `APP_URL` starts with `https` (set in
  `AppServiceProvider::boot()` and `IdentifyVisitor::issueCookie()`).
- **The seeder never resets an existing admin password**, refuses `admin12345` in production, and
  generates a random one when `ADMIN_PASSWORD` is empty.

**Known and accepted:** the document is rendered by `doc.js` *in the browser*, so anyone with DevTools
can call `DOCGEN.a4({..., paid: true})`, strip the watermark/disclaimer from the returned SVG string,
and rasterise it. This cannot be closed while the live preview exists, and it is no easier than
rebuilding the document in an image editor. What protects the product is that **the registry is
server-side and authoritative** — a forged image's QR either 404s or shows the server's stored
content, not the image's. The UI itself is correctly gated: the HD download button only appears when
the server reports `paid: true`.

## Non-negotiable design invariants (legal shield)

These are deliberate, not decoration — do not remove or weaken them when editing layouts or copy:

- No state symbols, no "Azərbaycan Respublikası", no real ministry or notary office name. The crest is
  the invented `ZNP` monogram; the institution and notary (`Ə. Zarafatov`) are fictional.
- The registry prefix (`ZRF-2026-9482`) must not imitate a real government registry format.
- Every document keeps: circular seal reading `ƏYLƏNCƏ MƏQSƏDLİDİR` / `PARODİYA`, the diagonal
  watermark (faded but never removed after payment), the bottom disclaimer band, and microtext that
  literally spells out `ZARAFAT • HÜQUQİ QÜVVƏSİ YOXDUR • PARODİYA`.
- The `vesiqe` layout's ICAO TD3 MRZ writes `PARODIYA` into the optional-data field (positions 29–42)
  so any OCR reveals it.
- Report/delete flow stays on every document; `App\Support\Moderation` filters banned words.

## Implemented specs

`.claude/promts/PROMPTxatirerejimi.md` specified the "Xatirə" keepsake mode. It is **implemented**
(tone system, `rose` palette, `templates-xatire.js`, mode switch, `documents.tone`), but with three
deliberate deviations from that stale document: 72 xatirə templates instead of 36 (the repo's 12-per-
category standard), all 10 layouts instead of 5, and category ids prefixed `x-`. The spec's numbers
(36 templates, 5 layouts) describe the repo as it was before the catalog expansion — ignore them.
