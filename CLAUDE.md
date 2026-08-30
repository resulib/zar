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

On top of that sits the **reply layer**: any published document can be answered with a *cavab sənədi*,
which gets its own registry number and stays linked to the one it answers. Its catalog is separate —
71 reply templates · 6 reply categories · 6 intents. See "The reply layer" below.

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
npm run test:copy        # copy quality: style rules (§9) + option-list schema (§10) — tools/copy-rules.js
npm run test:title       # longest catalog titles across 12 layouts + story card, in a real browser
npm run test:templates   # 216 templates: unique ids, tone/category match, fields schema, text budgets
npm run test:replies     # 71 reply templates: intent coverage, replyCats, prefixes, orgs, render
npm run test:reply-flow  # the SPA reply editor (/?cavab=…) in a real browser (no backend needed)
node tools/decode-test.js  # real jsQR scan of generated QR
npm run test:fields      # dynamic questionnaire layer in a real browser (no backend needed)
npm run test:admin       # admin catalog CRUD end-to-end (needs `php artisan serve` on :8080)
npm run test:viewer      # the bare /r/{regNo} document viewer + PDF structure (no backend needed)
npm run test:fonts       # every shipped woff2 covers the full Azerbaijani alphabet (WOFF2 cmap reader)
npm run test:devet       # invitation catalog: 11 events × 3 designs, config whitelists, brand-leak scan
npm run test:devet-flow  # the invitation builder in a real browser (no backend needed)
npm run test:devet-view  # publish → link → OG image → guest page → RSVP  (needs `php artisan serve --port=8099`)
npm run test:devet-bulk  # bulk guests, per-guest links, ZIP archive, CSV  (needs the same server)
npm run render:devet     # every invitation design → tools/davet/ + contact sheet
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

**Two render traps nothing else documents.** `vesiqe` calls `items()` nowhere — it renders **zero
`powers` clauses**, so its operative sentence must live in `preamble` + `penalty`. `viza` never
renders `preamble`; instead it prints `powers` as the numbered «QEYDLƏR» list (`doc.js:2040`).
Any copy written for those two layouts has to account for that.

**The document type word comes from the LAYOUT, not the template** — `Q Ə R A R` (`doc.js:1596`),
`SERTİFİKAT` (`:1289`), `TELEQRAM` (`:1807`) and so on are literals. A template expresses its own
type only through `doc.title`, so the title's final word must match the layout it pins.
`tools/copy-rules.js` `DOC_TYPE` holds that mapping and `tools/check-copy.js` enforces it for the
`zarafat` tone. Because every category covers all 12 layouts exactly once, each category
automatically spans 12 document types.

**Title budget is empirical, not guessed.** `story()` and the single-line `viza`/`ekspertiza`
headings were the binding constraints; both now wrap. `node tools/check-title-fit.js` renders the
12 longest catalog titles across all layouts **in a real browser** and fails on any `…` — the Node
stub (`measureText = length × 6.1`) is useless for this measurement. Safe ceiling measured at
**93 characters**; `AIM.title` is set to 92.

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

### The issuing agency (`signOrg`)

Every template names the fictional body that issues it — `templates.sign_org`, edited in the admin
form as «İmzalayan orqan», served as `signOrg`. It renders as the **masthead sub-line in all 12
layouts** via `qurumSetri(doc, fallback, caps, x, y, o)` in `doc.js`, which falls back to each
layout's own text when the field is empty.

- **That fallback path must stay byte-identical** — `tools/hash-layouts.js` hashes 720 renders and
  its `mkDoc()` never sets `signOrg`. Never emit an unconditional new `T(...)` line for it; the
  three layouts with no sub-line of their own (`diplom`, `sertifikat`, `teleqram`) pass `''` as the
  fallback so the helper emits nothing.
- `qerar` is the exception: the agency is suffixed `· UYDURMA ORQAN` rather than replacing
  `CUR.courtSub`, which carries the "no jurisdiction" wording.
- **Budget is 56 characters** (column is 60). `tools/check-templates.js` section 6b enforces that
  every template has one, that it fits, and that it does not contain a real institution fragment
  (`ORG_BAN`) — the legal shield, automated.
- `signOrg` sits in the always-present part of `formDoc()` in `app.js`, **not** in the questionnaire
  `extra` block; putting it back there would silently drop it for the 211 templates with no `fields`.

### Draft templates (`active: false`)

A template object may carry `active: false`. Such a row is seeded **inactive**, so
`CatalogService::payload()` never ships it and the live site does not see it — an admin enables it
with one toggle in `/admin/sablonlar`. Four places make that work:

- `tools/export-catalog.js` emits `is_active: t.active !== false`.
- `CatalogSeeder` reads it **only on insert** (`$t['is_active'] ?? true`); on an existing row the
  admin's own toggle is never overwritten, exactly like `sort`.
- `app.js` `tplsOf()` filters `active !== false` — the `dist` bundle has no server to filter for it.
- `tools/check-templates.js` splits `A` (active) from `DRAFT`: the structural invariants
  (216 · 12 per category · the 12-layout bijection · ≥5 palettes) apply to **active only**, while
  schema, text budget, `signOrg` and `tools/check-copy.js` style rules apply to **all** — a draft is
  one click away from being live, so its copy must already be finished.

There are currently **60 drafts**, five per `zarafat` category.

> **Array holes are invisible to every other check.** `[{…}, , {…}]` — an elision from a stray comma
> — is skipped by `filter`/`every` but counted by `length`, so it silently shifts every count by one
> and passes the whole suite. `check-templates.js` §1 now asserts there are none.

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

### The editor is locked — the server owns the document text

Visitors type **only the two name fields**. Title, the clause list and the penalty clause come
from admin-authored option lists (`templates.title_options` / `powers_options` +
`powers_min`/`powers_max` / `penalty_options`, migration `..._000011`). A template with no
options shows its own text read-only, so the site is safe with zero content work.

**282 of the 287 templates now carry option lists.** Only the five `viral` questionnaire templates
do not — `fields` and option lists are mutually exclusive (`templateSave()` rejects the pair).
Three invariants hold across the catalog and are enforced by `tools/check-copy.js` §10:
`titleOptions[0] === title`, `penaltyOptions[0] === penalty`, and the first `powersMax`
`powersOptions` are exactly the template's own four `powers` lines — so the document a visitor
sees by default is the one the catalog card advertises. `powersMin: 2, powersMax: 4` everywhere.
`app.js renderPicks()` seeds `state.powerPicks` from `rng[1]` (the **max**), not `rng[0]`; seeding
from the minimum would open every document with two clauses and freeze `togglePower()` at the
lower bound.

**The dropdowns are UX. The control is `DocumentService::create()`**, which resolves the template
by `templateId` and rebuilds the document from the catalog:

- `pickTitle()` / `pickPenalty()` → `Sanitizer::pickText()`; `pickPowers()` → `Sanitizer::pickList()`
  bounded by `TemplateSchema::pickRange()`. Off-list values silently fall back to the template's
  own text — client strings are a *request*, never a value.
- **`preamble` is never accepted.** The rule is gone from `DocumentController::store()`, so a
  forged value cannot even reach `$data`. The server rebuilds it: template preamble →
  `{to}`/`{from}` → `Answers::fill()` → truncate.
- `templateId` is **required**; an unresolvable slug is a 422 (`bad_template`). Omitting it was the
  obvious bypass.
- `cancel()` picks the reason from the template's `cancelReasons` the same way.
- **`signOrg` / `signTitle` are never accepted from the client either.** They are read straight off
  `$tpl->sign_org` / `$tpl->sign_title` in `extraFrom()`; the validation rules are gone from
  `DocumentController::store()`. The issuing agency is printed in the masthead, so a forged value
  would put a real ministry's name on a parody document.

`App\Support\Answers` is a **line-by-line mirror of `frontend/app.js`**: `clean()` ↔ `readFields()`
(`app.js:606-652`), `fill()` ↔ `fill()` (`app.js:536-542`). If they diverge by one character the
PNG the user downloaded and the registry copy disagree — the one thing the security posture
forbids. `tests/security.php` guards it with an exact-string preamble comparison.

**`TemplateSchema::MAX_PICK` is 4, not 6.** `doc.js` layouts render 4–7 clauses and five of them
(`lisenziya`, `arayis`, `teleqram`, `muqavile`, `notarial`) render only 4 — and the visitor can
change the layout at runtime, so 4 is the only count guaranteed visible everywhere.

Option lists and `fields` are **mutually exclusive** on a template; `templateSave()` rejects the
combination. `CatalogSeeder` never writes null over an existing option list — a stale
`catalog.json` would otherwise unlock every template with no error output.

### The reply layer (cavab sənədi)

Any **published** document can be answered. The reply is a normal document — own registry number, own
1-credit publish, own PDF — but it carries `documents.reply_to_id` and shows a diagonal `CAVAB SƏNƏDİ`
ribbon naming the document it answers. Chains are unbounded up to a depth cap of 12.

**Six intents**, mirrored in three places that must stay in sync — `frontend/replies.js` `REPLY_KINDS`,
`backend-php/app/Support/ReplyKinds.php`, and the hard-coded card list in `frontend/viewer.js`:

| kind | prefix | layout / palette | kind | prefix | layout / palette |
|---|---|---|---|---|---|
| `redd` | `RDD` | qerar / burgundy | `legv` | `LGV` | teleqram / steel |
| `etiraz` | `ETZ` | blank / ink | `qebul` | `QVD` | sertifikat / gold |
| `tekrar` | `TKR` | ekspertiza / forest | `xatire` | `XCV` | varied / rose |

Prefixes are **ASCII only** for the same reason as `RegistryPrefix::MAP` — the number goes into the QR
URL. One prefix per intent also spreads `RegistryNumber`'s 9000-per-year ceiling across six series.

**The reply catalog is a separate global, not part of the 216.** `frontend/replies.js` defines
`window.REPLY_KINDS` / `REPLY_CATEGORIES` / `REPLIES` and **never pushes onto `CATEGORIES` /
`TEMPLATES`** — `check-templates.js` demands exactly 18/216, 12 templates per category and full
12-layout coverage, which is already a bijection (see "the bijection trap"). Keeping replies in
their own arrays is what lets that file stay untouched. In the **database** they are ordinary
`categories` / `templates` rows distinguished by `categories.is_reply` and `templates.reply_kind`;
`CatalogService::payload()` splits the response into four keys — `categories` · `templates` ·
`replyCategories` · `replies`. Merging them would dump reply templates into the home grid and break
`catsOf`/`tplsOf`.

`templates.reply_cats` lists which *original* categories a reply answers; empty means universal.
Every intent has one universal fallback, so the visitor never sees an empty list.

> A new invitation asset must be added to `tools/build-laravel.js` `ASSETS` **and** to the page's
> script tags; `build.js` (the single-file zarafat demo) deliberately does not carry them.

**Registering `replies.js` takes four edits** (it must load *after* `templates-xatire.js`):
`frontend/index.html`, `build.js`, `tools/build-laravel.js` `ASSETS`, `tools/export-catalog.js`.
It is deliberately **not** loaded by `viewer.html` — the viewer only needs the six card labels.

**The server owns the link, exactly like the option lock.** The client sends only `replyTo` (a
registry number); `DocumentService::resolveParent()` resolves it and throws `bad_reply` unless every
gate passes: a non-reply template may not carry `replyTo`, a reply template may not be used without
one, the parent must be **published**, tones must match, the intent must cover the chain's topic, and
`ReplyKinds::nextDepth()` must be under the cap. `reply_root_id` / `reply_depth` / `reply_topic` are
all computed server-side.

**`reply_topic` is the chain's subject, not the parent's category.** A reply's own category is an
intent category (`c-redd`), which appears in no `reply_cats` list — so matching against it would make
replying to a reply impossible and the chain would die at level two. The topic is the *root*
document's category, denormalised onto every reply so the check costs no query and the client
(`catOfDoc()` in `app.js`) can mirror it exactly.

**Status (🟢/🟡/🔴/⚫) is derived, never stored.** Writing a verdict onto the original would let a
stranger mutate someone else's document — replying is open to everyone. `ReplyKinds::VERDICT` maps
the newest reply's intent to a badge shown **only in the chain widget**, never in the SVG.

**`doc.js` gains one helper and one line.** `replyBand()` draws the corner ribbon and `inner()` calls
it behind `if (doc.replyTo)`. The corner is deliberate: the bottom of every layout is occupied
(form/page marks at y = 1046…1084, disclaimer at 1058 / 1074 / `H-26`), while the corner triangle is
margin in all twelve. Because `hash-layouts.js`'s `mkDoc()` never sets `replyTo`, the byte gate does
not move — verify with `node tools/hash-layouts.js` before and after any change here.

**Flow:** `/r/{regNo}` shows a six-button bar and a card modal, then hands off to
`/?cavab=REG&tip=KIND`; `app.js` `enterReplyMode()` loads the original, swaps the category strip for
an intent strip, pre-fills both names and renders the preview. The viewer stays lean — no catalog, no
credits, no payment layer. `GET /api/registry/{regNo}/zencir` returns the whole chain in one SELECT
via `reply_root_id`.

**Analytics.** `document_events` records `reply_click` · `reply_open` · `reply_shared` (client, via
`POST /api/olcu`, `throttle:events`) and `reply_created` (server-side, in `DocumentService`). The
endpoint accepts only that **whitelist** — otherwise it would be an open write path. `/admin/statistika`
reads it: conversion rate, funnel, chain depth, popular intents, per-category rate.

### The invitations section (Dəvətnamələr) — a separate product

`/devetname` is **not** part of the SPA. Real people send these to real weddings, so a single
`zarafat` string anywhere in the artefact destroys the product. The separation is physical, not
a convention:

- Its own pages (`frontend/devet.html`, `devet-view.html`), own CSS (`devet.css`, `devet-view.css`,
  `devet-panel.css`), own fonts (`devet-fonts.css`), own JS. **`site.css` and `app.js` are never
  loaded**, and the organiser's board uses `layouts/devet.blade.php`, never `layouts/panel.blade.php`.
- The only link between the products is one line in the zarafat footer. There is no link back.
- `tools/check-devet-designs.js` §8 greps every `devet*` file **including comments** for
  `zarafat · notariat · reyestr · parodiya · znp · möhür · qüvvəsi`; `check-devet.js` and
  `check-devet-bulk.js` do the same against the rendered DOM, the loaded asset list, the served
  HTML and the generated PDF's `/Producer`.

**Canvas, not SVG.** `doc.js` renders SVG and rasterises it through `<img>` — a path that
**drops web fonts**, which is why it uses generic font stacks. On an invitation the font *is* the
product, so `frontend/invite.js` (`window.DAVET`) draws straight to a `<canvas>`, where
`fillText` uses the page's real `@font-face` families. Same discipline as `doc.js` otherwise:
no `Date.now()`, no `Math.random()` — `rng(seed)` only.

**Fonts are verified before they are used.** A decorative font missing `Ə` would force every design
to be redone, so `tools/woff2-cmap.js` decompresses the WOFF2 body with `zlib.brotliDecompressSync`
and reads the `cmap` directly (no dependency — same spirit as the hand-rolled PDF/QR/Code-39), and
`tools/check-fonts.js` demands 90 characters per family, unioning a family's `latin` + `latin-ext`
files. **`pyftsubset` silently drops code points the source lacks**, so the check runs on the
shipped output, not the intent. Screening result is recorded in that file: Manrope, Jost,
Marck Script, Yeseva One, Cinzel, Marcellus, Prata and Fredoka all fail — do not re-try them.
Shipped: Cormorant Garamond · Playfair Display · Montserrat · Great Vibes · Baloo 2.

**33 designs from 6 style functions.** `frontend/devet-designs.js` is data only: 11 events × 3
variants, built from 6 styles × 12 palettes × 7 motifs. Layout is elastic — `cizYigin()` shrinks
every size by one factor when the stack overflows and expands **only the gaps** when it underflows,
which is what lets one code path serve `kart` (A6), `kvadrat` and `hekaye`. Kids' motifs are a
closed list of generic themes; no cartoon or brand figures, and `photo` is `false` everywhere.

**Adding a design or event** touches three places: `devet-designs.js` → `config/devet.php`
whitelists (`Sanitizer::pick` rejects anything else) → `tools/check-devet-designs.js` §6 asserts
the two lists are byte-identical, so a one-sided edit fails the suite.

**The OG image is uploaded by the browser.** There is no server-side image pipeline and adding one
would mean re-implementing 33 designs in PHP. At publish time `DAVET.drawOg()` produces a 1200×630
JPEG and `POST /api/devet/{token}/onizleme` stores it **outside the public root**; the controller
streams it with a fixed `image/jpeg` + `nosniff`. It is validated by `getimagesizefromstring`
(exact dimensions, JPEG only, ≤400 KB) and re-encoded through GD when available.

> **Address and phone must never leave the API.** They are absent from `DAVET.drawOg()`, from
> `Invite::ogMeta()`, and from the server-rendered HTML — the guest page fetches them from
> `GET /api/devet/{token}` in the browser, exactly like `viewer.js`. A link preview is visible to
> everyone in a WhatsApp group; the venue is not. `check-devet-view.js` §4 asserts this.

**Privacy is structural.** Invitations live in their own `invites` / `invite_guests` tables — the
surest way to stay out of the registry, the catalog and `/admin/senedler` is to be absent from the
table they query. Tokens are 22 base62 chars from `random_int`; the route constraint accepts only
that length. Every page sends `noindex` as both a meta tag and an `X-Robots-Tag` header, and
`public/robots.txt` disallows `/d/`, `/devetname` and `/devetnamelerim`. A stranger asking for
someone else's board gets **404, never 403** — 403 would confirm the token exists.

**The server owns the content**, the same rule as the option lock: `design`/`palette`/`event` go
through `Sanitizer::pick` against `config/devet.php`; text is truncated to `devet.limits`;
`map_url` is rejected unless its host is in `devet.map_hosts`, otherwise a search link is built
from the address — an unchecked paste would turn every invitation into an open redirect.

**Bulk is the section's most valuable part.** A name list becomes one `invite_guests` row per guest
with its own token, its own `/d/{token}/q/{guest}` link, a ready WhatsApp message and a named PNG.
`frontend/zip.js` writes a store-only ZIP by hand (CRC-32 + local headers + central directory) —
PNGs are already compressed, so deflate would only cost time. Cards are rendered **sequentially**
with a progress bar and a cancel button; 200 canvases at once exhausts a phone. Filenames are
transliterated to ASCII by `DAVET.asciiAd()` because several unzip implementations still mangle
`ə`/`ş` — the guest's real name is on the card itself.

**RSVP is open to everyone with the link**, so it is the most tightly limited endpoint
(`throttle:rsvp`, 8/min per visitor and 20/min per IP) and it can only ever write the guest's own
row. A guest reached through a named link is already identified; one arriving through the shared
link must type a name, or the board would fill with anonymous rows.

### Export and the bare document viewer

`frontend/export.js` (`window.ZEXPORT`) owns everything that turns a rendered SVG into a file:
`svgToCanvas` · `pngBlob` · `pdfBlob` · `saveBlob` · `safeName` · `canShareFiles` · `shareFile` ·
`isAbort`. It exists as a separate file because **both** `app.js` and `viewer.js` need it. It is
registered in four places that must stay in sync: `index.html`'s script tags, `build.js`'s inline
list, `build-laravel.js`'s `ASSETS`, and `viewer.html`.

- **PDF is written from scratch**, no library — canvas → JPEG → a 6-object, single-page A4 PDF with
  `/DCTDecode`. `/CreationDate` is deliberately omitted so output stays deterministic for a given
  canvas (the same discipline as "never call `Date.now()` in `doc.js`") and a test can assert
  structure. `/Producer` is spelled without diacritics on purpose, so no UTF-16BE string encoder is
  needed. Raster scale is `paid ? 3 : 2` (288 / 192 dpi) at JPEG q = 0.92 — **do not drop below
  0.88**, the microtext band is part of the legal shield and JPEG ringing degrades it first.
- **Story sharing** uses `navigator.share({files, title, text})`. No `url` is passed: Instagram and
  WhatsApp silently drop the file when a `url` is also present, so the verify link goes inside
  `text`. iOS only accepts `share()` **inside the gesture task**, so the story PNG is
  pre-rasterised and cached (`state.storyBlob` / `viewer.js`'s `storyBlob`) as soon as a paid
  document renders. `AbortError` is a normal cancel — never toast an error for it.

**`/r/{regNo}` is a dedicated bare page**, not the SPA: `PageController::registry()` returns
`view('viewer')` and loads only `qr.js` + `doc.js` + `export.js` + `viewer.js` + `viewer.css`
(~169 KB vs the SPA's ~390 KB). It renders the document, a small floating toolbar, and nothing
else. Five states: loading · ok · expired · cancelled · notfound.

- **The viewer has no `localStorage` fallback, ever.** It shows only what `/api/registry/{regNo}`
  returns — that is the core of the "registry is authoritative" guarantee.
- The **report/delete flow is in the toolbar**, not behind an overflow menu (`CLAUDE.md` legal
  shield: "Report/delete flow stays on every document").
- `viewer.css` is separate from `site.css` and **the print block must live there** —
  `build-laravel.js` aborts on any `@directive` anywhere in an HTML file, so a single inline
  `@media print` would break the build.
- The SPA's registry section (`#qReg` / `#btnSearch` / `#searchMsg`) stays for manual lookup, and
  `app.js`'s `/r/` pathname branch stays because the archive `backend-node/` still serves the SPA
  there (`tools/e2e.js` depends on it) and `dist/` uses the `#r/` hash form.

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
- **Registry verdict copy**: `app.js` `doSearch()` ↔ `viewer.js` `showNotFound()`/`showDoc()` —
  the stern not-found sentence is asserted identical by `tools/check-viewer.js`.
- **Viewer palette**: `viewer.css` `:root` redeclares the few tokens it needs from `site.css`.
- **Clause order**: `app.js` `togglePower()` ↔ `Sanitizer::pickList()` — both must emit in the
  admin's option order, never in click order.
- **Answer cleaning**: `App\Support\Answers::clean/fill` ↔ `app.js` `readFields()`/`fill()`.
- **Pick bounds**: `app.js` `powRange()` ↔ `TemplateSchema::pickRange()` (cap `MAX_PICK` = 4).
- **Document state logic**: `Document::state()` ↔ `frontend/app.js` `docState()` (offline branch).
- **Palette labels/swatches**: `doc.js` `PALETTES` ↔ `app.js` `PAL_LABEL` / `PAL_SWATCH`.
- **Counts (216 / 18 / 12 / 6 / 2)**: asserted literally in `tools/check-templates.js`,
  `tools/check-doc.js`, `tools/dist-check.js`, `tools/e2e.js`.
- **Reply intents**: `frontend/replies.js` `REPLY_KINDS` ↔ `App\Support\ReplyKinds` (`KINDS`,
  `LABELS`, `PREFIX`, `VERDICT` — all four keyed in the same order, locked by `tests/logic.php`)
  ↔ the `KINDS` card list hard-coded in `frontend/viewer.js` (the viewer never loads the catalog).
- **Chain topic**: `DocumentService::topicOf()` ↔ `app.js` `catOfDoc()` — both must read
  `reply_topic` first and fall back to the template's own category.
- **Reply counts (71 / 6 / 6)**: `tools/check-replies.js` and `tools/dist-check.js`.
- **Invitation whitelists**: `frontend/devet-designs.js` ↔ `backend-php/config/devet.php`
  (`designs` · `events` · `palettes` · `motifs` · `styles`) — `tools/check-devet-designs.js` §6
  compares them element by element.
- **Invitation counts (11 events / 33 designs / 12 palettes / 7 motifs)**: asserted in
  `tools/check-devet-designs.js`.
- **RSVP values**: `App\Support\Devet::RSVP` ↔ `config/devet.php` `rsvp` ↔ the `CAVAB` list in
  `frontend/devet-view.js`.
- **OG image size (1200×630)**: `invite.js` `OG` ↔ `config/devet.php` `og` ↔ the
  `og:image:width/height` tags in `tools/build-laravel.js`.

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
