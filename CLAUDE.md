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
npm run test:sosial      # 6 sosial kimlik kartı: ağ siyahılar ↔ config/sosial.php, hüquqi qalxan, render
npm run test:sosial-flow # sosial kart redaktoru uçdan-uca (php artisan serve --port=8099 lazımdır)
npm run test:dossier     # iş qovluğu: seed sxemi, 9 sənəd növü ↔ Blade, sirr və brend sızması
npm run test:dossier-flow # iş qovluğu uçdan-uca, real brauzerdə — TELEFON (php artisan serve --port=8099)
npm run test:dossier-sizes # 412 / 820 / 1440: sətir uzunluğu, iki panel, kataloq şəbəkəsi
node tools/convert-dossier-blocks.js  # BİRDƏFƏLİK: köhnə «növ» şablonlarından bloklara (icra olunub)
npm run render:dossier-og # iş qovluqlarının OG şəkilləri → frontend/dossier-og/
npm run test:reply-flow  # the SPA reply editor (/?cavab=…) in a real browser (no backend needed)
node tools/decode-test.js  # real jsQR scan of generated QR
npm run test:fields      # dynamic questionnaire layer in a real browser (no backend needed)
npm run test:admin       # admin catalog CRUD end-to-end (needs `php artisan serve` on :8080)
npm run test:ai          # AI template assistant end-to-end — starts its own fake OpenAI on :8099;
                         #   the backend must be served with OPENAI_ENDPOINT pointed at it (see file header)
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
php tests/logic.php             # framework-free logic: packs, Epoint signature, reg no, moderation,
                                #   sanitizer, AI prompt/normalizer (OpenAiClient · TemplateBrief)
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
`Sanitizer::pick`) **and its `'layout_meta'` entry** (name / type word / title tail / trap note,
shown on the admin form's blank picker) → the hard-coded counts in `tools/check-doc.js`,
`tools/check-templates.js`, `tools/dist-check.js`. `site.css` `.layouts` grid is `repeat(6, 1fr)`, sized for 12.

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
  Under the errors it also prints non-blocking **tövsiyə** warnings for the catalog invariants the
  server does not enforce (`tools/check-copy.js` §10: first option = own text; title tail word vs
  layout; empty `signOrg`) — the admin is one click from shipping copy the static checker rejects.
- **The template form is written for a non-coder.** Everything that used to be a raw value is now a
  control, and none of it changes the wire format — the server contract is untouched:
  - **Questionnaire card builder.** `#fbList` renders one card per `fields[]` entry (type dropdown,
    question, `{{key}}` chip, ↑/↓/×, plus a per-type body and an «Əlavə tənzimləmələr» details).
    The cards are a *writer*, not the model: `#fields` (the JSON textarea, now inside a
    `<details id="fieldsRaw">`) stays the submitted value, and the sync is two-way — editing the
    JSON rebuilds the cards. **Broken JSON never clobbers the textarea**: the builder reports the
    parse error and leaves the text alone, so a half-typed schema is not lost. Keys are
    transliterated from the question (`Təyinat yeri` → `teyinat_yeri`) and stop auto-following once
    the admin edits the key by hand.
  - **Layout and palette are radio-card grids**, not `<select>`s (`label[data-layout="…"]` /
    `[data-palette="…"]`). Each layout card prints the **document-type word the layout itself
    writes** and `#layoutNote` spells out the title's required tail word and that layout's trap —
    the `vesiqe`/`viza` render quirks documented above are surfaced where the copy is written.
  - `notes` and `cancel_reasons` are **line-per-item textareas**, not JSON. `CatalogController::decodeList()`
    accepts either, so a value pasted from `catalog.json` still parses.
  - Live character counters attach to every `maxlength` input, and `[data-lines="max,len"]` fields
    get a line/longest-line counter. Placeholder chips under the preamble insert `{to}` / `{from}` /
    `{{key}}` at the cursor.
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

### The AI template assistant (OpenAI)

`/admin/sablonlar/{id}` carries an **«AI ilə hazırla»** panel: a one-line brief plus a mode
(`full` · `metn` · `variant` · `anket`) produces a draft that is written **into the form fields**.
Nothing is stored — the admin still reviews the live sheet and presses «Yadda saxla», and the save
goes through the same `templateSave()` validation as a hand-typed template. The assistant is
therefore never a write path into the catalog; that is the point.

- **The key lives in `.env` only** (`OPENAI_API_KEY`), never in the database — a DB backup and the
  admin's «Kataloqu ixrac et» would otherwise carry it. `/admin/parametrler` shows it masked.
  **The model, by contrast, is admin-editable** (`settings.ai_model` → `AI_MODEL` →
  `config('ai.model')`, default `gpt-5.4-mini`) and validated by **format**, not by an allowlist —
  a new OpenAI model must not require a deploy. Empty key ⇒ the panel is not rendered at all.
- Three layers, split so the two hard parts stay framework-free and testable:
  - `App\Support\Ai\OpenAiClient` — Chat Completions over curl, with the same injectable-`callable`
    shape as `EpointProvider`. It absorbs **model-generation drift**: on a 400 whose `error.param`
    names one of `temperature` / `max_completion_tokens` / `max_tokens` / `response_format`, it drops
    that parameter and retries (and falls back from `max_completion_tokens` to `max_tokens`). Without
    this, every new model family would break the panel until someone edited the payload.
  - `App\Support\Ai\TemplateBrief` — the prompt (legal shield + tone + the layout's required title
    tail word), the strict `json_schema`, and **`normalize()`, which does not trust the model**: it
    strips emoji from document text (but not from `share`), removes the numbering models like to add
    to clauses, drops duplicates, **blanks `signOrg` if it matches `ORG_BAN`**, and *constructs* the
    §10 invariants (`titleOptions[0] === title`, first `powersMax` options === `powers`,
    `penaltyOptions[0] === penalty`) rather than asking for them. `problems()` returns the
    non-fixable leftovers as Azerbaijani advice shown next to the panel.
  - `App\Services\AiService` — config, model resolution, the prompt context (sibling titles and the
    category's «qurum ailəsi»), and the **`Moderation` filter over the generated text**: the banned
    word list applies to AI output exactly as it applies to visitor text.
- `POST /admin/sablonlar-ai` is `web` + `admin` + `throttle:ai` (8/min per visitor) — each call costs
  real money, so it is limited like the payment routes.
- `TemplateBrief::ORG_BAN` mirrors `tools/check-templates.js` `ORG_BAN`; the length bands mirror
  `tools/copy-rules.js` `BAND`. Both are duplicated on purpose: the JS list guards the **static
  catalog**, the PHP list guards the **model's output**.

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

### Social identity cards (Sosial kimlik kartı) — TikTok · Instagram

A visitor pastes a TikTok/Instagram profile link and gets a parody **ID card** — not an A4 sheet.
It rides the normal pipeline (own registry number, QR, 1 AZN publish, PNG/PDF/story) but is a
**third output format** beside `a4()` and `story()`.

**`DOCGEN.kart(doc, opts)` is NOT in `LAYOUTS`.** 1080×1350 canvas, two credit-card-proportioned
faces (ID-1, 85.6×54 mm) stacked — front (photo, handle, platform, three stat tiles) and back
(magnetic stripe, signature panel, seal, QR, barcode, MRZ). Registering it as a 13th layout would
trip the bijection trap (18 new templates); keeping it outside the registry costs nothing.
`kartStory()` is the 1080×1920 variant. **`DOCGEN.sheet(doc)` / `share(doc)` are the only entry
points callers use** — they return `{svg, w, h, kart}` and pick the format from `doc.social`.
`app.js` and `viewer.js` never branch on it themselves.

- **The `inner()` gate does not apply**, so the card draws every parody mark explicitly:
  `kartWatermark()` (`data-wm="1"`), `kartDisclaimer()` (`data-dc="1"`), `seal()`, `microtext()`
  and the MRZ whose optional-data field still reads `PARODIYA`. `tools/check-sosial.js` §7 asserts
  each one across 3 styles × 6 palettes. Removing any of them silently guts the legal shield.
- **Three styles** — `resmi` · `tund` · `sade` (`KART_STILLER`), chosen per template via
  `templates.card_style` and overridable at runtime; in social mode the layout picker becomes a
  style picker. The dark style inverts the disclaimer band and puts a white plate behind the
  barcode — both were illegible otherwise.
- `L_vesiqe` still carries four `doc.social`/`doc.avatar` gates as a **fallback**: a card rendered
  through `a4()` (stale client, `documents.layout` round-trip) still reads as an ID card. Those
  gates and `kart()` are the only things in `doc.js` that read `doc.social`.

**Avatars are `data:` URIs, never external links.** `doc.js` `AVATAR_RE` rejects anything else —
an external `<image href>` would break PNG export (canvas rasterisation drops it) and leak every
viewer's IP to the platform CDN. Verified: a base64 JPEG inside SVG-as-image rasterises and does
**not** taint the canvas, so `toBlob()` still works. Do not add `xmlns:xlink` to the `a4()` wrapper
to support `xlink:href` — that changes every layout's bytes; plain `href` (SVG2) is what is used.

**The data layer is hybrid on purpose, and that is a product decision, not a shortcut.** Verified
2026-08-31 by direct request: TikTok's keyless oEmbed returns **only the display name** (its profile
page is behind a WAF; `node/share/user` 403s), and Instagram has no official path at all since the
Basic Display API shut down on 2024-12-04 — `i.instagram.com/api/v1/users/web_profile_info/`
returns the full set (name, bio, verified, follower/following/post counts, avatar URL) but is
**unofficial and blocked from many hosting IPs**. So `PublicProvider::fetch()` **never throws**:
failure returns `[]`, the fields stay blank and editable, and the card is still built.
`SOSIAL_FETCH=false` disables fetching entirely without changing the UI. Failed lookups are
negative-cached for 5 minutes so a blocked platform is not hammered — expect a fresh handle to look
"empty" for that window.

- Three layers, same split as `AiService`: `Support\Sosial\ProfilUrl` (link parsing, host allowlist)
  · `Support\Sosial\PublicProvider` (HTTP, injectable `callable`, `curl` with `FOLLOWLOCATION` off)
  · `Services\SosialService` (config, cache, moderation, avatar download). The first two are
  framework-free and covered by `tests/logic.php`.
- **`Sosial::sayi()` ↔ `doc.js sosialSayi()` must stay byte-identical** — `12437` → `12,4 K`,
  and `null` is `—`, **not** `0`. If they drift, the PNG the user downloaded and the registry copy
  disagree, which is the one thing the security posture forbids.
- The server owns the block: `social` goes through `Sosial::clean()`, `signOrg`/title/clauses still
  come from the catalog, and `{{username}}`/`{{followers}}` are filled from `Sosial::vals()` on the
  server exactly as questionnaire answers are.
- **Avatar fetch is an SSRF surface**: `SosialService::avatarDataUri()` accepts `https` only, matches
  the host against `sosial.avatar.hosts` by suffix, caps the download, and re-encodes through GD.
- Publish uploads the 256×256 JPEG to `POST /api/documents/{regNo}/avatar`, stored **outside the
  public root** and streamed by `GET /r/{regNo}/avatar.jpg` with a fixed `image/jpeg` + `nosniff` —
  the `devet` OG model. `viewer.js` fetches that **relative** path (not `avatarUrl`, which is built
  from `APP_URL` and can point at a different host) and re-renders the card with the image inlined.

**The card catalog is separate**, exactly like replies: `frontend/sosial.js` defines
`SOSIAL_KINDS` / `SOSIAL_CATEGORIES` / `SOSIAL_CARDS` / `SOSIAL_PARSE` / `SOSIAL_VALS` and
**never pushes onto `CATEGORIES` / `TEMPLATES`**. In the database they are ordinary rows marked by
`categories.is_social`; `CatalogService::payload()` now splits into **six** keys. Note the split is
by **category**, not by `templates.social_kind` — that column may be empty when a card serves both
platforms. Registering `sosial.js` takes the same four edits as `replies.js` and it is deliberately
not loaded by `viewer.html`.

> **Real platform logos are used** (`platformLogo()` in `doc.js`) at the user's explicit direction.
> They are registered trademarks and this is the one place the repo's "no real symbols" rule bends,
> so the compensating limits are enforced by `tools/check-sosial.js` §5: `signOrg` may never contain
> a platform name (`BRAND_BAN`) or a real institution (`ORG_BAN`), and nothing on the card claims the
> platform issued it. The logos live in one table in `doc.js` so switching to invented marks is a
> single-function edit.

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

### The detective case files section (İş qovluğu) — a separate product

`/is` is the second product that shares the backend and nothing else. A visitor pays credits for a
case file, reads its documents on a phone, opens a code-locked box, then names the killer, the motive
and the proving contradiction; the server checks the answer and issues a **spoiler-free** certificate.

The separation is physical, exactly like `devetname`: own routes (`/is/...`, names `dossier.*`), own
layout (`layouts/dossier.blade.php`), own CSS (`dossier.css`), own font set (`dossier-fonts.css`),
own OG image. **`site.css`, `panel.css` and `app.js` are never loaded here**, and unlike the
invitations there is **no link in either direction** — the two products do not know about each other.
`export.js` is the one shared asset (canvas → PNG/JPEG); it carries no brand words.
`tools/check-dossier.js` §5 greps every `dossier*` file **including comments** for
`zarafat · notariat · reyestr · parodiya · znp · quvvesi · palatasi · devetname`.
Note `mohur` is deliberately **not** on that list — the stamp on the case cover is an investigation
stamp, not the other product's parody seal.

**The whole section exists to keep two values on the server.** `dossier_documents.lock_code` and
`dossier_questions.correct_index` are the game; if either reaches the browser the product is over.
Four things enforce that, and none of them is sufficient alone:

- `DossierDocument::$hidden = ['lock_code','content']` and
  `DossierQuestion::$hidden = ['correct_index','explanation']` — a model accidentally passed to
  `toArray()` still leaks nothing.
- The shell page ships **only progress** via `@json` (read/pinned/unlocked ids, attempts, solved).
  Document bodies, suspects, chronology and questions are absent from the HTML until access is paid
  for — they are not hidden, they are not sent.
- `DossierService::renderDocument()` is the only path that turns content into HTML, and it renders
  the **locked** partial (a keypad) when the document has not been opened.
- `tests/security.php` §14 asserts the code and the answers are absent from the served HTML, and
  `tools/check-dossier.js` §4 asserts they are absent from every frontend asset and Blade file.

**The document render layer is AJAX + Blade partials.** `GET /api/is/{slug}/sened/{id}` returns a
ready HTML fragment. A document is **a list of blocks**, not a fixed type: thirteen block partials
live in `resources/views/dossier/bloklar/`, listed in `config/dossier.php` `'bloklar'` —
`tools/check-dossier.js` §2 asserts the config list, the Blade files, `BlokSxemi::BLOKLAR` and
`Qalereya::bloklar()` all agree. The closed keypad lives in `partials/kilid.blade.php` and is
rendered *instead of* the blocks while the document is locked.

> `@include('dossier.bloklar.' . $b['tip'])` would **break `tests/audit.php` §5**, whose regex
> reads the literal after `@include('`. The view name is computed into `$blokView` first, so the
> dynamic include is invisible to that check.

**Document text is never HTML.** `App\Support\Dossier\Metn::inline()` escapes first, then opens
exactly three things: `**qalın**`, `[[qırmızı]]` (the investigator's red pen) and `\n` → `<br>`.
`{{açar}}` substitution runs **last** and escapes its value, so a name containing `**` cannot smuggle
markup. The one raw-HTML exception is the `sxem` SVG, and it goes through `Sxem::temizle()`
(drops `<script>`, `on*=`, external `href`, `foreignObject`, `<image>`, `<use>`) — the content is
trusted today because it comes from the seeder, but the filter is in place for the day an admin CRUD
arrives, because that is the day it would be forgotten.

**Three attempts, and the wrong item is never named.** `Rey::yoxla()` returns `{ok, tam}` and nothing
else; telling the visitor *which* answer was wrong would turn three attempts into a search of the
4 × 4 × 4 space. `tam: false` means the form was incomplete — that does **not** burn an attempt. On
the third wrong verdict `revealed` is set: the explanation opens, the certificate does not.
`throttle:dossier-rey` (6/min) is the network-side half of the same rule, and
`throttle:dossier-kilid` (10/min per visitor, 30/min per IP) is what actually protects a 4-digit
code — the length never could.

**Documents are read in order, and the order is a server rule.** Every sheet ends with a
**«Davam et»** button that opens the next one; a sheet whose predecessors are unread is dimmed
(`.docrow.qapali`, `aria-disabled`) and refuses to open. `DossierService::reachable()` is the gate
and `Api\DossierController::document()` returns **403 `sira`** — the shell's copy of the rule
(`sirada()` in `dossier.js`) is only how the list *looks*, because `/api/is/{slug}/sened/{id}` can
be called directly. `allRead()` is the same idea for the whole folder: the **Şübhəlilər** and
**Cavab** tabs stay locked (`.tab.kilidli`) until every sheet has been passed, and
`verdict()` refuses with 403 **before** `attempts++`, so a shell that does not know the rule
cannot burn the three attempts.

> **A code-locked sheet does not stop the sequence.** `markRead()` marks it the moment the keypad
> renders, so someone who has not yet found the code still reaches the rest of the folder —
> otherwise one puzzle would close the whole story. That is also why the client marks locked
> documents read (it used to skip them) — the two sides must agree or a row looks open and 403s.
>
> `aria-disabled` (not `disabled`) is deliberate: a disabled button fires no click, so the visitor
> would never learn *why* nothing happened. The guard lives in the handler and answers with a
> toast. Playwright treats `aria-disabled` as unclickable, so the tests click those two controls
> with `{ force: true }` — exactly what a real browser does.

**Progress is in the database, never in `localStorage`** — the point is that someone can close the
phone and continue in the morning. The same row holds the clock: `started_at` is written server-side
and `duration_seconds` is computed server-side; the counter in the browser is display only and cannot
change the result. `AccountService::mergeGuestInto()` re-points `dossier_progress` on login — without
that line the `cascadeOnDelete` FK plus the guest-row deletion would silently destroy the progress
(the same latent bug still affects `invites`).

**Payment is `DocumentService::publish()`'s shape.** `DossierService::open()` returns early when
`access_at` is set, so a second call never spends a second credit and the visitor can return to a
case forever. The spend is recorded through `CreditService::spend($user, $price, null, 'İş qovluğu: …')`
— `transactions.document_id` is a hard FK to `documents`, so the case is named in `note`. The intro
case is seeded `price_credits = 0`; everything else costs `config('dossier.price_credits')` (5).

**Both share images are drawn by the browser** — there is no server-side SVG→PNG anywhere in this
repo (`imagick` is absent, GD cannot read SVG), and that is the same decision `devet` and `sosial`
already made. `frontend/dossier-cert.js` builds the certificate SVG and rasterises it through
`ZEXPORT`: a **1080×1920** PNG for `navigator.share`, and a **1200×630** JPEG that is uploaded to
`POST /api/is/{slug}/sertifikat`, stored outside the public root and streamed with a fixed
`image/jpeg` + `nosniff`. The case's own OG image is different — `npm run render:dossier-og` renders
it once at build time into `frontend/dossier-og/{slug}.jpg`, which is committed, so no tool is needed
on deploy.

> **The certificate carries no killer, no motive and no document text.** It is made to be posted to
> a Story, and the person who sees it has not played yet. `tools/check-dossier-flow.js` §8 asserts
> the rendered certificate contains neither the suspect's name nor the motive.
>
> **Font names inside the certificate SVG must stay generic and single-quoted.** The SVG is
> rasterised through `<img>` onto a canvas, which drops `@font-face` faces; and a double-quoted
> family name inside a double-quoted XML attribute makes the whole image fail to load — silently,
> as an `Event` rather than an error.

**Content is database-owned and seeder-fed.** `database/seeders/dossier/*.json` is the source; a
new case is a new JSON file and nothing else — `DossierSeeder` discovers them with `glob()`.
`DossierSeeder` rewrites documents and questions on every run but sets `status`/`sort` only on
insert — the `CatalogSeeder` discipline, so an admin's toggle is never undone. Admin CRUD is
deliberately not built yet; the tables are shaped for it.

There are three cases, **28 documents each**: `2026-0847` («Sədəf» şadlıq sarayı, free, **the one
`showcase`**), `2026-0912` («Şimal» parkı) and `2026-0412` («Xırdalanda sükut», **two lock-coded
files**, difficulty `kabus`). Exactly one case may carry `showcase: true` — the home page's hero and sample
strip come from it, so moving that flag also moves what `tools/check-dossier-flow.js` counts.

> **The 0412 case is where the block system is actually exercised.** It is the only case that uses
> the `kagiz` (paper) and `mohurler` (stamp) layers, and it uses all 13 block types. Its two locks
> are the proof that **the lock is a property, not a type**: one is a `sahe`+`metn` note file, the
> other is three `yazisma` blocks. Its first code opens a **deliberately misleading** document —
> the game has two readings, and that is content, not an engine state; `dossier_progress` still
> knows only `solved` / `revealed`.

**Adding a block type** touches four places: `config/dossier.php` `'bloklar'` →
`resources/views/dossier/bloklar/<tip>.blade.php` → `App\Support\Dossier\BlokSxemi::ACARLAR`
(required/allowed keys) → `App\Support\Dossier\Qalereya::bloklar()` so `/is/qalereya`
demonstrates it. `tools/check-dossier.js` §2 asserts all four agree — and it pins the count at
**13**, so adding one is a deliberate edit, never an accident. A new *document* needs none of
this: it is a new order of existing blocks in the seed JSON.

> Two CSS bugs were inherited from the prototype and fixed on the way in, both worth knowing about:
> `#s-cover{display:flex}` is an **ID** selector and outranks `.screen{display:none}`, so the cover
> never hid — `display` now lives on `#s-cover.on`. And `.dr-name`/`.dr-kind` are `<span>`s inside a
> flex item, so the document kind ran into the name until they were made `display:block`.

### The case-file document is a list of blocks, not a template

A document used to be one of nine fixed `type`s, each with its own Blade file. Those templates
were shaped by the *first* case, and the strain showed immediately: by the second case the
ticket roll and the key logbook were forced into `cedvel` because there was nowhere else to
put them, and `senedler/ekspert.blade.php` had degenerated into a single line —
`@include('protokol')`. A ninth "type" that is a copy of another type is not a type.

**The render layer must not know the story.** It knows blocks; the database supplies the story.
A document is an ordered list of blocks, and a new kind of document is a new *order*, not new
code. Thirteen block types cover everything the two existing cases contained (15 distinct
content keys) plus capabilities nothing had used yet.

```jsonc
{ "page": "2–5", "name": "…", "kind": "Protokol", "sample": true,
  "kilid":    { "nov": "reqem", "kod": "0903", "ipucu": "…" },   // NÖV DEYİL, XASSƏ
  "content": {
    "kagiz":    { "kohnelme": 2, "qat": [0.34], "leke": [ … ] }, // fiziki qat
    "mohurler": [ { "metn": ["AFİB"], "forma": "daire", … } ],   // möhür qatı
    "bloklar":  [ { "tip": "blank" }, { "tip": "basliq", … } ]
  } }
```

**`content` keeps its column name on purpose.** Two existing checks key on the literal string:
`check-dossier.js` asserts `$hidden = ['lock_code','content']` with a regex, and the
"lock code never appears inside content" check reads the same key. Renaming the column to
`bloklar` would have silently disabled both.

**The crest and the round seal are shared components, not dossier code.**
`App\Support\Nisan` ports `doc.js`'s `crest()` and `seal()` geometry — concentric rings, the
rosette guilloche, the ribbon banner, curved ring text — and `<x-gerb>` / `<x-mohur>`
(`resources/views/components/`) wrap it. The text is a parameter, so the same component serves a
different institution; it is used in the letterhead, the ghost watermark and the stamp layer.

- **Two elements were deliberately dropped in the port: the five-pointed star and the laurel
  wreath.** `.claude/promts/fiktiv-qurum-qaydalari.md` forbids the bureau's mark from repeating
  the language of real state symbols, and those two *are* that language. A cut-corner sheet glyph
  takes the star's place; every other part of the design is the original.
- **CSS must not set geometry on these components.** They carry their own `stroke-width` per ring;
  a blanket `.p-mohur svg circle{stroke-width:…}` flattens every ring to one weight and the seal
  stops reading as a seal. The stylesheet supplies colour, position and font family only.
- `<x-mohur>`'s `id` must be unique per page — the arc text binds through `href="#id-u"`, so two
  stamps sharing an id collapse onto the same arc.
- `views/components/` sits outside `views/dossier/`, so `check-dossier.js` scans it explicitly.
  Anything drawn on a sheet is inside the legal shield regardless of which folder it lives in.

**Signatures are drawn, not typeset.** `App\Support\Dossier\Imza::yol()` is a faithful port of
`doc.js signature()` — FNV-1a hash → LCG → five cubic segments → the tail that hooks back left —
and it produces a **byte-identical** path string for the same name, so both sections' signatures
come from one hand. The name only seeds it: the scrawl is illegible, and the printed
`(A.Soyadov)` under the rule is what says who signed. Never use `rand()` here — a signature that
changes when the sheet is reopened announces the document as fake.

**The sheet's furniture is not a block.** A document has to *read* as an official form, so the
wrapper draws the apparatus every sheet shares: a **microtext border** (the fiction notice repeated
at 3.6px along the top and bottom edges), a **double frame**, the **ghost crest**, the **form line**
(`Forma № AFİB-NN · İş № … · Vərəq …`) and the fiction notice as a **dark band**. The `blank` block
draws the letterhead itself — crest, institution name in letterspaced caps, sub-lines, double rule
and the three-column intake row whose centre is a blue `QEYDƏ ALINIB` stamp. The structure is
lifted from the zarafat side's blanks, which is where this repo already solved "make it look
issued"; only the palette and the issuing body differ.

- `imza` renders a real signature: the handwriting face on a **signature rule**, with the printed
  name in parentheses under it — a name floating in white space reads as a caption, not a signature.
- `partials/mohur.blade.php` is **SVG, not a CSS box**: real stamps curve their text around the
  ring, and `border-radius` cannot do that. The ring font size is *computed*, not chosen — the top
  arc is π·33 ≈ 104 units and a monospace advance is 0.6em, so 23 characters need ≈6.2px. Setting
  it by eye overflowed the arc and turned the stamp into an unreadable smudge.
- **`.paper > *:not(.kagiz-qat):not(.p-mohur):not(.p-qat)` is load-bearing.** That rule lifts
  content above the paper layers, and it outranks `.p-mohur{position:absolute}` — a stamp left in
  the list silently loses its `--x/--y` and drops to the bottom of the sheet. Any new absolutely
  positioned layer must be added to that `:not()` chain.
- The `.p-head` **class is a contract**, not a style: `check-dossier-flow.js` counts it and
  `tests/security.php` reads its text. It is now a wrapper around the masthead lines; keep the
  class even when the visual moves to its children.

**The mechanical gate survived the rewrite.** `sened.blade.php` is still the single wrapper
every document passes through, so the AFİB notice, the paper layer and the stamp layer live
there and no block type can escape them — the same argument as `inner()` in `doc.js`, now with
thirteen ways to forget instead of nine.

> **The dynamic include must stay a variable.** `@include('dossier.bloklar.' . $b['tip'])`
> would break `tests/audit.php` §5, whose regex reads the literal after `@include('`. The view
> name is computed into `$blokView` first, so the audit skips it.

**The lock is a property, not a type.** Any block composition can be locked — a table, a chat,
a scheme. `dossier_documents.lock_kind` (`reqem` · `soz` · `tarix`) picks the puzzle's shape,
and the locked document's blocks are still never sent to the browser.

**Scheme markers are data, not SVG.** `Sxem::nisanla()` injects numbered points, dimension
lines, direction arrows and a north mark into the SVG at render time, using the SVG's own
`viewBox` coordinates. They were baked into the drawing before; moving them out means one
scheme can carry different marks at different stages of a case. Both existing schemes were
converted.

**Damaged text is markup, not geometry.** `Metn::inline()` gained `++əl ilə++`, `~~üstündən~~`,
`((oxunmaz))` and `%%söz%%` on top of the existing three. The prompt asked that the data say
*which block and which word* a margin note attaches to: the block is named by the block's own
`kenar` key, and the **word** is marked inline — a word index would drift the moment someone
edits a sentence, whereas a marker travels with the word. Note `((…))` needs double parens
precisely so ordinary text like `(on iki min)` is untouched.

**Three heavy physical effects, maximum.** `leke · cirilma · kseroks · kohnelme ≥ 2` are the
heavy ones; a fourth makes a sheet where nothing reads as deliberate. This is a **validator
error**, not a warning — a design rule that only lives in a comment is a rule that erodes.

**Everything physical is CSS and SVG** — no image files, because the sheet has to stay sharp at
every size and its text has to stay selectable. The grain pattern is the four-line SVG lifted
from `doc.js` `defs()`; the fold, stain, tear, xerox, fingerprint and paperclip effects are
gradients, `clip-path`, filters and one shared `feTurbulence` in the layout.

**The validator runs before the database, not after.** `App\Support\Dossier\BlokSxemi` is the
framework-free twin of the JS rules in `check-dossier.js`, mirroring `TemplateSchema`: it
**collects** errors instead of throwing, numbers them by position (`«2–5» · blok 4 (cedvel): …`),
`continue`s past an unknown type so one mistake does not cascade, and `break`s inside list loops
so a bad table produces one message rather than forty. `DossierSeeder` refuses to load a file
with any error — a half-loaded case is worse than an unloaded one. Unknown keys are errors too,
so a typo surfaces instead of vanishing. The one warning is handwriting length: the `elyazma`
block is for short text and says so, but it does not stop a seed.

**The gallery is where block types are proven.** `/is/qalereya` shows every block, every
handwriting character, every paper effect, every stamp variant and every lock kind, each beside
its JSON snippet. The route is **registered only in `local`/`testing`** — in production the
address does not exist and returns 404, which is stronger than a password nobody will rotate.
`check-dossier.js` asserts every configured block type appears there, so a new component that
is not demonstrated fails the suite.

**Handwriting: two families, four characters.** Only two `@fontsource` handwriting families
carry the full Azerbaijani alphabet — Caveat and Bad Script (`marck-script` and `yeseva-one`
fail on `Ə`, `pacifico` is a retro brush unfit for a case file). The four characters
(`sakit · telesik · yasli · esebi`) are therefore two families plus slant, tracking and size.
Caveat is subset with `--layout-features=kern,liga`: `calt` alone costs 21 KB and its benefit —
automatic variation between repeated letters — is invisible in a one-line margin note.

### The case-file section's fictional bureau (AFİB)

The governing document is `.claude/promts/fiktiv-qurum-qaydalari.md`, kept verbatim for
provenance. It applies to **`/is` only** — see the last point below.

**Why a fictional bureau exists at all.** This product's entire value is that it imitates the
visual language of official paperwork convincingly. The better the imitation, the greater the
chance a screenshot circulates *without* the site around it and reads as a real police
document. Therefore the fiction has to be legible **on the artefact itself**, not merely on
the page that frames it. An audit found the section had exactly that hole: the game cover, the
site footer, the presentation page and the terms page each carried a fiction notice, but a
**rendered document carried none**, and it escaped the shell in three places — the public
`index, follow` landing page (hero + sample sheets), the AJAX document panel (cover already
hidden), and the shared certificate page, which did not even include the footer partial.

**The institution.** `App\Support\Dossier\Byuro` — `AZƏRBAYCAN FİKTİV İSTİNTAQ BÜROSU`
(`AFİB`). Every masthead, seal, rank and case number belongs to it. Displayed case numbers
carry the code (`AFİB-2026/0847`); the URL slug and the OG filename stay numeric, so routes,
tests and image paths are untouched.

> **AFİB is not the product's brand.** It is the in-world issuing body. The product's own name
> is still undecided and lives in `config('dossier.brand')`. Keeping them separate is what lets
> either be renamed without touching the other.

**Why the notice text is a class constant, not config.** `config()` can read `.env` and a
future admin panel could blank it. A legally required sentence must not sit anywhere a person
who is not editing code can change it. `config/dossier.php` *references* the constant, so
there is still one source. `tests/logic.php` asserts the wording literally — `App\Support` is
framework-free, so the file is simply `require`d.

**The mechanical gate.** `resources/views/dossier/sened.blade.php` is the single wrapper every
document passes through (`DossierService::renderDocument()` renders nothing else), so the
notice band lives there and carries `data-fq="1"`:

```blade
<div class="p-fiktiv" data-fq="1">{{ \App\Support\Dossier\Byuro::QEYD }}</div>
```

This is the same reasoning as `inner()` in `doc.js` ("no layout can render without the
watermark and the disclaimer — even if whoever wrote it forgot"). There are nine document
types today and there will be a tenth; a rule written per type is a rule someone forgets, and
a rule written in the wrapper is a rule nobody *can* forget. The locked keypad screen gets the
band too — it is a fictional artefact as well.

**The share artefacts are listed separately on purpose.** The certificate page, the 1080×1920
story PNG, the 1200×630 OG JPEG and the per-case OG image all live *outside* the site, so the
notice has to be **inside** each of them. `check-dossier.js` §3c asserts that for all four.

**Two guards, because they fail in opposite directions.**

- *Issuing body — positive assertion.* `cover.org[0]` must **equal** `Byuro::AD`, `paperHead`
  must carry `AFİB`, `no` must start with `AFİB-`, the seal must contain `FİKTİV`. A blacklist
  fails **open** on the phrasing nobody predicted; an equality check fails **closed**.
- *All other text — a narrow blacklist.* `config('dossier.org_ban')` holds only multi-word,
  unambiguous phrases (`polis bölməsi`, `daxili işlər`, `ədliyyə mayoru`, …). Banning the bare
  word `polis` would make ordinary prose impossible ("polis çağırıldı") and the check would be
  routed around within a week.

> **The uppercase trap.** The zarafat side's `ORG_BAN` compares with case-sensitive `indexOf`
> against fragments like `Polis` — that list would **not** have matched this section's
> `POLİS BÖLMƏSİ`. The dossier list is therefore stored ASCII-folded and compared through
> `check-dossier.js`'s existing `fold()` (`'İ'.toLowerCase()` is two code points and JS's `i`
> flag does not match `İ`).

**`qaydalar.blade.php` is exempt from the blacklist, and that is not a hole.** Its whole job is
to name the institutions it disclaims ("…heç bir real polis bölməsi, nazirlik, prokurorluq …
ilə əlaqəli deyil"), so the forbidden words must appear there. The file is instead checked
**positively**: it must contain the denial and reference `Byuro::AD`.

**Real city names stay** (Xırdalan, Sumqayıt). The rule protects institutions, not geography;
fiction set in a real city is ordinary, and the streets, venues and addresses are invented
anyway. Ranks were the real problem and were replaced: `ədliyyə leytenantı`/`mayoru` and
`Məhkəmə-tibb eksperti` are actual state titles, so they became `AFİB müstəntiqi`,
`AFİB bölmə rəisi`, `AFİB tibbi eksperti`. Civilian roles ("Obyektin sahibi", "Mühafizəçi",
"İzahatı verən") were left alone — they are not institutions.

**Why this does not extend to the other two sections.** The zarafat side already has an
equivalent shield built for a *different* fiction — the invented ZNP crest, the
`ƏYLƏNCƏ MƏQSƏDLİDİR / PARODİYA` seal, the `HÜQUQİ QÜVVƏSİ YOXDUR` band and its own `ORG_BAN`
(see "Non-negotiable design invariants"). Stamping `FİKTİV OYUN SƏNƏDİ` onto a parody notarial
deed would say the wrong thing and weaken both shields. The invitations section is for real
weddings and no investigative disclaimer belongs there at all.

**The bureau's mark must not resemble a state emblem.** The AFİB monogram is a cut-corner sheet
outline inside a thin circle with the letters `AFİB` — no star, crescent, flame, wreath or
crest shield. Same discipline as the invented `ZNP` monogram on the other side.

### The case-file section's sales face

The section has three faces and each earns its keep:

| route | name | indexed? |
|---|---|---|
| `/is` | landing — hero, how-it-works, catalog, sample sheets, price, FAQ | **yes** |
| `/is/{slug}` | one case's presentation — no spoilers, stats, material names | **yes** |
| `/is/{slug}/qovluq` | the game itself | no |
| `/is/{slug}/hesabat/{token}` | shared certificate | no |
| `/is/qaydalar` | terms + privacy | yes |

**Indexing was deliberately reversed here.** The section used to be wholly closed —
unconditional `noindex` plus `Disallow: /is/` — because that rule was copied from
`devetname`, where the reason is privacy (a guest's address and phone). A case-file catalog
is not private, it is the thing being sold, and a sales page nobody can find is not a sales
page. The layout now reads `@yield('robots', 'noindex, nofollow')`, the two sales pages
override it, and `robots.txt` disallows only `/is/*/qovluq` and `/is/*/hesabat/`.
`tests/security.php` §14 asserts **both directions**: the game is closed and the landing is
open — a future `Disallow: /is/` would silently un-list the product.

**The landing shows real documents, rendered by the site's own render layer.** The hero sheet
and the sample strip are not images: `DossierService::renderPublic()` renders them through
the same Blade partials the game uses, with a **transient** `DossierProgress` that is never
saved. That method is the only path that skips the access check, and it refuses anything not
flagged `is_sample` — so a mistyped document id cannot make a whole case free.

> **Which documents may be samples is a content invariant, not a taste call.** Each seed file
> flags its two decisive documents with `"key": true` — the pair whose contradiction solves
> the case — and `tools/check-dossier.js` §3b asserts no `key` document is also a `sample`.
> Without that flag the rule would live only in the author's head, and the first case added
> by someone else would give the answer away for free.

**The landing renders the LAST question, never the first.** The third question's options are
*document names*; the first question's options are the four suspects' names. Rendering the
first would put the free case's entire suspect list on the home page. The controller uses
`questions()->reorder('sort','desc')` — plain `orderByDesc()` would be appended as a
*secondary* key behind the relation's own `orderBy('sort')` and silently return the first
question. `check-dossier.js` §3b asserts the last question's options contain no suspect name.

**Statistics are derived, never stored.** `Dossier::stats()` counts `dossier_progress`
(`plays` = rows with `access_at`, `firstTry` = solved-on-attempt-1 over all solved) behind a
10-minute cache. `firstTry` divides by *finished* players only — including those still
playing would make the number sag over time for no reason. `config('dossier.stats.min_plays')`
hides the block below a threshold; it is `0` today by the owner's choice, and it is a config
value precisely so that changing that decision is one number.

**Badges come from `dossiers.badge`**, whitelisted by `config('dossier.badges')` and labelled
by `badge_labels` — never hard-coded in Blade. `badges` and `difficulties` are separate whitelists
that happen to share the `cetin` / `kabus` slugs; a new tier must be added to **both** or the
ribbon silently disappears while the difficulty still shows. Catalog filters render only when there
are more than three cases (there are three today, so they stay hidden), and they filter client-side
over `data-` attributes.

**The section's name and logo are temporary.** `config('dossier.brand')` is the single place
it appears; `check-dossier.js` §6 asserts no Blade file contains the string, so renaming is a
one-line change.

### The case-file section at three sizes

`dossier.css` is phone-first (`min-width` queries) — the opposite of `site.css`, which is
worth knowing before editing it. Two breakpoints, and both numbers are the sum of their parts
rather than a fashion:

- **720px** = paper 620 + 2×50 gutter. Portrait tablet (768) and landscape phone both land
  here, which is right: both want one column with wider margins.
- **1080px** = `--rail 300` + 24 + `--paper-w 700` + 2×28. iPad landscape (1024) deliberately
  stays on the tablet layout — at 1024 the two-pane split would squeeze the paper to a zero
  gutter, and "paper stays paper" is the rule that would break first.

There is no third breakpoint. Above 1080 the columns are fixed and the surplus is desk.

**The two-pane desktop view needed no JavaScript.** `go(id)` still marks exactly one screen
`.on`; the other half of the pair is opened by CSS:

```css
#main:has(#s-index.on) #s-doc,
#main:has(#s-doc.on)   #s-index{display:block}
```

Specificity (3,1,0) clears `.screen{display:none}` and `.screen.on`, and never touches
`#s-cover.on`. Where `:has()` is unsupported the desktop degrades to the phone's
one-screen-at-a-time navigation — old behaviour, not breakage. The tab bar moves to the top
by flex `order` on the same single `<nav>`; duplicating the markup would have split the click
handler and the tab order.

> **The `ch` trap.** IBM Plex Mono's advance is 600/1000 em, so `1ch = 0.6em` exactly and
> `ch` is a literal character count. But `ch` resolves against the element's **own**
> `font-size`, and `.paper` declares none — it inherits 16px from `body`. A `max-width` in
> `ch` written on `.paper` computes at `1ch = 9.6px` and overshoots by 18%. The measure
> therefore lives on `.p-body`, `.p-note`, `.ev-d`, `.calls` and `.lock-s`, each of which
> declares its own size. Measured: 45.9 characters on phone, 68.1 on tablet, 72.0 on desktop —
> `npm run test:dossier-sizes` asserts under 80 at all three.

**Alibi bars share one time axis on desktop.** `subheliler()` emits `.sus-bio` / `.bar` /
`.bar-l` / `.sus-cam` as siblings instead of wrapping them in `.sus-b`, because the bar must
be placeable independently of the biography text. Each `.sus` is then a two-column grid with
the same column definition, so column 2 starts at the same x in every card — a shared axis
without `subgrid`. The time labels render once, under the last bar, where they read as the
axis legend.

> **The axis labels come from `dossiers.axis`, not from the code.** They used to be the
> literals `23:30 / 00:30 / 01:30` inside `dossier.js`. On a per-suspect bar that is a
> repeated caption; on a shared axis it *is* the axis definition — and the second case's night
> runs 22:30–02:30. Hard-coded, it would have been silently wrong.

**Two prototype CSS bugs were fixed on the way in**, both worth knowing because they look
correct until a wide screen: `.stamp` was positioned against `.frame` and flew to the right
edge once the frame went full-width (it is now anchored to a centred `.cov`), and the
520px phone-mockup rule — 26px radius plus a `0 30px 80px` shadow — was deleted outright.

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
- **Palette labels/swatches**: `doc.js` `PALETTES` ↔ `app.js` `PAL_LABEL` / `PAL_SWATCH`
  ↔ `config/zarafat.php` `palette_meta` (admin panel only — name + the three swatch colours).
- **Layout labels**: `doc.js` `LAYOUT_NAMES` ↔ `config/zarafat.php` `layout_meta` (admin panel
  only — Azerbaijani name, the type word the layout prints, and the title tail words mirrored from
  `tools/copy-rules.js` `DOC_TYPE`). Neither meta map is a whitelist: `Sanitizer::pick` still reads
  `layouts` / `palettes`, and a slug missing from the meta simply falls back to itself.
- **AI guard lists**: `tools/check-templates.js` `ORG_BAN` ↔ `App\Support\Ai\TemplateBrief::ORG_BAN`;
  `tools/copy-rules.js` `BAND` ↔ that class's `TITLE_MIN`…`POWER_LINE` constants and `DOC_TYPE`
  ↔ `config/zarafat.php` `layout_meta.tail` (which is what the prompt actually sends).
- **Counts (216 / 18 / 12 / 6 / 2)**: asserted literally in `tools/check-templates.js`,
  `tools/check-doc.js`, `tools/dist-check.js`, `tools/e2e.js`.
- **Reply intents**: `frontend/replies.js` `REPLY_KINDS` ↔ `App\Support\ReplyKinds` (`KINDS`,
  `LABELS`, `PREFIX`, `VERDICT` — all four keyed in the same order, locked by `tests/logic.php`)
  ↔ the `KINDS` card list hard-coded in `frontend/viewer.js` (the viewer never loads the catalog).
- **Chain topic**: `DocumentService::topicOf()` ↔ `app.js` `catOfDoc()` — both must read
  `reply_topic` first and fall back to the template's own category.
- **Reply counts (71 / 6 / 6)**: `tools/check-replies.js` and `tools/dist-check.js`.
- **Social platforms**: `frontend/sosial.js` `SOSIAL_KINDS` ↔ `backend-php/config/sosial.php`
  (`platforms` · `names` · `hosts`) — `tools/check-sosial.js` §2 compares them element by element.
- **Follower formatting**: `doc.js` `sosialSayi()` ↔ `app.js` `sosialSayi()` ↔
  `App\Support\Sosial\Sosial::sayi()` — three copies, asserted equal by `tests/logic.php`.
- **Profile link parsing**: `frontend/sosial.js` `SOSIAL_PARSE` ↔ `App\Support\Sosial\ProfilUrl`.
- **Card styles**: `doc.js` `KART_STILLER` ↔ `templates.card_style` values in `frontend/sosial.js`.
- **Invitation whitelists**: `frontend/devet-designs.js` ↔ `backend-php/config/devet.php`
  (`designs` · `events` · `palettes` · `motifs` · `styles`) — `tools/check-devet-designs.js` §6
  compares them element by element.
- **Invitation counts (11 events / 33 designs / 12 palettes / 7 motifs)**: asserted in
  `tools/check-devet-designs.js`.
- **RSVP values**: `App\Support\Devet::RSVP` ↔ `config/devet.php` `rsvp` ↔ the `CAVAB` list in
  `frontend/devet-view.js`.
- **Crest / seal geometry**: `frontend/doc.js` `crest()` + `seal()` ↔ `App\Support\Nisan`
  (`gerb()` / `mohur()`), and **signature**: `doc.js` `signature()` ↔ `App\Support\Dossier\Imza`
  — the last pair is asserted identical by producing the same path string for the same seed.
- **Case-file block types**: `config/dossier.php` `bloklar` ↔ the Blade files in
  `resources/views/dossier/bloklar/` ↔ `BlokSxemi::BLOKLAR` ↔ `Qalereya::bloklar()` —
  `tools/check-dossier.js` §2 compares all four and pins the count at 13.
- **Case-file difficulty labels**: `config/dossier.php` `difficulties` ↔ `difficulty_labels`.
  Both `dossier/ana.blade.php` (the filter chips) and `dossier/teqdimat.blade.php` read the label
  map **from config**, so adding a tier (`asan · orta · cetin · kabus`) is a config-only change.
- **Attempt count**: `config('dossier.attempts')` is read by `DossierProgress::attemptsLeft()` and
  by nothing on the client — the browser only displays what the server reports.
- **Case-file badges**: `dossiers.badge` ↔ `config('dossier.badges')` whitelist ↔
  `badge_labels` — `tools/check-dossier.js` §3b asserts every seeded badge is on the list.
- **Case-file breakpoints**: `frontend/dossier.css` `720px` / `1080px` ↔ the viewport list in
  `tools/check-dossier-sizes.js` — the test checks both sides of each boundary.
- **Alibi axis labels**: `dossiers.axis` (seed) ↔ `dossier.js` `subheliler()` ↔ the
  `bars` percentages in `dossiers.suspects`, which are percentages *of that window*.
- **The fiction notice**: `App\Support\Dossier\Byuro::QEYD` ↔ `config('dossier.bureau.notice')`
  (a reference, not a copy) ↔ the literal string in `frontend/dossier-cert.js`, `dossier.js` and
  `tools/render-dossier-og.js` — the JS copies cannot import the constant, so
  `tools/check-dossier.js` §3c asserts each file carries it.
- **Banned institution phrases**: `config('dossier.org_ban')` (ASCII-folded) ↔ the `fold()`
  comparison in `tools/check-dossier.js` ↔ the uppercase list in `tests/security.php` §14.
- **Block types**: `config('dossier.bloklar')` ↔ `App\Support\Dossier\BlokSxemi::BLOKLAR` ↔
  the Blade files in `resources/views/dossier/bloklar/` ↔ `Qalereya::bloklar()` —
  `tools/check-dossier.js` §2 compares all four.
- **Block validation rules**: `App\Support\Dossier\BlokSxemi` ↔ the JS twin in
  `tools/check-dossier.js`, the same deliberate duplication as
  `TemplateSchema` ↔ `check-templates.js` §5.
- **Inline text markers**: `App\Support\Dossier\Metn::inline()` ↔ the `.elavesoz` /
  `.ustxett` / `.oxunmaz` / `.dairesoz` rules in `frontend/dossier.css`.
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
