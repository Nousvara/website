# Nousvara website

The website for https://nousvara.com. Plain HTML, CSS and JavaScript, published with GitHub Pages.

---

## After you change anything: the checklist

Run every command from this repository's top folder (the one containing `docs/` and `sources/`).

**1. Make your change.**

| You want to… | Do this |
|---|---|
| Change text on a page | Edit the page in `docs/` (for example `docs/about.html`) |
| Add or replace a screenshot or picture | Put the full-size original in `sources/masters/`. Replacing one? Keep the **exact same file name**. Then, in the page that shows it, raise the `?v=` number after the image name by one (for example `jigsaw_2.webp?v=2` becomes `?v=3`) so browsers load the new one |
| Use a brand-new picture | As above, then add its file name to the lists at the top of `sources/optimize_images.py` (`SCREENSHOTS` for desktop screenshots, `JIGSAW_SCREENS` for phone screenshots) and put it in the page as `../assets/products/NAME.webp` |
| Change the footer | Edit it in **both** `sources/build_static.py` and `footerHTML` in `docs/js/site.js` |
| Add a new product | See "Adding a product" below |

**2. Run the update command** (always; it's harmless if nothing needs updating):

```bash
python3 sources/update.py
```

It makes the small web versions of your pictures, writes the footer into every page, and updates the sitemap dates for the pages you changed.

**3. Preview on your laptop:**

```bash
python3 -m http.server 8080 --directory docs
```

Open http://localhost:8080/ and press **Cmd+Shift+R** (Windows: **Ctrl+Shift+R**) to see the newest version. Press **Ctrl+C** in Terminal to stop the preview.

**4. Publish:**

```bash
git pull
git add -A
git status
git commit -m "Say what you changed"
git push
```

`git status` lists what will be published; check it looks right. The live site updates 1–2 minutes after the push.

**Never delete:** `docs/CNAME`, `docs/BingSiteAuth.xml`, `docs/.nojekyll`, and the `google-site-verification` TXT record in Cloudflare. The site or its Google and Bing access depend on them.

---

## Setting up on a new laptop

```bash
git clone https://github.com/Nousvara/website.git
cd website
python3 -m pip install Pillow      # needed only for pictures
```

Everything else works with the Python that comes with macOS or Windows.

## What is where

GitHub Pages serves **only `docs/`** (Settings → Pages → branch `main`, folder `/docs`). Nothing in `sources/` appears on nousvara.com.

```text
.
├── docs/                         ← the live site at nousvara.com
│   ├── index.html, products.html, about.html, philosophy.html, method.html
│   ├── terms.html, privacy-policy.html, refund-policy.html, 404.html
│   ├── products/                 ← swaro.html, swaro-pricing.html, swaro-changelog.html, jigsaw.html
│   ├── assets/products/          ← web-ready pictures only, made by update.py; don't edit by hand
│   ├── css/style.css, js/site.js
│   ├── sitemap.xml               ← made by update.py; don't edit by hand
│   ├── llms.txt                  ← plain-text summary of the site for AI tools
│   ├── robots.txt, CNAME, BingSiteAuth.xml, .nojekyll
└── sources/                      ← not published
    ├── update.py                 ← the one command to run (see the checklist)
    ├── masters/                  ← full-size originals of every picture
    ├── optimize_images.py        ← makes docs/assets/products/ from masters/
    ├── build_static.py           ← writes the footer into pages and makes sitemap.xml
    ├── page-dates.json           ← remembers when each page last changed (used for the sitemap)
    └── hero-family.html          ← source of the homepage's two-product picture
```

## Adding a product

1. In `docs/js/site.js`, add an entry to `CATALOGUE` (name, pages, header links, button, download links).
2. Copy `docs/products/jigsaw.html` (simple page) or `docs/products/swaro.html` (full page) to `docs/products/NEW.html` and edit it.
3. Add the product's card to `docs/products.html` under the right category, and to the grid on `docs/index.html`.
4. In `sources/build_static.py`, add it to `PRODUCTS` (footer) and `SITEMAP_PAGES` (sitemap).
5. Add a line about it to `docs/llms.txt`.
6. Follow the checklist from step 2.

Optional: to show it in the homepage's two-product picture, edit `sources/hero-family.html`, render it with the command written at the top of that file, then run `update.py` and raise the `?v=` number on that picture in `docs/index.html`.

## How the shared parts work

- `docs/js/site.js` builds the top menu for every page, and a product's own menu on its pages, from the `CATALOGUE` list.
- A button marked `data-link="product.name"` stays hidden until that link is filled in `CATALOGUE`. Anything marked `data-link-missing="product.name"` shows until then. Filling in one link switches on every button that uses it.
- The footer is written into each page's HTML by `update.py`, so search engines and AI tools that don't run JavaScript still see the policy and contact links.

## Still to set up

1. **Payments:** once a provider is approved, add its checkout link to `CATALOGUE` → `swaro` → `urls.checkout`, and name the provider on the pricing, terms, privacy and refund pages.
2. **New Jigsaw release:** keep the APK name `jigsaw-puzzle.apk` (the site always links to the latest release), and update the version, size and checksum on `docs/products/jigsaw.html`.
