# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dil / Language

Bu layihənin bütün kodu, şərhləri, commit mesajları, sənədləri və UI mətnləri **Azərbaycan dilindədir**.
Yeni kod yazarkən eyni dildə davam et — İngilis dilinə keçmə.

All code comments, docs, commit messages and UI strings in this repo are in Azerbaijani. Keep writing in Azerbaijani.

## What this is

Zarafat Notariat Palatası — a document generator (Azerbaijani market). Documents are built as SVG in
the browser, exported as PNG via canvas; paying 1 AZN publishes them into a registry and attaches a QR
code. 216 templates · 18 categories · 12 SVG layouts · 6 palettes · **2 tones**.

The site has two modes, switched at the top of the page and persisted in `localStorage`:
`zarafat` (jokes — 144 templates, 12 categories) and `xatire` (keepsakes — 72 templates,
6 categories, ids prefixed `x-`). The structure of the document is identical in both; only the
wording softens. See "Tone system" below.

## Commands

```bash
# Frontend build (from repo root)
npm install
npm run build            # frontend/* → dist/zarafat-mvp.html (single-file, works over file://)
npm run build:laravel    # frontend/* → backend-php/public/assets/ + resources/views/spa.blade.php
npm run fonts            # re-subset IBM Plex woff2 (only needed when fonts change)
npm run catalog:export   # frontend/templates.js → backend-php/database/seeders/catalog.json (seed data)

# Frontend / generator tests (Node, no backend needed unless noted)
npm run test:qr          # QR encoder vs the `qrcode` reference library
npm run test:barcode     # Code-39 table invariants + round-trip decode
npm run test:doc         # 2 tones × 12 layouts × 6 palettes: <g> balance, tone marks, element counts, MRZ
npm run test:templates   # 216 templates: unique ids, tone/category match, fields schema, text budgets
node tools/decode-test.js  # real jsQR scan of generated QR
npm run test:fields      # dynamic questionnaire layer in a real browser (no backend needed)
npm run test:admin       # admin catalog CRUD end-to-end (needs `php artisan serve` on :8080)
npm run test:dist        # dist/zarafat-mvp.html under file:// (build first)
npm run test:e2e         # Playwright + backend-node end-to-end
npm run test:api         # backend-node API suite
npm run render           # full-size sample of every layout + contact sheet → tools/render/
npm run shots            # desktop + mobile screenshots → tools/shots/
node tools/hash-layouts.js # byte-identity gate for the original 10 layouts (see below)

# Laravel backend (from backend-php/)
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed      # seeds the catalog (catalog.json) + admin from ADMIN_EMAIL / ADMIN_PASSWORD
php artisan db:seed --class=CatalogSeeder   # re-import the catalog without touching the admin
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
`tools/dist-check.js`. `site.css` `.layouts` grid is `repeat(6, 1fr)`, sized for 12.

> **The bijection trap.** `check-templates.js` requires every category to cover every layout,
> and every category holds exactly 12 templates. With 12 layouts that is now a **bijection** —
> each category uses each layout exactly once, leaving zero spare slots. A 13th layout therefore
> forces a decision: either relax one of those two invariants, or grow every category to 13
> templates (18 × 1 = 18 new templates). Budget for that before adding one.

**Structure blocks** (`kvTable`, `checkList`, `scaleBar`) are called **only** by `viza` and
`ekspertiza`. The other ten layouts keep their hand-rolled tables on purpose: `zarafat` output
must stay byte-identical, and `tools/hash-layouts.js` is the gate that proves it. Run it before
and after any change under `frontend/doc.js` — 720 renders collapse to one sha256, and the hash
must not move. Note `defs()` is shared by every layout, so a new `<pattern>`/`<linearGradient>`
added there changes every layout's bytes; emit layout-specific defs **inline** instead
(see the scan-line pattern in `L_ekspertiza`).

**Never call `Date.now()` in `doc.js`.** Rendering must be deterministic, otherwise the hash gate
and `check-doc.js` become flaky and the registry render disagrees with the PNG the user already
downloaded. `doc.state` is computed server-side by `Document::state()`.

### `frontend/templates.js` + `frontend/templates-xatire.js` — content catalog

`templates.js` defines `window.CATEGORIES` / `window.TEMPLATES` (12 categories, 144 templates, all
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

**The questionnaire layer (`fields`).** A template may carry a `fields[]` schema; when it does,
the editor replaces the free-text inputs with a generated form and the document is built from the
answers. Types: `text · select · multi · list · scale · number · time · date · datetime`.
Modifiers: `into:'to'|'from'|'title'` (also writes the answer into the legacy text field),
`row:'LABEL'` (name of the `data` row), `hide`, `auto` (fixed value, no input), `person` (name
charset), `up` (uppercase), `unit`, and `expiry` — `true` for an `HH:MM` field, `'hours'` for a
number of hours; at most one per template. Companion keys: `notes[]`, `share`, `signTitle`,
`signOrg`, `cancelReasons[]`. `{{key}}` placeholders in `preamble` / `notes` / `share` resolve
against the answers (the older `{to}` / `{from}` substitution still runs first).

The layer is **hybrid on purpose**: answers flow into `doc.data` / `doc.checks` / `doc.scale`
(rendered only by `viza` and `ekspertiza`) **and** into `doc.powers` and the preamble, so that a
questionnaire template still reads correctly when the user switches it to one of the other ten
layouts — which is also what the 34 re-pointed templates rely on. That is why the hero templates
put their key values in the preamble via `{{}}` rather than relying on `data` rows alone.

`state.answers` is the single source of truth for the form; `readFields()` **reads it without
mutating it** (an earlier version stripped blank list rows and made the "add name" button a no-op).
The editor uses one delegated `input`/`click` listener on `#editorForm` because `#fFields` is
rebuilt on every template pick. Templates with no `fields` take the original code path untouched.

### The catalog is database-owned

`GET /api/catalog` is the live source of categories and templates; `frontend/templates.js` +
`templates-xatire.js` are the **seed and the offline fallback**, nothing more. On boot `app.js`
fetches the catalog and, if it arrives, replaces `CATEGORIES` / `TEMPLATES` **in place**
(`applyCatalog()` mutates the arrays rather than reassigning, so every closure holding a reference
sees the new data) and re-renders through `rebuildCatalogViews()`. If the request fails — `dist`
bundle over `file://`, backend down — the static arrays stay and the site works exactly as before.
That fallback is why the static files must never be deleted, and why `check-templates.js` still
validates them.

- `categories` / `templates` tables (migration `..._000010`), models `Category` / `Template`.
  `Template::toCatalogArray()` produces exactly the object shape `app.js` expects; empty optional
  keys are omitted so the payload matches the hand-written files.
- `CatalogService::payload()` caches forever; **every admin write must call
  `CatalogService::forget()`** or the site keeps serving the old catalog.
- Admin CRUD lives in `Admin\CatalogController` (`/admin/sablonlar`, `/admin/kateqoriyalar`).
  Deactivating is soft — the row stays, it just leaves the API. Deactivating a category hides its
  templates too. A category with templates cannot be deleted.
- The template form carries a **live preview**: `layouts/panel.blade.php` exposes a
  `@stack('scripts')` hook, and `admin/template.blade.php` pushes `qr.js` + `doc.js` and renders
  `DOCGEN.a4()` from the form values on every keystroke (200 ms debounce). Names are filled with
  sample values and questionnaire answers come from each field's default, so `viza`/`ekspertiza`
  previews show real `data`/`checks`/`scale` blocks. It also runs a light client-side copy of the
  schema check and prints the errors under the sheet — the authoritative check is still
  `TemplateSchema` on save. Toggles for the paid view and the registry stamp sit above the sheet.
- A category's edit page doubles as its template list: every template in it is listed with
  edit/toggle links, and "Şablon əlavə et" opens the new-template form with
  `?kateqoriya=<id>` so the category and the next `sort` are pre-filled. The count column on the
  category index links to the filtered template list. This is the path admins actually use —
  templates are reached through their category, not through the flat list.
- `App\Support\TemplateSchema::validate()` is the server-side twin of `check-templates.js`
  section 5 and gates the questionnaire JSON typed into the admin form. Framework-free, so
  `tests/logic.php` covers it.
- **Registry prefix resolution order**: `templates.reg_prefix` (catalog) → `RegistryPrefix::MAP`
  (seed/offline) → `config('zarafat.reg_prefix')`. The frontend mirrors it in `regPrefix(tpl)`,
  reading `tpl.regPrefix` first.
- `npm run catalog:export` regenerates the seed JSON from the static files; the admin panel's
  "Kataloqu ixrac et" does the reverse — downloads the live catalog in the same shape, so a
  developer can commit it and refresh the `dist` bundle.
- **Nullable in validation ≠ nullable in the column.** `categories.blurb` and `templates.tag` are
  `NOT NULL DEFAULT ''`; Laravel's `ConvertEmptyStringsToNull` turns an empty form field into
  `null`, which 500s on insert. Both are coalesced to `''` in the controller — do the same for any
  new non-nullable text column.

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
- **Questionnaire answers.** `documents.extra` (migration `..._000009`) is a free-form JSON column
  following the `labels` pattern: `data · checks · scale · notes · until · signTitle · signOrg ·
  share`. Written only by `DocumentService::extraFrom()`, which routes each key through the
  array-aware sanitizers (`Sanitizer::rows/checks/list/scale/person/clock`). `Sanitizer::text()`
  still turns an array into `''` and `tests/logic.php` locks that — do not change it.
- **Expiry and cancellation.** `expires_at` is clamped to `[now+5min, now+30d]` at create;
  `publish()` calls `rollForward()` so a time that has already passed advances by whole days
  (the printed clock stays truthful). `POST /api/documents/{regNo}/cancel` is the only post-publish
  mutation: owner-only, published-only, idempotent, `throttle:documents`. `Document::state()`
  returns `active | expired | cancelled` and `toApiArray()` ships it; `doc.js` picks the diagonal
  stamp from `doc.state`, and `app.js` picks the registry verdict from the same field. The
  archived `backend-node/` has none of this — the cancel button is hidden when `!d.expiresAt`.
- **Registry prefixes.** `App\Support\RegistryPrefix::MAP` maps five viral `templateId`s to
  `CCV · HDQ · GRL · BOT · QSM`; everything else keeps `config('zarafat.reg_prefix')` (`ZRF`).
  Prefixes are **ASCII only** — `RegistryNumber::PATTERN` is `[A-Z]{2,4}`, the `/r/{regNo}` route
  constraint is `[A-Za-z]{2,4}`, `format()` uses byte-wise `strtoupper`, and the number is baked
  into the QR URL. That is why it is `CCV` and not `ÇÇV`. `frontend/app.js` mirrors the map in
  `REG_PREFIX` for the offline branch.
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
- **Registry prefixes**: `backend-php/app/Support/RegistryPrefix.php` `MAP` ↔ `frontend/app.js`
  `REG_PREFIX` ↔ `tools/export-catalog.js` `REG_PREFIX` (three copies of the same five entries;
  they only matter for seeding and the offline branch — live prefixes come from the DB).
- **Field types**: `TemplateSchema::TYPES` ↔ `app.js` `FIELD_TYPES` ↔ `tools/check-templates.js` `F_TYPES`.
- **Document state logic**: `Document::state()` ↔ `frontend/app.js` `docState()` (offline branch).
- **Palette labels/swatches**: `doc.js` `PALETTES` ↔ `app.js` `PAL_LABEL` / `PAL_SWATCH`.
- **Counts (216 / 18 / 12 / 6 / 2)**: asserted literally in `tools/check-templates.js`,
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
- **Moderation covers the questionnaire too.** `data` values, `checks`, `notes`, `preamble` and
  `share` are user text that reaches the SVG. `Api\DocumentController::store()` flattens them into
  the `Moderation::flagged()` call — leaving a new field out of that list silently bypasses the
  banned-word filter.
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
