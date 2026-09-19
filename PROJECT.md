# Voltrax EV — project map

Static, dependency-free marketing + catalog site for a Panama electric-motorcycle
dealership. Hosted on GitHub Pages at
`https://phantom-deploy.github.io/voltrax.github.io/`. **No build step, no
framework, no package manager** — the files in the repo are the files that ship.

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`. (Same config as `.claude/launch.json`.)

## Layout

```
index.html          Home: hero, quicknav, featured bikes, showroom, why/advantages,
                    parts teaser, import CTA, contact form, footer, onboarding popup
bikes.html          Full inventory + filter bar + bike detail modal
parts.html          Parts & accessories catalog + part detail modal
assets/fonts/           Self-hosted Sora + Manrope variable woff2 (Latin)
assets/css/styles.css   Single stylesheet (design tokens, layout, components, dark theme)
assets/js/data.js       Content database: bikes, parts, showroom, brands, spec labels
assets/js/i18n.js       ES/EN dictionary + runtime translator
assets/js/app.js        All behaviour (IIFE, no exports beyond window.VOLTRAX)
assets/img/             Shipping images — WebP only, pre-sized variants
Images/                 Original full-resolution PNG sources (not served)
sitemap.xml robots.txt llms.txt site.webmanifest   SEO / PWA metadata
```

Every page loads the same three scripts at the end of `<body>`, in order:
`data.js` → `i18n.js` → `app.js`. Each `<link>`/`<script>` carries a `?v=N`
cache-buster — **bump `v` on every page when you edit CSS or JS** (currently
`v=12`).

## Architecture

**Data-driven rendering.** `data.js` defines `window.VOLTRAX.bikes`, `.parts`,
`.showroom`, `.brands`, `.specLabels`. `app.js` renders cards, grids and modals
from those arrays into placeholder containers in the HTML. To add or change a
bike/part, edit `data.js` only — no markup changes needed.

Bike fields that drive the UI: `availability` (`in-stock` | `import` |
`out-of-stock`) picks the badge and filter; `stock` (unit count) turns the
badge into "4 en stock" on cards and in the modal; `featured` puts the bike in
the home "In stock now" grid (bikes.html always shows everything); `sort`
feeds the top-speed/range/power sort; `source` must link the official
manufacturer page the specs came from. The hero "models in stock" number is
counted from this array at runtime.

A bike added to `data.js` still needs matching hand-kept entries in three
places: the contact-form `<select>` and the JSON-LD offer catalog in
`index.html`, and the JSON-LD `ItemList` in `bikes.html` (plus `llms.txt`).

**i18n.** Default language is Spanish (`es`); `en` is the alternate. Static copy
is marked `data-i18n="key"` (text) or `data-i18n-attr="attr:key"` (attributes)
and resolved from the dictionary in `i18n.js`. Data-driven strings use
`{en, es}` objects resolved via `i18nApi.pick()`. `setLang()` persists to
`localStorage["voltrax-lang"]`, updates `<html lang>`, and fires a
`voltrax:lang` event so dynamic sections re-render. The HTML fallback text
inside every `data-i18n` node (and every `data-i18n-attr` value) is the Spanish
string, so the page reads correctly before or without JS; keep it in sync when
editing copy.

**Theming.** Light by default, or dark when the OS prefers it and no choice is
stored; dark via `<html data-theme="dark">`, which also sets `color-scheme` so
native controls follow. Brand red has two roles: `--red` fills
buttons, `--red-text` is for red text, icons and focus rings (lifted to
`#EC5B60` in dark so it stays ≥4.5:1). Import/special-order uses the
`--gold` / `--gold-soft` / `--gold-text` trio. Every text token clears 4.5:1 on
the page surfaces in both themes; check new pairs before adding one. All colors
come from CSS custom properties in `:root`, redefined in the
`[data-theme="dark"]` block — never hardcode a color in a component rule. An
inline script in `<head>` applies the stored theme and language *before* first
paint to avoid a flash.

**app.js modules** (each an `init*`/`render*` function called from `boot()`):
header scroll state + mobile nav, scroll reveal (IntersectionObserver; content
is only hidden once `app.js` adds `.reveal-on`, so a slow or failed script never
leaves sections invisible), bike
cards/grid/filters, bike & part modals, showroom strip, contact form
(inline validation, then WhatsApp/mailto handoff — no backend), active-nav highlight, theme toggle,
and the first-visit onboarding popup (language/theme picker that animates into
the header controls on close; flag stored as `localStorage["voltrax-onboarded"]`).
Open dialogs make the rest of `<body>` `inert` and wrap Tab inside themselves.
`initWaFab()` injects a floating WhatsApp button for ≤900px screens; it shows
once the hero is scrolled past and hides while the contact form, CTA band or
footer is on screen.

**Responsive rules.** On bikes.html the sticky `.filters` bar holds only the
chips (one swipeable row ≤900px, not sticky on short landscape phones); the
result count and sort live in `.lineup-bar` above the grid. Touch devices
(`pointer: coarse`) get 44px targets and ≥16px form text; hover lifts/zooms are
disabled under `hover: none` in favour of a press state. On landscape phones
the detail modal lays the photo beside the specs.

**WhatsApp.** Every chat link goes to `wa.me/50760139903`. Dynamic
messages (bike, part, import, contact form, onboarding discount) are built by
`waLink()` from `WA_NUMBER` in `app.js`; static buttons, `tel:` links, the
visible number and the JSON-LD `telephone` are hard-coded in the three HTML
pages and `llms.txt` — change all of them together.

**No third-party requests.** Sora and Manrope are self-hosted variable fonts
(`assets/fonts/*-latin.woff2`, Latin subset covering Spanish, `display=swap`).
They are intentionally not preloaded (it slowed first paint on thin
connections); metric-matched "Sora Fallback" / "Manrope Fallback" faces keep
the swap from shifting layout. `content-visibility` is only used on the brand
strip and footer — on sections it broke `#anchor` jumps. The hero ships an
extra `@1000` variant so 2–2.75× phones don't pull the 1400px file.

## Images

Originals live in `Images/` as large PNGs and are never served (use
`_` instead of spaces in file and folder names, e.g. `Images/Bikes_v2/`). Shipping
derivatives go in `assets/img/<group>/` as WebP, with width-suffixed variants
(`name@500.webp`, `@620`, `@800`) wired up through `srcset`/`sizes`. Bike
cutouts are cropped to the bike with ~3.6% transparent padding and exported at
1400 / @800 / @500 (the modal uses the 1400 file, cards use @800/@500). Keep
below-the-fold images `loading="lazy"`; the hero bike is preloaded with
`fetchpriority="high"` in `<head>`. Always set `width`/`height` attributes so
nothing shifts while loading.

## Header

`.site-header > .container.nav` holds three groups: the brand link, `.nav-links`
(desktop), and `.nav-right` (theme toggle, language toggle, WhatsApp CTA,
hamburger). Below 900px the links and CTA hide and `.nav-mobile` takes over.

Branding is the horizontal logo lockup, `assets/img/brand/logo-horizontal.webp`
(320×160, ~18 KB, transparent background so it works on both themes), inside
`<a class="brand brand--mark" href="index.html">` on all three pages. Sizing is
`width: clamp(80px, 10.8vw, 108px)` on the anchor with `width:100%; height:auto`
on the image, so it scales fluidly, keeps its ratio, and shrinks rather than
overflowing on narrow screens. The round `logo@192.webp` is still used by the
footer brand and the onboarding popup.

## Performance rules

Fast and light first: no dependencies, no frameworks, no runtime fetches. Prefer
CSS over JS, `IntersectionObserver` over scroll handlers, WebP over PNG, and one
appropriately sized asset over a large one scaled down. Animations are the
acceptable place to spend weight — keep them transform/opacity-only and respect
`prefers-reduced-motion` (there are already global reduce-motion blocks in the
stylesheet).

## Verification

There is no test suite. After a change, serve locally and check the affected
pages at desktop, tablet and phone widths, in both themes and both languages.
Headless Chrome works for screenshots, but note it enforces a minimum window
width (~512px) — to check narrower layouts, render the page inside a
fixed-width `<iframe>` instead of shrinking the window.
