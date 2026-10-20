# Nousvara website

Static product-house website for Nousvara, published at https://nousvara.com with GitHub Pages. Plain HTML, CSS and JavaScript, no build step for the pages themselves.

## Products on the site

- **Swaro** — commercial offline speech to text and text to speech for Windows and macOS on Apple Silicon. Complete 14-day trial, then a one-time $29 lifetime license. The payment provider is not chosen yet; until it is, the buy button emails the device code.
- **Jigsaw** — free, open-source (MIT) photo puzzle game for Android. Code and APK releases live at https://github.com/GulshanLabs/jigsaw-puzzle.

## Repository layout

GitHub Pages serves **only `docs/`** (Settings → Pages → branch `main`, folder `/docs`). Everything else in this repository is for editing the site and is never served.

```text
.
├── docs/                         ← the live site at nousvara.com
│   ├── index.html, products.html, about.html, philosophy.html, method.html
│   ├── terms.html, privacy-policy.html, refund-policy.html, 404.html
│   ├── products/                 ← swaro.html, swaro-pricing.html, swaro-changelog.html, jigsaw.html
│   ├── assets/products/          ← web-ready images only (.webp, og-*.jpg, .svg)
│   ├── css/style.css, js/site.js
│   ├── CNAME                     ← tells GitHub Pages the domain
│   ├── robots.txt, sitemap.xml   ← sitemap is generated, with dates
│   ├── llms.txt                  ← plain-text site summary for AI tools
│   └── .nojekyll
└── sources/                      ← not served
    ├── masters/                  ← full-size screenshots, icon and hero render
    ├── optimize_images.py        ← builds docs/assets/products/ from masters/
    ├── build_static.py           ← writes the footer into every page + sitemap.xml
    └── hero-family.html          ← source of the homepage hero graphic
```

## Working on another laptop

```bash
git clone https://github.com/Nousvara/website.git
cd website
python3 -m http.server 8080 --directory docs     # preview at http://localhost:8080/
```

The image script needs Pillow: `python3 -m pip install Pillow`.

## Everyday tasks

All commands run from the repository root.

| Task | What to do |
|---|---|
| Edit page text | Edit the page in `docs/`, then `python3 sources/build_static.py` to refresh the sitemap dates |
| Replace a screenshot | Save the new original in `sources/masters/` under the same name, run `python3 sources/optimize_images.py`, then raise the `?v=` number on that image in the page |
| Change the homepage hero graphic | Edit `sources/hero-family.html`, render it with the command at the top of that file, run `optimize_images.py`, raise `?v=` in `docs/index.html` |
| Change the footer | Edit it in `sources/build_static.py` **and** `footerHTML` in `docs/js/site.js`, then run `build_static.py` |
| Publish | `git add -A && git commit -m "…" && git push` |

## How the shared parts work

`docs/js/site.js` holds a `CATALOGUE` list with one entry per product. It drives the product's own header on its pages, the Products column of the JavaScript footer, and external links (checkout, downloads, source code).

Any element marked `data-link="product.name"` stays hidden until that URL is filled in the catalogue, and anything marked `data-link-missing="product.name"` shows instead. Filling in one URL switches on every button that uses it.

The footer is written into each page's HTML by `build_static.py`, so crawlers that don't run JavaScript still see the policy and contact links. `site.js` only adds a footer to a page that has none.

## Adding a product

1. Add an entry to `CATALOGUE` in `docs/js/site.js`.
2. Create its page in `docs/products/` by copying `jigsaw.html` (simple) or `swaro.html` (full).
3. Add its card to `docs/products.html` under the right category, and to the homepage grid.
4. Add it to `PRODUCTS` and `SITEMAP_PAGES` in `sources/build_static.py`, then run it.
5. Add it to `docs/llms.txt`.

## Still to set up

1. Once a payment provider is approved, add its checkout link to `CATALOGUE` → `swaro` → `urls.checkout`, and name the provider on the pricing, terms, privacy and refund pages.
2. For a new Jigsaw release, keep the APK name `jigsaw-puzzle.apk`; the site links to the latest release. Update the version, size and checksum on `docs/products/jigsaw.html`.
