# Nousvara website v2

Static product-house website for Nousvara, published at https://nousvara.com with GitHub Pages. It uses shared HTML, CSS and JavaScript without a build step.

## Public catalogue

- **Swaro** — commercial offline speech to text and text to speech for Windows and macOS on Apple Silicon. The site offers a complete 14-day trial and a one-time $29 lifetime license. The payment provider is not chosen yet; until it is, the buy button emails the device code.
- **Jigsaw** — free, open-source (MIT) photo puzzle game for Android. Code and APK releases live at https://github.com/GulshanLabs/jigsaw-puzzle.

Unfinished products are not published in the catalogue.

## Structure

This folder is exactly what gets published — nothing else belongs in it.

```text
website-v2/
├── index.html
├── products.html
├── philosophy.html
├── method.html               ← Unlearn First, linked from Philosophy and the footer
├── about.html
├── privacy-policy.html
├── terms.html
├── refund-policy.html
├── 404.html                  ← served by GitHub Pages for any missing URL
├── CNAME                     ← tells GitHub Pages the site's domain
├── robots.txt
├── sitemap.xml
├── products/
│   ├── swaro.html
│   ├── swaro-pricing.html    ← checkout with device-code check
│   ├── swaro-changelog.html
│   └── jigsaw.html
├── assets/products/          ← web-ready images only (.webp, og-*.jpg, .svg)
├── css/style.css
├── js/site.js
└── .nojekyll
```

Originals and tools are kept next to it in `../website-v2-sources/`, which is not published:

```text
website-v2-sources/
├── masters/                  ← full-size PNG/JPG screenshots and the hero render
├── optimize_images.py        ← builds the web-ready images from masters/
├── hero-family.html          ← source of the homepage hero graphic
└── …                         ← older mock-ups and design previews
```

## How the shared parts work

`js/site.js` holds a `CATALOGUE` list with one entry per product. It drives:

- the product's own header on its pages (name, links, call to action),
- the Products column in the footer,
- external links: checkout, downloads and source code.

Any element marked `data-link="product.name"` stays hidden until that URL is filled in the catalogue, and anything marked `data-link-missing="product.name"` shows instead. Filling in one URL therefore switches on every button that uses it.

## Adding a product

1. Add an entry to `CATALOGUE` in `js/site.js`.
2. Create its page in `products/` by copying `jigsaw.html` (simple) or `swaro.html` (full).
3. Add its card to `products.html` under the right category, and to the homepage grid.
4. Add its page to `sitemap.xml`.

## Jigsaw screenshots

The Jigsaw page shows four real phone screenshots, in the order a player sees them (home, choose grid, solve, settings). Their masters are `../website-v2-sources/masters/jigsaw_1.jpg` to `jigsaw_4.jpg`. To replace one, save a new screenshot under the same name and run the image script below; the Android navigation bar is cropped off automatically. The playable 3×3 demo uses `assets/products/jigsaw-demo.svg`, original artwork made for the site.

## Changing images

Put the new original in `../website-v2-sources/masters/`, then run:

```bash
python3 ../website-v2-sources/optimize_images.py
```

To change the homepage hero graphic, edit `../website-v2-sources/hero-family.html`; the render command is at the top of that file. After either change, raise the `?v=` number on the image in `index.html`.

## External setup still required

1. Once a payment provider is approved, add its checkout link to `CATALOGUE` → `swaro` → `urls.checkout`, and name the provider on the pricing, terms, privacy and refund pages.
2. For a new Jigsaw release, keep the APK file name `jigsaw-puzzle.apk`: the site links to the latest release, so nothing on the site needs to change. Update the version, size and checksum on `products/jigsaw.html`.

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.
