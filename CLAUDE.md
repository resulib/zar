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
npm run test:bolme       # bölmə açarları: bağlı bölmə 404, admin istisnası, kök heç vaxt
                         #   404 vermir (php artisan serve --port=8099 lazımdır)
npm run test:oauth       # giriş yolları uçdan-uca: Google OAuth (öz saxta Google-u :8094-də
                         #   qaldırır), avtomatik qonaq qeydiyyatı, hesab birləşdirmə, açıq
                         #   yönləndirmə — backend GOOGLE_TOKEN_URL ilə :8093-də (fayl başlığına bax)
npm run test:sosial      # 6 sosial kimlik kartı: ağ siyahılar ↔ config/sosial.php, hüquqi qalxan, render
npm run test:sosial-flow # sosial kart redaktoru uçdan-uca (php artisan serve --port=8099 lazımdır)
npm run test:dossier     # iş qovluğu: seed sxemi, 9 sənəd növü ↔ Blade, sirr və brend sızması
npm run test:dossier-flow # iş qovluğu uçdan-uca, real brauzerdə — TELEFON (php artisan serve --port=8099)
npm run test:dossier-sizes # 412 / 820 / 1440: sətir uzunluğu, iki panel, kataloq şəbəkəsi
npm run test:mustentiq   # müstəntiq profili: rütbə əyrisi, şöbələr ↔ org_ban, XP düsturunun
                         #   JS əkizi, vəsiqə nömrəsi, qurulma zənciri, hüquqi qalxan
npm run test:mustentiq-flow # profil uçdan-uca: qeydiyyat → şöbə → nişan → kart → PNG →
                         #   reytinq → gizlilik → 412/820/1440 (serve :8099)
npm run test:dossier-admin # iş qovluğu redaktoru uçdan-uca: yeni iş → sənəd → şəkil → nişan →
npm run test:dossier-ai  # «AI ilə iş qur» — öz saxta OpenAI serverini qaldırır (:8097);
                         #   backend OPENAI_ENDPOINT onu göstərməlidir (fayl başlığına bax)
                         #   önizləmə → kod → şübhəli → sonluq → dərc → oyunçu (serve :8099)
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
insert — the `CatalogSeeder` discipline, so an admin's toggle is never undone.
**Admin CRUD now exists too** — see "The case-file admin" below. The seeder is still the way the
three shipped cases are defined, and the two paths coexist: the seeder never writes a column the
admin owns (`status`, `sort`, a code's `label`/`hint_note`).

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

### The case-file admin (`/admin/qovluqlar`)

A case used to be a JSON file and nothing else. It still can be — but there is now a full editor,
and the two paths were made to coexist rather than compete.

**Three screens.** `admin/dossier/index` (list: name · difficulty · status · document count · image
count · last change, with edit / preview / duplicate / archive / delete), `admin/dossier/form` (the
case, **five tabs**), `admin/dossier/sened` (one document, two columns).

**The five tabs map to the game's screens, not to the tables**: *Ümumi* (catalog card and sales
page) · *Sənədler* (the reading order, plus the code registry) · *Şübhəlilər* · *Hekayə*
(meta lines, chronology, alibi axis, solution) · *Cavab* (the two ending mechanics). Each tab
opens with one sentence saying where in the game its content appears, and the tab labels carry
counts — the panel's first version was a stack of seven forms with no indication of which one
reached the player.

> **The `Cavab` tab states which mechanic is live.** Both are present and the choice is derived
> (endings exist → suspect selection), so without that line an admin cannot tell whether the
> questions below are still doing anything.

**Everything the seed files contain is now editable.** The first version shipped an admin that
could not show a finished case: suspects lived in the `dossiers.suspects` JSON column, and
chronology, meta, axis, solution and the questions had no editor at all — so the culprit of an
existing case was invisible in the panel that is supposed to author it.

- `DossierSeeder` now also writes `dossier_suspects` rows from the JSON. `suspectList()` prefers
  rows, and the imported rows reproduce the JSON **byte for byte**, so `dossier.js` and the
  shared alibi axis are untouched (`check-dossier-admin.js` §4b asserts this).
- **The culprit is derived from question 1.** The seed has no culprit flag, but in all three
  cases the first question's options are the suspects' names in the same order and `correct`
  points at the killer. If that correspondence ever fails, nobody is flagged — guessing wrong
  would be worse, and `QovluqYoxlayici` reports the missing flag anyway. Written **only on
  insert**, so an admin's later correction survives re-seeding (`CatalogSeeder` discipline).
- Chronology and meta are edited as `ad | dəyər` lines, solution as blank-line-separated
  paragraphs — the `decodeList()` decision from `CatalogController`: an admin should not be
  counting brackets.

> **A code with no `source_document_ids` is a note, not an error.** It began as an error and
> that made all three shipped cases unpublishable — the seed simply does not record which
> sheets a code is assembled from. Filling it in is what arms the digit check, so the note says
> exactly that.

**A document now has a `body`, and the render layer has three branches.** `dossier_documents.body`
is longText; when it is empty the old block loop runs, byte-for-byte as before — which is why the
84 shipped documents and every existing test are untouched. When it is filled, `SenedRender` walks
the text and `sened.blade.php` prints the returned HTML. The wrapper — microtext border, guilloche,
ghost crest, paper layer, stamp layer, `.p-fiktiv` band — is **outside** that branch, so the
mechanical gate covers all three paths (locked keypad · text · blocks).

**Tags carry a prefix, and that is not cosmetic.** `{{ sekil:kamera-01 }}` and
`{{ blok:zeng-cedveli }}`. `Metn::fill()` already owns `{{açar}}` for value substitution
(`{{mustentiq}}` → the player's name) and matches with `str_replace('{{' . $k . '}}')` — **exact,
no spaces**. The prefixed, spaced form therefore cannot collide with it, and both systems share the
same braces without eating each other.

- `App\Support\Dossier\Isare` is the parser and is framework-free (`tests/logic.php` loads it
  directly). It splits with `preg_split(..., PREG_SPLIT_DELIM_CAPTURE)` — **never** `preg_replace`
  with a string right-hand side, because `$$`, `$&` and `$'` in the document text would be eaten.
  (The same trap bit this section's own JS during development: a `String.replace` in a build script
  turned `$$('.end-s')` into `$('.end-s')`.)
- `App\Services\SenedRender` is the Blade-calling half; it lives under `app/Services/` because
  `app/Support/` must stay framework-free.
- A block is addressed by an **`acar`** key, not `ad` — `ad` is already the heading text of
  `basliq` and the signer's name in `imza`. `BlokSxemi` allows `acar` on every block alongside
  `tip` and `kenar`.
- A missing tag renders as **nothing** for the player and as a red `.p-xeta` block in the admin
  preview. Hiding it from the admin would mean finding the typo late; showing it to the player
  would make an unfinished edit look like a crash.

**Six image styles, and images are not blocks.** `camera_still · scan · plan · micro · photo ·
generic` live in `views/dossier/sekiller/` and are whitelisted in `config('dossier.sekil_novleri')`
↔ `BlokSxemi::SEKIL_NOV`, checked by `tools/check-dossier.js` §7. They are deliberately outside
`config('dossier.bloklar')` — §2 pins that count at **13** and a seventh image style must not move it.

**Image files are the `devet` OG model, one level stricter.** `storage/app/dossier/sekil/{id}/`,
names are 32 random hex characters (a filename must never hint at content — a directory listing
would be a spoiler), three JPEG derivatives (original · 1200 · 300) re-encoded through GD so
anything embedded in the upload is dropped, transparency flattened onto **white** so a PNG floor
plan does not come back black. Served by `GET /is/{slug}/sekil/{id}/{olcu}` with a fixed
`image/jpeg` + `nosniff`.

> **`DossierService::imagePath()` is three gates and answers 404, never 403.** The image belongs to
> this case · either it is a sample document's image (free) or the case is paid for · if its owner
> document is locked, the code has been entered. An "access denied" message is itself the spoiler:
> it confirms a sheet the player has not reached yet exists. An image with **no** owner requires
> payment, otherwise walking the id sequence would expose the whole library for free — which is why
> the editor sets `owner_document_id` to the document being edited on upload.

**Codes moved to a registry, but `lock_code` is still the authority.** `dossier_codes` holds what
the admin needs (a name, a private note, and `source_document_ids` for validation) and
`dossier_documents.unlock_code_id` points at it — but saving **denormalises `code` onto
`lock_code`** (the `reply_topic` pattern). That is what keeps `unlock()`'s `hash_equals`, the
`$hidden` shield and every existing test untouched. `unlock_code_id` has **no database FK**: adding
one to an existing SQLite table rebuilds it, so the link is broken in the controller instead.

**Suspects: the JSON column is the wire format, the table is the editing surface.**
`dossiers.suspects` still feeds `/api/is/{slug}/ac` and `dossier.js subheliler()`, whose alibi bars
share one time axis. `Dossier::suspectList()` builds the *same shape* from `dossier_suspects` when
rows exist and falls back to the JSON when they do not — so `dossier.js` never learned about the
change and the three shipped cases were not migrated.

**Draft logic.** Editing a **published** case writes to `draft_body`; the player keeps seeing
`body` until "dərc et" copies it over. In a draft case saving writes `body` directly — nobody is
reading it and two fields would be ceremony. The document list shows a yellow dot per pending
draft and `QovluqYoxlayici` reports it as a note.

**`QovluqYoxlayici` is `BlokSxemi`'s sibling**: framework-free, **collects** errors instead of
throwing, Azerbaijani messages, two levels. *Error* blocks publishing (a lock with no code, a case
with no culprit, a true ending that is not the culprit's, an unresolvable tag, a duplicate sheet
number); *note* is information only (an unused image, a blank sheet number, an unpublished draft).

> **The code check looks for individual digits, not the whole code.** Demanding the literal code
> appear in its source sheets would be exactly backwards — `check-dossier.js` §3 requires the code
> **not** to appear in `content`, because assembling it is the puzzle. Per-digit is a weak check
> that still catches the mistake people actually make: pointing at the wrong source sheet.

> **Sheet numbers are always strings.** «14» looks numeric and PHP silently casts it to `int` as an
> array key, so `'14'` and `14` collide. The validator keeps numbers in lists, never as keys.

**Two Blade traps this screen walked into**, both worth knowing:
- `data-nisan="{{ '{{ sekil:' . $s->slug . ' }}' }}"` **does not parse** — Blade stops the
  expression at the first inner `}}`. The tag is built in PHP (`Isare::yaz()`) and echoed as a
  variable. Help text that shows the syntax lives inside `@verbatim`.
- A `<form>` cannot be split across `<td>`s or nested in another `<form>`; the browser drops it
  silently and the button does nothing. Every form on these screens is declared standalone and
  bound to its fields with the `form=""` attribute.

**Deleting a draft is a hard delete (`forceDelete`), and that is forced by the schema.**
`dossiers.slug` carries a database-level UNIQUE index that sees soft-deleted rows too, so a
mistyped-and-deleted case would occupy «2026-0501» forever. The `Rule::unique` in the controller
therefore does **not** add `whereNull('deleted_at')` — validation must not be looser than the index,
or the check passes and the INSERT 500s. A **published** case is never deletable: `dossier_progress`
would cascade and take real players' progress and certificates with it.

**The preview is an `<iframe>`, and that is not a nicety.** `dossier.css` is the *game's*
global stylesheet: it writes `*`, `body` and `:root`. Loading it into the admin page (which is
what the first version did, through `@stack('head')`) turns the whole panel black, restyles
every form control and outranks `panel.css` — and the file cannot be scoped, because it belongs
to the game. A separate document is the only isolation that keeps the preview **identical** to
what the player sees; a second, simplified renderer would drift from the real one within a week.

> **The injected style must cancel `body{display:flex}`.** In the game the sheet lives inside
> `.frame`, a fixed-width phone column, and body-flex centres it. With no frame the wrapper
> becomes a flex item, shrink-to-fits to `max-content`, and the microtext border — one line,
> `white-space:nowrap`, the fiction notice repeated 14 times — drags the sheet to ~1660px inside
> a 520px iframe, clipping the text on **both** edges. `check-dossier-admin.js` §5 measures
> `scrollWidth` against `clientWidth` so this cannot come back.

> The iframe document also carries the `#kagizLeke` turbulence filter, which is global in
> `layouts/dossier.blade.php` and is the only shared piece of the physical-effect layer.
> Height is measured from the content a few times after writing, because the subset fonts
> arrive late and change the line count.

> **The stylesheet hrefs are root-relative, not `asset()`.** `asset()` builds from `APP_URL`,
> which is `http://localhost:8000` in the shipped `.env` — an admin working on `127.0.0.1:8000`
> then makes the iframe request its stylesheet from a *different* origin, the load fails
> silently, and the sheet renders as a black rectangle. This is the same rule `viewer.js`
> already follows for the avatar (relative path, never `avatarUrl`).
> `check-dossier-admin.js` §5 reads the computed `.paper` background rather than trusting the
> markup — a missing stylesheet is invisible in the DOM.

**This screen breaks out of the panel's width.** `site.css` `--max` is 1180px, which is right
for reading but leaves ~890px of content — not enough for a form and a sheet side by side.
`layouts/panel.blade.php` gained `@yield('shell')` on the wrap (empty by default, so every
other admin page is untouched) and this view sets `wrap-genis` (1560px). The two-column
breakpoint is **1200px**, not 980: below it the left column drops under ~430px and long labels
wrap onto two lines, which is what made the form look tangled.

**A seeded document opens with an empty text box, and the editor says so.** Those 84 sheets are
block-mode (`body` empty), so the first character typed into `Mətn` switches the sheet to text
mode and the blocks stop rendering — they are not deleted, but they vanish from the page. The
editor prints a warning naming the block count and pointing at `{{ blok:acar }}`.

**Admin assets are named `panel-`, not `dossier-`.** `frontend/panel-qovluq.js` and the
`/* İŞ QOVLUĞU REDAKTORU */` block in `panel.css`. The `dossier-*` names belong to the **player**
side and are swept by `check-dossier.js` §5 for brand words; inside the admin panel the product's
own name is legitimate. `layouts/panel.blade.php` gained one line — `@stack('head')` — because the
preview loads the game's own `dossier.css` rather than a second, simplified renderer that would
drift from the real one.

### Material evidence carries photographs

The `kart` block — the material-evidence list, and the one block type that is genuinely
**content the admin writes** rather than story structure — now gives every item a photo.

**The frame is always there, filled or not.** A real evidence protocol reserves a space for each
item's photograph, and an empty frame reads as "photo to follow". If the frame only appeared once
an image existed, the sheet's layout would change the moment one was added.

**The photograph is PASTED ON the sheet, not placed in it.** A white print border, a slight
rotation derived from the item index (two photographs at the same angle read as a template, not as
something a hand stuck down), a drop shadow, and two strips of tape across the **top** corners —
each half on the photograph and half on the paper.

> **The tape must not use `mix-blend-mode:multiply`; the seal must.** Multiply is how this section
> soaks ink into paper (see `partials/mohur.blade.php`), and it made the tape invisible — white
> tape over a white print border. Tape is a physical object lying *above* both layers; ink is *in*
> the paper. Same file, opposite answer.

> **The evidence seal is red (`--red`), while the sheet's own seals are purple (`--stamp`).**
> They are different acts: the masthead impression registers the *document*, this one certifies
> an *object*. It is the same token the stamp layer calls `qirmizi`, so the palette stays one
> palette.
>
> **The round seal straddles the photograph's bottom edge — half on the print, half on the sheet.**
> That is where a real one goes: it certifies that this photograph belongs to this file, so the
> print cannot be swapped without breaking the impression. It reuses `<x-mohur>`, so its `id` must
> be unique on the page; it is derived from a hash of the block's own cards, never from `rand()` —
> a seal that moves when the sheet is reopened announces the document as fake (the `Imza::yol()`
> rule).

> An **empty** frame gets neither tape nor seal, and no rotation: nothing has been stuck down there
> yet, only space reserved. The photo is capped at 330px rather than filling the measure — a real
> print is 9×13 and the paper around it is what the tape and seal sit on.

**A card references a library slug, never a filename.** Re-uploading an image changes the file name
(they are 32 random hex characters); the slug survives. An unresolvable slug renders the empty
frame — it is not an error, because a case can legitimately have evidence with no picture.

**The image map now reaches both render paths.** `renderDocument()` loads it once and passes it to
the view as `sekiller` + `slug`, so the block loop sees it; `SenedRender::blok()` passes the same
pair into `View::make`, so a `{{ blok:… }}` tag inside body text renders identically.

**This is the one block type with an editor**, and the exception is deliberate: photographs can
only be uploaded from the admin, so evidence cannot live in the seed file alone.

- Each row has its own **Yüklə** button. The upload goes to the library *and* binds to that row in
  one step, with `owner_document_id` set to the document being edited — so an item on a locked
  sheet inherits the spoiler gate without the admin having to think about it.
- The new slug is appended to **every** row's dropdown, since one photograph can serve several items.
- There is no "add" button and no "delete" button: each block ends with a blank row (typing a name
  creates the item) and clearing a name removes it. One rule, two directions.
- A document with no evidence block gets a checkbox to create one. The new block is given an
  `acar` (`subutlar`, uniquified) so it can also be placed by tag.

**Nothing in this panel asks the admin to type syntax or read a slug.**

- **A formatting toolbar sits on the textarea.** Each button wraps the selection; with no
  selection it inserts a placeholder word and leaves it *selected*, so the next keystroke replaces
  it. Buttons carry the look of what they do — the red-pen button is red, the strike button is
  struck through — so the choice is recognised by eye, not by remembering `~~`.
- This is **not** a WYSIWYG editor and must not become one: the sheet is always built from text,
  `Metn::inline()` reads exactly these markers, and the live preview already shows the result. The
  toolbar replaces *typing*, not the format.
- **`{{ sekil:… }}` is inserted from a thumbnail grid**, not typed. The `Şəkil…` button opens the
  library inline; clicking a picture puts its tag at the cursor.
- **Uploading no longer uses `window.prompt()`.** Three prompts in a row asked for a slug, a
  caption and a type — they block the page, never show the picture, and made the admin type an
  English key into an empty box. The in-page form shows the image immediately, suggests the slug
  from the filename (the server re-cleans it and de-duplicates anyway, so the browser's weaker
  `İ`-folding cannot cause harm), and offers the types by name. `check-dossier-admin.js` counts
  browser dialogs and asserts **zero**.
- **English slugs never reach the screen.** `sekil_labels`, `sened_labels`, `blank_labels` and
  `kilid_labels` in `config/dossier.php` name every whitelist value in Azerbaijani, the same
  pattern as `difficulty_labels`. The keys stay English because they become view filenames.

> **In text mode the block does not appear on its own.** When `body` is filled the sheet is read as
> text and blocks render only where a `{{ blok:… }}` tag puts them — evidence added without one
> would vanish silently. The editor detects this and offers a button that pastes the tag at the
> cursor.

> **The tag literal must not be written in Blade — not even inside `@php()`.** Blade scans the
> whole template for `{{ … }}`, so `@php($x = '{{ blok:' . $k . ' }}')` compiles to
> `'<?php echo e(blok:' . $k . '); ?>'`. This failure is **silent and self-consistent**: the
> comparison that decides whether to show the warning uses the same corrupted value, so the warning
> behaves plausibly while the pasted tag is garbage. Build it with `Isare::yaz('blok', $acar)`.

### The case's ending — interrogation and verdict

Every case ends with two sheets the player sees **only after closing it**: the culprit's
interrogation protocol (how the crime was planned and carried out) and the court's decision (the
sentence, in years). They are real sheets — same blank, same seal, same fiction band — so they
live in `dossier_documents` behind a flag rather than in a separate table.

**`is_spoiler` is a different axis from `is_locked`.** The lock reads `unlocked_ids`; this reads
`solved || revealed`. One sheet could carry both. `renderDocument()`'s `$bagli` argument is the
lock only.

**Five gates, and none of them is optional:**

| gate | why |
|---|---|
| `orderedIds()` excludes spoilers | `allRead()` demands the whole sequence and `/rey` + `/sonluq` sit behind it. A spoiler in the sequence means the player cannot submit a verdict without reading sheets that only open *after* the verdict. **Deadlock.** |
| `reachable()` gates explicitly at the top | the loop's closing `return true` fires for any document not in the sequence — removing them from `orderedIds()` alone would open them to everyone |
| `renderPublic()` refuses them | the free-sample path |
| `imagePath()` refuses their images | otherwise anyone with access could walk the id sequence |
| `DossierAiService::kodMenbeleri()` skips them | a code digit hidden on a post-solve sheet would require solving the case to find the code that helps solve the case |

**The name never leaks either.** Spoiler sheets are filtered out of `docs` in four places —
`play()` · `open()` · `unlock()` · `show()` (the presentation page's `.teq-siyahi`) — and out of
the catalog card's document count, which is why the shipped cases still read «28 sənəd» while the
seed files now hold 30.

`neticeArray()`, `chooseSuspect()` and `play()` return a `spoilers` list under the same
`solved || revealed` condition as `solution`. The sheet itself comes from the existing
`GET /api/is/{slug}/sened/{id}` — no new route, `reachable()` is the gate.

> **The block must sit OUTSIDE `.expl`.** `check-dossier-flow.js` asserts `.expl p` is exactly
> four (0847's solution has four paragraphs) in two places. The ending list is a sibling section.

> **`tap()` searches both arrays.** Spoiler sheets are deliberately absent from `S.docs` — the
> materials list, the cascade gate and `hamsiKecilib()` all read it — but `ac()` bails on its first
> line if `tap()` returns null. And `altliq()` swaps «Davam et →» for «Nəticəyə qayıt»: a sheet
> outside the sequence has no next, and the existing `data-go` branch clicks the *answer* tab,
> which the player has already left behind.

**The court is a second fictional body.** `Byuro::MEHKEME` = `AFİB FİKTİV MƏHKƏMƏ KOLLEGİYASI` —
a class constant, not config, for the same reason as `Byuro::QEYD`. It cannot contain «Azərbaycan
Respublikası» (`org_ban`); plain «məhkəmə» is fine, only `mehkeme-tibb ekspertizasi` is banned.

**`mehkeme` is a seventh blank type**, not a reuse of `qerar`: that one's grif reads «AFİB bölmə
rəisi», i.e. the *investigation* approves the document. An investigation cannot pass sentence — it
brings the charge, the court sets the penalty. Adding it touches four synchronised lists
(`config` `blank_novleri` + `blank_labels` · `BlokSxemi::BLANK_NOV` · `QovluqBrief::BLANK` · the
component file); `check-dossier.js` §2 compares them **including order**.

**No new block type.** The interrogation is a `metn` block written as `**Sual:**` / `**Cavab:**`
(the shipped 0847 solution already uses that shape); the verdict is `metn` + `imza`. The 13-type
count stays 13.

**AI builds them without a schema change.** `skeletSchema()` pins `documents` to
`minItems === maxItems === $say`, so the model cannot be asked for two extra. It does not need to
be: the culprit, motive and proof are already in the skeleton, so `sonluqVereqleri()` creates the
two rows server-side with a brief assembled from those values, and `partiya()` fills them like any
other sheet. The three shipped cases were generated once through the same path and written into
their seed JSON as `"spoiler": true`.

### Building a case with AI

`/admin/qovluqlar` carries an **«AI ilə yeni iş qur»** panel: a brief, a **document count** and a
difficulty produce a complete draft case — story, four suspects with a culprit, chronology, alibi
axis, solution, the three questions, N documents with text, and a lock code.

**This one writes to the database, and that is the deliberate difference from `AiController`.** The
template assistant never touches the catalog because its output fits in a form. Twenty-five sheets
do not. So the result is a **draft** (`status = draft`) — invisible to players — and publishing it
still goes through `QovluqYoxlayici`. The review gate does not disappear; it moves from *save* to
*publish*.

**Two stages, driven by the browser.** Thirty documents do not fit in one completion, and six
OpenAI calls do not fit in one HTTP request. `POST /admin/qovluqlar-ai` returns the skeleton and
the document rows (empty bodies, each carrying its one-line brief in `content.ai_brief` — a key the
render layer does not know and ignores). Then `POST /admin/qovluqlar-ai/{dossier}/senedler` fills
the next `QovluqBrief::PARTIYA` (4) sheets, repeatedly, with a progress bar. Both routes are
`throttle:ai`. If a batch fails the draft survives — the admin opens it in the editor and continues.

**`QovluqBrief` does not trust the model**, the same posture as `TemplateBrief`:

- **The cover is never asked for.** Institution lines, seal and assignment come from `Byuro`
  constants, so a model that writes a real ministry cannot put it in the masthead.
- **The three questions are constructed, not requested.** Question 1's options are the suspects'
  names *in order* and `correct` is the culprit index — the convention the admin panel reads the
  culprit from. Asked for, the model would eventually shuffle them and the culprit would be
  silently wrong.
- **Sheet numbers come from the sequence**, not from the model (it repeats and skips them).
- `doc_type` and `blank_nov` fall back to whitelist values; an out-of-range `culprit` collapses to
  0 (flagging nobody would hide the reason); the lock code is reduced to four digits; a source
  sheet that is the locked sheet itself, or does not exist, is dropped.
- Emoji, markdown headings and list bullets are stripped from document text — `Metn::inline()` does
  not know them and would print them literally. The **markers stay**: `**`, `[[…]]`, `((…))` are
  the sheet's language.
- A real institution name is **reported, not deleted** — silently editing prose is worse than
  telling the admin to fix it. The model's output also passes the same `Moderation` list as
  visitor text.

> **The lock's source sheets are recomputed from the finished text, not from the model's claim.**
> The skeleton says "the digits are on sheets 2 and 3", then the model writes those sheets one call
> later and does not keep its word. `QovluqYoxlayici` checks sources literally, so a false claim
> would make every AI case unpublishable. After the last batch `kodMenbeleri()` scans the actual
> bodies; if the digits are not all there it leaves the list **empty**, which is a note rather than
> an error, and the admin either hides the digits or changes the code.

> **`max_execution_time` kills the request before cURL does, and the failure is silent.** PHP's
> default is 30 s; a skeleton call measures **45 s for 8 sheets**. When the limit hits, the process
> dies with a fatal error mid-request — the browser gets `ERR_EMPTY_RESPONSE`, nothing reaches the
> `catch`, and **nothing is logged**, so the panel just says "alınmadı" with no reason. This is why
> `OpenAiClient::chat()` calls `set_time_limit($this->timeout + 30)`: the cURL timeout must be the
> thing that stops the request, because only it produces a readable error. It sits in the client,
> not in the dossier service, because every AI call in the repo goes through it — the template
> assistant had the same latent failure.

> **The skeleton call raises its own limits.** `max_output_tokens` defaults to 6000 and 8 sheets
> already cost 4131 output tokens, so a 40-sheet plan would be truncated into invalid JSON. The
> skeleton therefore asks for `2000 + say × 320` tokens and `40 + say × 6` seconds; the batches keep
> the defaults, since four sheets are always small.

> **Progress must be visible or the page reads as frozen.** Generation is minutes long: the panel
> shows the stage, an elapsed-seconds counter that ticks every second, and a bar. Failures print the
> full reason plus the log path — the one-line status field is not enough to act on. The service
> logs each stage to `laravel.log` with model, token counts and duration (`qovluq-ai:` prefix).

> **A skipped sheet is written, not left blank.** If the model omits one, the next batch would ask
> for it again and the loop would never end — so it gets a single `[[Mətn qurulmadı…]]` line that
> the admin sees in the editor.

**Documents are generated as BLOCKS, but the model never writes a block.** The first version
produced text-mode sheets only, and the result was exactly what you would expect: a WhatsApp
export, a call log and a decision all rendered as prose on the same blank, with no stamps, no
signatures and no photo frames. Text mode alone cannot carry this product.

The split that fixes it: **the model supplies data, `QovluqBrief::bloklar()` assembles the blocks.**
Asking a model for 13-type block JSON means asking it to memorise a key table where an unknown key
is a hard error; asking it for `{basliqlar, setirler}` or a list of messages is asking for something
it is reliably good at. Every sheet comes out as
`blank → basliq → sahe? → metn → <structure> → imza`, plus a stamp layer, paper wear and a
hologram on authorising blanks.

| document kind | what the model fills | how it renders |
|---|---|---|
| ifadə · izahat | `body` + `sahe` + `imza` | prose with requisite rows and a signature |
| qərar · protokol · ekspertiza | `body` + `imza` | its own letterhead (`blank_nov`), no requisite rows |
| yazışma | `yazisma` | a chat screenshot inside the sheet |
| zəng detallaşdırması | `zeng` | a call list |
| jurnal · qəbz · cədvəl | `cedvel` | a real table |
| maddi sübutlar | `kart` | evidence cards, each with a taped photo slot |
| baxış · kamera | `foto` | captioned photo frames |

- **Cells are padded to the header count.** `BlokSxemi` treats a short row as an error and the
  model drops a cell often enough to matter.
- **`saat` is forced to `HH:MM`.** The model likes to put a date there, and a date printed under a
  chat bubble makes the screenshot contradict itself.
- **`yon` falls back to `gelen`**, unknown message kinds are dropped, nameless evidence and
  timeless calls are dropped — the block must validate, not merely exist.
- **The stamp's position and angle derive from the sheet number**, never `rand()`: a seal that
  moves when the sheet is reopened announces the document as fake. Heavy paper effects
  (`leke`, `cirilma`, `kseroks`) are **not** used — their placement is an authoring decision, and
  applied uniformly they read as a template rather than as wear.
- `tests/logic.php` builds a sheet from deliberately broken model output and runs the result
  through **`BlokSxemi::yoxla()`** — that assertion is what keeps this honest.

> **`content.ai_brief` marks "not written yet", not an empty `body`.** In block mode `body` stays
> empty forever, so the batch loop would never terminate if it looked there. The key is the work
> order; fulfilling it removes the key.

> **The validator reads block text too.** `QovluqYoxlayici::senedMetni()` originally looked only at
> `body`, so the lock-code digits could never be found on a block-mode sheet — which is every
> seeded sheet and every AI sheet. It now flattens `content.bloklar` as well, and
> `DossierAiService::senedMetni()` flattens **exactly the same fields**: if the writer scanned more
> (stamp text and paper numbers carry digits too) it would record sources the validator cannot
> confirm.

### The ending layer (şübhəli seçimi)

Alongside the three-question verdict there is now a second ending mechanic: the player picks one
suspect and gets that suspect's ending — `verdict_text`, a `sting_line` three seconds later, and
`reveal_text` only on the true ending.

**The mode is derived, never stored.** A case with `dossier_endings` rows uses suspect selection;
one without keeps the three-question form. No column, no admin toggle — a flag would be a second
truth to keep in sync, and the three shipped cases would be one bad default away from silently
changing mechanic. `check-dossier-flow.js` §7/§8 and `tests/security.php` §14 therefore still pass
untouched.

- `POST /api/is/{slug}/sonluq` (`throttle:dossier-rey`) and `POST /api/is/{slug}/yeniden`
  (`throttle:dossier`). The first passes the same gate as `verdict()`: every sheet read, or 403.
- **The endings' text is never sent up front.** `/ac` and the shell payload carry only the *ids* of
  suspects that have an ending; the text arrives in the response to the choice. Shipping all of it
  would hand the ending to anyone with DevTools.
- `reveal_text` and `is_true_ending` are in `DossierEnding::$hidden`; the controller adds `reveal`
  explicitly and only when the ending is the true one.
- **"Yenidən oyna" clears only `chosen_suspect_id`.** Unlocked codes, read sheets, the investigator
  name and a solved case's certificate all survive — the player must not hunt for a found code twice.
- There is **no attempt limit** here: reading each ending is part of the game. The three-attempt
  rule belongs to the question mechanic, where naming the wrong item would turn three tries into a
  search of the 4 × 4 × 4 space.
- The answer screen carries **both** forms and CSS picks one (`#s-answer.sonluq`). Two separate
  screens would have split the navigation and tab logic in half.
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

**Document types differ by letterhead, and the type is DATA.** A qərar, an arayış and a protokol
are different forms in real life and must not share one header. That is **not** a per-type template:
`views/dossier/senedler/` was deleted for that reason and `check-dossier.js` asserts it stays
deleted. Instead `blank` gained a `nov` property — exactly like `kilid.nov` — and each style is a
component under `components/blank/`:

| `nov` | what makes it that form |
|---|---|
| `resmi` | default; centred intake row with the `QEYDƏ ALINIB` stamp |
| `qerar` | right-aligned `TƏSDİQ EDİRƏM` grif, larger crest, thick rule, **no intake row** — a decision is not filed material, it *creates* the file |
| `arayis` | letter layout: small crest left, org lines left-aligned, `№`/date under them, addressee block right |
| `protokol` | «Tərtib olundu» strip under the rule — place, case no, sheet |
| `ekspert` | expert's warning box **before** the text, where a real opinion puts it |
| `izahat` | rights notice as the sheet's first line |

- All six share `<x-blank.ust>` (crest + institution lines), so that part changes in one place.
- **`nov` is whitelisted before it reaches `<x-dynamic-component>`.** It becomes a component name;
  an unvalidated value would try to render an arbitrary view. `config('dossier.blank_novleri')` ↔
  `BlokSxemi::BLANK_NOV` ↔ the component files are compared by `check-dossier.js`, and the Blade
  falls back to `resmi` for anything unknown.

**The sheet is the graphite palette, and that is a deliberate split.** `--paper`/`--ink` and the
accents now match `doc.js`'s `ink` palette (`#F7F8FB` paper, `#151B26` ink, `#17356B` pen) — a
real blank is cool white, not warm parchment. **The folder around it stays warm** (`--desk`,
`--buff`, the catalog cards): the desk and the tabs are furniture, the sheet is the document.

**The hologram is not on every sheet, and that is the point.** Foil is expensive and a real file
carries it only on *authorising* documents — qərar, əmr, formal akt, the final expert opinion.
`content.holoqram` decides. A stamp, by contrast, sits on **almost every** sheet (27 of 28; locked
documents show a keypad instead), because every filed page gets a registration mark. A protection
that is everywhere is not a protection.

> **Bottom of the sheet, RIGHT side** (`x` 66–77, `y` 76–83). The signature block is left-aligned
> and the date sits under it, so the right half of that band is empty — that is where the seal
> goes. Putting it over the signature buries the one thing it authenticates while leaving white
> space beside it. For the same reason the hologram moved to the bottom **left**: signature left,
> seal right, foil below-left, nothing overlapping. Position and angle derive from the document's
> index, so no two sheets carry an identically placed stamp.

**Security print is three shared components, layered under the text.** `<x-naxis>` is the guilloche
(three rosettes, ported from `doc.js guilloche()`), `<x-gerb>` doubles as the ghost watermark, and
`<x-holoqram>` is the foil patch (the `doc.js` `-holo` gradient plus a rosette). All sit at
`z-index:0` behind the content — they must never cost legibility, which is why the guilloche runs
at 0.13 opacity and 0.16 stroke width.

- **The guilloche keeps its aspect ratio.** Stretched to the sheet (`preserveAspectRatio="none"`)
  the rosette degrades into wavy scribble; it is a centred square instead, sized `min(96%, 560px)`.
- **Every `<x-holoqram>` and `<x-mohur>` needs a unique `id`** — both bind through `url(#id-…)`,
  and duplicates make two patches share one gradient.

**The crest and the round seal are shared components, not dossier code.**
`App\Support\Nisan` ports `doc.js`'s `crest()` and `seal()` geometry — concentric rings, the
rosette guilloche, the ribbon banner, curved ring text — and `<x-gerb>` / `<x-mohur>`
(`resources/views/components/`) wrap it. The text is a parameter, so the same component serves a
different institution; it is used in the letterhead, the ghost watermark and the stamp layer.

- **The port keeps the star and the laurels; only their placement changed.** The wreath spans
  141°–219° (the flanks) instead of `doc.js`'s 96°–202° (rising from the base) — see the crest
  rule below. The rest of the geometry is the original.
- **Ribbon and ring text size themselves.** Both are computed from the available arc/width and a
  0.6em monospace advance, never chosen by eye: a fixed size overflows the moment a longer
  institution name is passed, and the mark degrades into an unreadable smudge.
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

**The bureau's mark is a full crest, and the constraint is narrower than "no heraldry".**
It carries three concentric rings, a rosette guilloche, a five-pointed star, laurel branches,
the `AFİB` monogram, an `EST. 2026` line and a ribbon — the same vocabulary as the invented `ZNP`
crest on the other side. What it must not do is **copy the actual Azerbaijani state emblem**:
that one is an eight-pointed star with a flame, and neither appears here.

> **The laurels sit on the flanks, not under the base** (`celeng()` spans 141°–219°, symmetric
> about due west, mirrored to the right; `doc.js` sweeps 96°–202° and therefore rises from the
> bottom). A wreath climbing from the base is the single most recognisable line of real state
> emblems; moving it to the sides keeps the mark official-looking without pointing at one.

### The investigator profile, rank system and ID badge (`/is/mustentiq`)

The section used to give a one-shot experience: buy a case, read it, name the killer,
share a certificate, done. There was no reason to come back, because the player had no
**continuing identity** — someone who had closed three cases looked identical to someone
who had played nothing. This layer is that identity: a profile, an earned **rank**, and a
shareable **ID badge**.

**The card is earned, and that is the mechanism.** A guest can solve cases and accumulate
XP, but gets no badge number and never appears in the leaderboard. That is the single
strongest argument for registering, and it costs nothing to maintain: **a guest is already
a `users` row and `AccountService::register()` fills that same row in place**, so XP
survives registration with zero migration work. `register()` needed no change at all —
there is a comment saying so, because it looks like an omission.

**The whole layer lives inside `/is`.** Own routes, `layouts/dossier.blade.php`, own assets
(`dossier-profil.js` / `dossier-profil.css`), no `site.css` / `panel.css` / `app.js`, and no
link in either direction to the notary product. Registration therefore could not reuse
`/kabinet` — `Web\DossierAccountController` + `/is/hesab` is the section's own auth screen,
following the `DevetAccountController` precedent. It calls the **same** `AccountService`,
so there is one auth truth and no new security surface.

**XP is derived, not a ledger.** `investigator_profiles.xp` is a denormalised cache of
`Σ case_completions.xp_awarded + Σ xp_adjustments.delta`, floored at 0. That makes the
admin's "recalculate" button, the guest merge and the audit trail all fall out for free,
and a half-applied write can never leave a permanently wrong balance — the next recompute
repairs it. Writes go through `CreditService::apply()`'s shape: `DB::transaction` →
`lockForUpdate()->firstOrFail()` → ledger row with `balance_after` → `syncOriginalAttribute()`.
`cases_solved` · `true_endings` · `first_try_solves` · `total_wrong_accusations` are caches
of the same table; **nothing else writes them**.

**The formula lives in exactly one place** — `App\Support\Dossier\Xp` (framework-free, so
`tests/logic.php` requires it directly). Bonuses **add**, they do not multiply:

```
carpan = 1 + (true ending ? 0.5 : 0) + (first try && 0 wrong ? 0.3 : 0)
xp     = max(0, round(base[difficulty] × carpan) + (all codes ? 20 : 0) − 10 × wrong)
base   = asan 20 · orta 40 · cetin 70 · kabus 120
```

Percentages apply first, flat values after: the code bonus is the same work on every case,
and a flat penalty stops a mistake on an `asan` case being cheap. Per-case ceilings are
`56 · 92 · 146 · 236`.

**Nine ranks, seeded, with a curve that is asserted rather than trusted.**
`0 · 40 · 150 · 380 · 800 · 1450 · 2400 · 3800 · 6000`; every step is larger than the one
before it (`40 · 110 · 230 · 420 · 650 · 950 · 1400 · 2200`) and `check-mustentiq.js` §1
fails if that stops being true.

> **The second rank is guaranteed, not likely.** The *worst possible* outcome on the free
> `orta` case — two failed attempts, no codes found — is exactly **40 XP**, which is rank 2's
> threshold. "The first step should be easy" is therefore an arithmetic property, not an
> average.

> **With only three cases the ceiling is 474 XP → rank 4**, and ranks 5–9 are unreachable.
> That is deliberate and **visible**: the profile shows all nine rungs with the locked ones
> dimmed. Compressing the curve to fit three cases would have to be undone the day a fourth
> ships. `RankSeeder` therefore rewrites `xp_required` on **every** run (unlike the
> `status`/`sort` discipline) — thresholds are code-owned, and re-seeding is half of how the
> admin's recalculate button works.

**`is_true_ending` means "reached the winning outcome"** — the true suspect in ending mode,
`solved` (as opposed to `revealed`) in question mode. Since **no shipped case has endings**
(`endings: 0` in all three seeds), it is true for every closed case today and `×1.5` is
effectively part of the base; the levers that actually vary a score are the first-try bonus,
the code bonus and the penalty. This is **not** redundancy — it is written in `RankService`'s
docblock so nobody later "fixes" it.

**Two hook points, both a transition gate.** `DossierService::submit()` and
`chooseSuspect()` capture `$evvel = $p->solved` *before* mutating and award only on
`! $evvel && $p->solved`. Checking the row itself is not enough — on a second call `solved`
is already true. The early return is the first guard, this is the second, and
`case_completions`' unique `(profile_id, case_id)` is the third. `revealed` awards nothing
but calls `recordAttempt()` so the case still counts as attempted.

- `wrong_attempts` is `attempts − 1` in question mode (`attempts` only increments on a
  complete form, so a partial submit costs nothing) and `count(wrong_suspect_ids)` in
  ending mode.
- **`dossier_progress.wrong_suspect_ids` is a distinct-id list, not a counter** — endings
  have no attempt limit and reading each one is part of the game, so picking the same
  suspect twice is one mistake. **`replay()` must never clear it**: it exists so the player
  can read another ending, not so the score resets; clearing it would hand out both the
  −10 waiver and the first-try bonus for free.
- `all_codes_unlocked` is computed in `RankService`, and **a case with no locked sheets
  counts as `true`** — otherwise the +20 would land only on `2026-0412` and read as a
  penalty on the other two.

**The badge number is issued when the department is chosen, and then frozen.**
`ŞK-YY-NNNN` (`CA-26-0147`), sequential under a row lock, **never random** — a gap in a
service number reads as forgery. Zero-padding to a fixed width is what makes
`ORDER BY badge_number DESC` return the numeric maximum, and `tests/logic.php` asserts
lexicographic order equals numeric order over 200 shuffled numbers. The one allowed
department change does **not** alter the number: it is issued to the person, not the post,
and a shared older card must keep matching.

> **«Məhkəmə-Tibb Ekspertizası» is deliberately not a department name.** It is on
> `config('dossier.org_ban')` and in `tests/security.php` §14 — a real state institution.
> The department is **«Tibbi Ekspertiza»** (`TE`), the same substitution CLAUDE.md already
> records for the ranks. `check-mustentiq.js` §2 folds every department label against
> `org_ban` so it cannot come back.

**`CardRenderer` renders the badge server-side; the browser makes the PNG.** There is no
server-side SVG→PNG anywhere in this repo, and three rules follow from the canvas raster
path, all of them already learned by `dossier-cert.js`:

1. **`@font-face` is dropped** → the card uses generic families, **single-quoted** (a
   double quote inside a double-quoted XML attribute makes the image fail *silently*).
2. **CSS custom properties do not resolve** → `ranks.color_token` stores a *token name* and
   `Rank::reng()` maps it to a literal hex from `config('dossier.reyting.rank_colors')`,
   which `check-mustentiq.js` compares against `dossier.css` `:root` value by value.
3. **External images are dropped** → the avatar is embedded as a `data:` URI, never a link.

**Text fitting without `measureText`.** PHP has no metrics and `check-title-fit.js` already
records that a length-based estimate is useless for *measuring*. So the estimate only
**picks a size bucket** (a per-character advance table, ±8 %), and the hard guarantee is
`textLength` + `lengthAdjust="spacingAndGlyphs"`, which cannot overflow in any font, in the
browser or on the canvas. The name texts carry `data-ad="1"` so the flow test can measure
exactly those with `getComputedTextLength()` — the microtext strip is deliberately the full
card width and must not be caught by that check.

**Guilloche: `Nisan::naxis()` is not tiled.** It is a fixed 100×100 rosette *group*, not a
tile unit — on a grid its circular envelope produces visible seams and a polka-dot field.
The card uses a real six-line inline `<pattern>` for the field **plus** one large centred
`naxis()` mark at 0.06 opacity, which is where the guilloche reading actually comes from
and keeps the card in the same family as the seals. The pattern is emitted per-card under
the caller's `$id` prefix, never into a shared `defs()` (the `doc.js` lesson).

**The badge carries a red seal and a hologram, and each sits where its meaning puts it.**

The **hologram straddles the photograph's bottom-right corner**, a quarter of it over the portrait. That is where a
real ID puts its foil: the picture cannot be lifted or swapped without destroying the patch, so
the protection sits on the thing being protected. On a case sheet the foil is in the corner
because what is protected there is *text*; here it is a *face*. It stays translucent
(`opaklik` 0.40 under a 0.78 group) — foil you cannot read through is a stain, not a security
feature. It is **unconditional**: foil is the card's own material, not an act performed on it,
so a card still awaiting assignment carries it.

The **seal sits bottom-right, opposite the signature** — the sheet's own rule («signature left,
seal right, nothing overlapping»), unchanged. A seal is pressed into a document's *empty* area;
over the signature it would bury the one thing it authenticates and leave white space beside it.
It is **red** (`CardRenderer::QIRMIZI` = `dossier.css` `--red`) because the sheet's own purple
seals *register a document* while this one *certifies a person* — different acts, the same
palette. And it is drawn **only when a badge number exists**: an unissued card has not been
issued, and the seal is the issuing.

> **Label and value share one baseline.** The value used to be drawn at `y + 30` — *below* the
> dotted rule — while rows are 44 apart, so «Cinayət Axtarışı» landed nearer the **next** label
> than its own and the card read as «department empty, number is the department». The dotted
> line is now a separator under the row, not a divider through it.

**The badge is the fifth share artefact**, so `Byuro::QEYD_QISA` is on the card itself and
`check-dossier.js` §3c asserts it — the same argument as the certificate, the story PNG and
the two OG images. `CardRenderer.php` is also in `QURUM_SCAN`: it prints institution text
onto a shareable artefact, so the legal shield covers it regardless of which folder it is in.

**Leaderboard caching is TTL-only, and that is forced by the store.** `CACHE_STORE=database`
does not support tags, so `Cache::tags()->flush()` does not exist; maintaining a manifest of
12 orderings × N pages would be more code, more failure modes and no user-visible benefit. A
leaderboard is a *reading* of the world, not a fact about it — five minutes stale is
invisible. All three windows aggregate over `case_completions.completed_at` (including
"all time"): the profile counters are the **profile page's** cache and reading them here
would create a second source of truth. The secondary sort is always `p.id ASC`, because an
unstable tie-break both duplicates and drops rows across a page boundary.

**`cached_rank_position` tracks only the primary ordering** (total XP, all time). It is the
number printed on the profile and the only one a hidden profile can get, since it appears in
no list. The other eleven orderings compute the viewer's own position on demand with one
indexed `COUNT(*)`. `syncPositions()` **includes hidden profiles in the ordering** — hiding
is a display choice, not a demotion — and runs behind a five-minute `Cache::add` lock, plus
the admin button. There is no scheduler in this repo and none was added for a cosmetic number.

**Avatars are the `devet` OG model, one step stricter.** Multipart MIME is only a hint; the
verdict is `Sekil::olcu()` (`getimagesizefromstring`). GD centre-crops to a square first
(`Sekil::olcule()` does not crop) and flattens transparency onto **white**, or a PNG comes
back black. Two derivatives, 32 hex characters each, stored outside the public root. Status
starts `pending`: **the owner and admins see it, everyone else gets 404** — not 403, because
"access denied" is itself information (`imagePath()`'s rule). A rejection keeps the file, so
it can be reviewed again, and shows the reason with the form re-enabled.

**`AccountService::mergeGuestInto()` gained `moveInvestigatorProfile()`**, and it is
mandatory: `investigator_profiles.user_id` cascades and the method deletes the guest row, so
without it a cross-device login would destroy the guest's XP and closed cases (the same
latent bug `invites` still has). **The profile row is not moved** — the account's own profile
is `ensure()`d and only `case_completions` are re-pointed, so no one can inherit someone
else's badge number. On a collision the **higher-XP** row survives, mirroring
`progressRank()`: a merge must never set anybody back.

**Delivery note.** Ranks are seeded before `DossierSeeder` (a profile references a rank).
`ProfileService::ensure()` is called from exactly three places — `RankService`, the profile
controllers, and the merge — and deliberately **not** from `DossierService::open()`: a
visitor who pays for a case and never finishes should not create a profile row.

### The landing page is an investigation board

`/is` used to read as a calm product page. It is now a **board**: the sample sheet is *pinned* to
it rather than sitting in a panel. Everything is CSS and inline SVG — this section ships no image
files and must not start (the sheet has to stay sharp at every size, and its text selectable).

- **The pinned sheet** carries a pushpin, two tape strips, a red `İSTİNTAQ MATERİALI` grif and a
  fixed **−1.15°** tilt. Fixed, never random: a page that looks different on every load is the same
  mistake as a seal that moves (`Imza::yol()`'s rule). Tape uses no `mix-blend-mode` — it is an
  object lying *on* the paper, not ink soaked into it, the same call the evidence photos made.
- **The red thread has a pin at each end.** A red line with bare ends reads as a scratch; a thread
  *connects* things, so both ends need an anchor. It also lives strictly in the empty lower-left —
  a thread crossing the headline is noise, not atmosphere.
- **The fingerprint is invented**, drawn from nine nested ellipses at 0.075 opacity. It is not and
  cannot be anyone's print, and it must stay *felt* rather than read.
- **`İŞ AÇIQDIR` is the only red badge above the fold**, which is what makes it work. The evidence
  grid behind it sits at 0.022 alpha; at `var(--line)` it competed with the text.
- **The status ticker's numbers are computed**, never written. A hard-coded «84 sənəd» would be
  wrong the day a fourth case ships — and sentences like that stay wrong longest, because nobody
  re-reads them.
- **Catalogue cards are folders**: a stitched spine, two punched holes and a difficulty-coloured
  top edge. The corner ribbon carries the *badge*; the edge carries the *difficulty* — two
  different facts that must not share one channel.

> **The redaction bar reveals itself; it does not wait for hover.** Touch screens have no hover, so
> a hover-revealed bar would leave the `h1` permanently unreadable on a phone — far worse than no
> effect at all. The bar wipes away 1.2 s after load. The word is always in the DOM (the bar is only
> paint), so screen readers and crawlers see the whole sentence, and `prefers-reduced-motion`
> removes the bar entirely rather than freezing it — a frozen bar would hide the word forever.

> **`body{display:flex;align-items:center}` belonged to the game frame only, and it hid the top of
> every sales page.** `.frame` is a fixed 412×880 box that should sit centred; a sales page is a
> long document, and centring one taller than the viewport pushes its head *above* the origin,
> where nothing can scroll to it. On a phone `/is`, `/is/qaydalar` and `/is/hesab` opened in their
> own middle with the masthead and hero unreachable. The rule is now `body.qab-frame`, set from
> `@yield('wrap')`. This is the same trap CLAUDE.md already records for the admin preview iframe —
> it had simply also been live on the phone the whole time.

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

### Sections: which product is live

The site carries three products that do not know about each other. Shipping one to production
while the others are still being written needed a switch, and the only correct meaning of "hidden"
is **the URLs do not exist**: `bolme:<key>` middleware, **404**, never 403 — an "access denied"
announces the address, which is the rule `imagePath()` and the invitation board already follow.

**The default is gated on `APP_ENV`**: under `production` only `is` is open and the home page is
`/is`; everywhere else all three are open, because the test suite walks the zarafat and
invitation URLs and a closed default would turn the whole switch into unexercised code. The
reason for the production side is `PaymentService::simulationAllowed()`'s: an unfinished product
staying live must not depend on somebody remembering to set a variable — failing in the closed
direction is the correct failure. Precedence is **admin panel → `BOLME_*` in `.env` → default**,
so one click in the panel outranks both.

`config/bolmeler.php` holds those defaults; the live value is a `settings` row edited at
**`/admin/parametrler`** — the `ai_model` pattern. The panel says which of the two is in force,
because the same visible state can come from a saved toggle or from the environment default and
an admin cannot otherwise tell. `BolmeService`
caches the three flags forever and **forgets the cache on write**, the `CatalogService::forget()`
discipline; without the cache the middleware would add three queries to every request.

- **«Unsaved default» and «saved to the same value» are different states**, and the panel names which
  one is in force. Only the first follows `APP_ENV`; the second is frozen. That is why there is a
  «seçimi sil» button (`BolmeService::sifirla()`) and why `check-bolme.js` resets rather than
  writing back when it started unsaved — a local test run would otherwise freeze the sections
  open in a database later copied to production.
- **The cache key carries `APP_ENV`.** The default depends on the environment and the entry is
  `rememberForever`, so running `APP_ENV=production php artisan …` against a development database
  made the local site read the production answer. That happened while writing this.
- **Admins bypass a closed section** and get `X-Bolme-Bagli` + `X-Robots-Tag: noindex` on the
  response. Without the bypass you could not check a section before opening it.
- **The middleware must never call `$request->visitor()`** — that *creates* a guest row, and this
  runs on every request (`IdentifyVisitor`'s own rule). `Auth::user()` only reads.
- **The gate covers the API too.** Closing `/kabinet` while `/api/catalog` still answered would
  leave the closed product usable by anyone holding an old SPA bundle.
- **The root is never under the gate.** `/` dispatches instead: `Bolmeler::anaSehife()` returns the
  chosen section, or the first open one if that choice is closed, or `null` → a 503 «texniki
  fasilə» page. Otherwise one wrong setting would 404 the whole site. It **redirects (302)** rather
  than re-rendering: serving the same page at `/` and `/is` makes two canonical URLs, and a 301
  would be cached by browsers long after the section reopened.
- **Shared on purpose**: `/api/health`, `/api/packs`, `/api/payments/*`, `/api/reports` and the
  sign-in routes. Credits are spent by two products; reports are part of the legal shield.
- **`/r/{regNo}` belongs to `zarafat`.** Closing it 404s the QR URL of every published document.
  That is deliberate — hiding a product hides its artefacts — but it is the one consequence worth
  saying out loud before flipping the switch.

> **Closing `zarafat` used to make paid case files unbuyable.** Credits could only be topped up at
> `/kabinet`, which is the *other product's* cabinet — wrong framing for a case-file player even
> when it is open, and gone when it is closed. `/is/balans` is the section's own till:
> `DossierBalanceController`, the section's own layout, no link to `/kabinet`. `PaymentService::checkout()`
> gained an `$o` argument so the provider page and the return URL name **the buying section** — a
> player must not see the other brand at the bank, nor land in a closed cabinet afterwards.
> `dossier.js` sends a `no_credits` error to `/is/balans` after the toast, because a message that
> does not say *where to buy* is not an answer.

### Signing in — guest · password · Google

Three ways in, and they all land on **the same `users` row**. That is the whole design: a guest is
not a lesser object waiting to be replaced, it is the account before it has an email.

**Guests are auto-registered.** `AccountService::newGuest()` now also writes a name —
`Qonaq-0148`, derived from the row's own id so two guests never collide and the name is stable.
`auto_name` marks it as machine-given, which is what lets a later registration overwrite it
without asking. `isGuest()` still keys on **`email === null`**, never on `name` (now always set)
and never on `password` (a Google account has none).

> The row itself was always created lazily by `$request->visitor()`, and still is — a cookie-less
> loop of plain GETs must not fill the table. What changed is that the visitor now has an identity
> worth showing: the investigator name is printed on case-file sheets and in the leaderboard, and
> an unnamed row rendered there as «—».

**Guest mode is now written on the screen.** Both auth screens carry a «Qonaq kimi davam et» block
naming the auto-assigned identity. `POST /qonaq` only issues the cookie and redirects — the site
already worked this way, but the option appeared nowhere, so visitors read the registration form as
a wall.

**Google is hand-rolled, no Socialite.** `App\Support\Auth\Google` is framework-free with an
injectable `callable` for HTTP — the `EpointProvider` / `PublicProvider` shape — so `tests/logic.php`
covers PKCE and every claim check without booting Laravel. `App\Services\OAuthService` holds the
config, the session and the return target; `Web\OAuthController` is **one controller for all three
sections**, because the sections are physically separate but the auth logic must not be triplicated
(the rule `DossierAccountController` already wrote down).

- **PKCE (S256) is mandatory, not advisory.** The `code` travels through the browser's address bar
  and can land in a server log, a `Referer`, or a shared device's history. The verifier lives only
  in the session, so a stolen code is worthless on its own. `check-oauth.js` asserts the verifier
  itself never appears in the consent URL — only its digest.
- **The `id_token` signature is not verified, and that is correct — under one condition.** The token
  is fetched by a direct server-to-server TLS call to Google's token endpoint, which is exactly the
  case OIDC Core §3.1.3.7 exempts. `Google::kimlik()` says so in a docblock, because calling it with
  a token from anywhere else would let anyone write themselves any email. What *is* checked:
  `iss` ∈ `ISSUERS`, `aud` `hash_equals` the client id (without it, a token minted for **another
  site** would work here — confused deputy), `exp` with 120 s leeway, and **`email_verified`** —
  account linking goes by email, so an unverified address would be a takeover path.
- **Resolution order is a security property**: `google_id` → `email` → convert the current guest row
  **in place**. `sub` first because a Google account's email can change; email second so the person
  who already has a password account gets it *linked*, not duplicated; in-place last because that is
  what preserves credits, documents, XP and closed cases with no migration at all — the same trick
  `register()` uses. A human-typed name is never overwritten by Google's; an `auto_name` one always is.
- **`?davam=` is a whitelist key, not a route name.** `config('oauth.qayidis')` maps `kabinet` ·
  `is` · `devet` to route names and anything else falls back to the default. A free-form return
  target is the most-exploited open-redirect surface there is; `check-oauth.js` §8 and
  `tests/security.php` §15 both push hostile values at it.
- **`redirect_uri` is compared literally by Google**, so it is one fixed URL and the return target
  rides in the **session** instead. `OAuthService::qayidisUnvani()` builds it from `url()` — the
  current request host, deliberately *not* `APP_URL` — because a `localhost` ↔ `127.0.0.1` slip
  between the consent call and the token exchange is `redirect_uri_mismatch`. Register **both** in
  the Google console for development. `GOOGLE_REDIRECT` overrides it for production.
- **The keys live in `.env` only**, never in the database — the `OPENAI_API_KEY` rule, for the same
  reason (a DB backup and «Kataloqu ixrac et» would carry them). Empty key ⇒ the button is not
  rendered at all.
- **`throttle:oauth`, not `throttle:login`.** The login limiter keys on the `email` input, which
  OAuth has none of, so every visitor would share one «empty email» bucket and lock at 5/min — and
  one sign-in is *two* requests. `throttle:qonaq` is separate for the same kind of reason: burning
  the registration limiter's 20/day on a guest button would block real sign-ups.
- **`GOOGLE_TOKEN_URL` exists for tests only** — the `OPENAI_ENDPOINT` precedent. `npm run test:oauth`
  starts its own fake Google on `:8094` and drives the real callback with the real `state`; the
  consent page is not simulated because nothing of ours happens there.

> **A `: Response` return type on a method that can redirect is a 500.** `Illuminate\Http\Response`
> is *not* an ancestor of `RedirectResponse` — the common parent is Symfony's. Two methods carried
> this latent bug (`DossierAccountController::show()`, `DossierProfileController::settings()`) and
> only fired once an account could actually reach those URLs.

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
- **Admin asset cache-busting**: `layouts/panel.blade.php` stamps `?v=<filemtime>` onto
  `fonts.css` / `site.css` / `panel.css`, and the dossier views do the same for
  `panel-qovluq.js`. `public/assets/*` is a build artefact whose filename never changes, so
  without the stamp an admin keeps running yesterday's JS after `npm run build:laravel` and
  the panel appears broken. `spa.blade.php` solves this at build time with a sha1.
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
- **Case-file AI guard lists**: `config('dossier.org_ban')` ↔
  `App\Support\Ai\QovluqBrief::ORG_BAN` (the model's output), and `QovluqBrief::BLANK` /
  `::NOV` ↔ `config('dossier.blank_novleri')` / `sened_novleri`. Duplicated on purpose,
  exactly like the template side: one list guards stored content, the other guards generation.
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
- **Blank types**: `config/dossier.php` `blank_novleri` ↔ `blank_labels` ↔
  `BlokSxemi::BLANK_NOV` ↔ `QovluqBrief::BLANK` ↔ the components
  in `resources/views/components/blank/` — `tools/check-dossier.js` compares all three and also
  checks every `nov` used in a seed.
- **Case-file block types**: `config/dossier.php` `bloklar` ↔ the Blade files in
  `resources/views/dossier/bloklar/` ↔ `BlokSxemi::BLOKLAR` ↔ `Qalereya::bloklar()` —
  `tools/check-dossier.js` §2 compares all four and pins the count at 13.
- **Case-file admin labels**: `config/dossier.php` `sekil_novleri` ↔ `sekil_labels`,
  `sened_novleri` ↔ `sened_labels`, `blank_novleri` ↔ `blank_labels`, `kilid_novleri` ↔
  `kilid_labels`. The whitelist is the contract; the label map is what the admin reads.
  A slug missing from its label map falls back to itself — visible, but ugly.
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
- **Case-file image styles**: `config/dossier.php` `sekil_novleri` ↔
  `App\Support\Dossier\BlokSxemi::SEKIL_NOV` ↔ the Blade files in
  `resources/views/dossier/sekiller/` — `tools/check-dossier.js` §7 compares all three.
  Deliberately **not** part of `bloklar`: §2 pins that count at 13.
- **Tag syntax**: `App\Support\Dossier\Isare::NISAN` ↔ the `@verbatim` help text in
  `admin/dossier/sened.blade.php` ↔ the `.qv-sekil[data-nisan]` attribute, which is built by
  `Isare::yaz()` rather than written literally (Blade cannot parse a nested `}}`).
- **The code's two homes**: `dossier_codes.code` (admin registry) ↔
  `dossier_documents.lock_code` (authority, read by `unlock()` and shielded by `$hidden`) —
  `Admin\DossierController::codeSave()` is the only writer that keeps them equal.
- **Suspect wire shape**: `dossiers.suspects` JSON ↔ `dossier_suspects` rows ↔
  `Dossier::suspectList()`, which must keep emitting the same keys `dossier.js subheliler()`
  reads (`init · name · role · bio · bars · camera`).
- **Ending mode**: derived from the existence of `dossier_endings` rows in three places that
  must agree — `Dossier::hasEndings()` (API gate), `DossierService::endingSuspectIds()`
  (the payload) and `dossier.js sonluqlar()` (`#s-answer.sonluq`).
- **Case-file admin assets**: `frontend/panel-qovluq.js` and the `qv-` block in
  `frontend/panel.css` ↔ `tools/build-laravel.js` `ASSETS` ↔ the `@push('scripts')` tags in
  `admin/dossier/form.blade.php` and `admin/dossier/sened.blade.php`.
- **XP formula**: `config('dossier.xp')` ↔ `App\Support\Dossier\Xp::hesabla()` ↔ the JS
  twin in `tools/check-mustentiq.js` §3 (the same deliberate duplication as
  `BlokSxemi` ↔ `check-dossier.js`). The twin is checked against a hand-computed table,
  so a drift in either direction fails.
- **Rank colours**: `frontend/dossier.css` `:root` ↔ `config('dossier.reyting.rank_colors')`
  ↔ `ranks.color_token` — the token is only a *name*; the card needs a literal hex because
  `var(--…)` does not resolve on the canvas.
- **Rank thresholds**: `database/seeders/RankSeeder.php` `RUTBELER` ↔ `ranks.xp_required`
  (rewritten on every seed run — thresholds are code-owned) ↔ `check-mustentiq.js` §1,
  which asserts every step is larger than the previous one.
- **Departments**: `config('dossier.sobeler')` (key = the two-letter badge prefix) ↔
  `App\Models\InvestigatorProfile::departmentLabel()` ↔ `check-mustentiq.js` §2 — which
  also folds every label against `config('dossier.org_ban')`, the rule that keeps
  «Məhkəmə-Tibb Ekspertizası» out.
- **Seal red**: `App\Services\CardRenderer::QIRMIZI` ↔ `frontend/dossier.css` `--red` —
  `check-mustentiq.js` §8 compares them, the same rule as the rank colours and for the same
  reason: `var(--red)` does not resolve on the canvas.
- **Code-39 table**: `frontend/doc.js` `C39` ↔ `App\Services\CardRenderer::C39` — the third
  geometry pair after crest/seal (`Nisan`) and signature (`Imza`).
- **Microtext**: `frontend/doc.js` `microtext()` ↔ `CardRenderer::mikro()` (single-line
  variant only — the card draws one bottom strip, not four edges).
- **Badge number format**: `App\Support\Dossier\VesiqeNo::NIZAM` ↔ the sequential read in
  `ProfileService::issueBadge()`, which silently depends on zero-padding making
  lexicographic order equal numeric order (asserted in `tests/logic.php`).
- **Section keys**: `App\Support\Bolmeler::ACARLAR` ↔ `config('bolmeler.ilkin')` /
  `'meta'` ↔ the `bolme:<key>` middleware arguments in `routes/web.php` ↔ the `settings` rows
  `bolme_<key>`. A key present in `ACARLAR` but on no route is a section nobody can close;
  a `bolme:` argument outside `ACARLAR` is a section nobody can open.
- **Auth entry points**: `config('oauth.qayidis')` keys ↔ the `davam` values in
  `account/auth.blade.php`, `dossier/hesab.blade.php` and `OAuthController` ↔ the route names
  they map to. A key with no route name 500s at redirect time; a `davam` value with no key
  silently falls back to `kabinet`.
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
