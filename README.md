# Aksarium — site repo

A personal linguistics archive and study site. Plain HTML, CSS and JavaScript; no build step, no framework. Open any page directly in a browser, or serve the folder with any static server.

The design source lives one level up in the project folder: `CLAUDE.md` (settled decisions), `aksarium-design-system.md` (visual identity) and `langua-obscura-site-architecture-draft.md` (naming, IA, content inventory). The Claude Design canvas is `Aksarium.dc.html`.

## Previewing

Double-click any `.html` file, or from this folder run:

```
python3 -m http.server 8000
```

then open http://localhost:8000. Fonts load from Google Fonts (IM Fell DW Pica and Eagle Lake), so the type needs a network connection to render correctly.

## Structure

- `index.html` — home; the river hero at the wide mockup ratio, with the four-panel pathway strip beneath.
- `about.html` — the about page, with the etymology sidebar.
- `codex-lexpressia/` — section landing, the keyboard gallery (Arabic, Persian and Russian layouts with the live typing drill) and the Pinyin IME demonstration.
- `somantasia/` — section landing and the Sapir-Whorf essay, which doubles as the essay template.
- `morphorian/` — section landing and the root-and-pattern deck, which doubles as the deck template.
- `languages/` — the languages index, the built Arabic resource page, and stub pages for Russian, Persian and Dari, Bahasa Indonesia and Bengali.
- `assets/css/aksarium.css` — the shared stylesheet; palette and type roles live here as custom properties.
- `assets/js/` — `site.js` (script-overlay reveal), `keyboard.js` (layouts and typing drill), `ime.js` (pinyin loop).
- `assets/images/` — cleaned imagery only, renamed for clarity. The composed mockups with baked-in chrome stay out of the repo deliberately.

## Awaiting input — do not invent

- **Artwork.** Arabic (`arabiclang_hero.png`), Persian (`persianlang_hero.png`) and Russian (`russianlang_hero.png`) heroes are in place; `desk-window-clean.png` is superseded and removed. Bahasa Indonesia and Bengali variants are still pending, marked with visible "awaiting art" placeholders on `languages/index.html` and each page's hero.
- **Vocabulary.** The cross-language domain vocabulary table awaits the cleaned vocabulary source (cyber/AI plus military/international security, one consolidated table, not per-language lists). The five sample rows on the Arabic page carry over from the design mockup only.
- **Content.** Section and page copy marked "Content to come" or "Placeholder" is exactly that. Placeholder copy is fine; invented facts are not.

## Conventions

- Never label content by type in the UI; no "Essay", "Deck" or "Interactive" tags. Name the section instead.
- Eagle Lake carries nav, page titles and section names; IM Fell DW Pica carries everything else. Protest Revolution is held in reserve; Julee is cut.
- No humans in imagery; the kookaburra mascot appears at most once per page, as atmosphere.
- Keep drill sentences factual and checkable.
