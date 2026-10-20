"""Writes the parts of the site that crawlers must see without JavaScript.

1. The footer, written straight into every page's <div id="site-footer">.
   AI crawlers (GPTBot, ClaudeBot, PerplexityBot) usually do not run
   JavaScript, so a footer added by js/site.js alone is invisible to them,
   and with it the links to the terms, privacy, refund and contact details.
2. sitemap.xml, with each page's last-modified date taken from the file.

Normally run through the one update command:
    python3 sources/update.py

The footer here must match `footerHTML` in js/site.js, which is still used
as a fallback for any page that has no footer in its HTML.
"""

import datetime
import hashlib
import json
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "docs"
DOMAIN = "https://nousvara.com/"
YEAR = 2026

# Products listed in the footer, in catalogue order. Keep in step with
# CATALOGUE in js/site.js.
PRODUCTS = [("Swaro", "products/swaro.html"), ("Jigsaw", "products/jigsaw.html")]

# Pages in the sitemap, in the order search engines should meet them.
SITEMAP_PAGES = [
    "index.html", "products.html", "products/swaro.html", "products/swaro-pricing.html",
    "products/swaro-changelog.html", "products/jigsaw.html", "philosophy.html",
    "method.html", "about.html", "privacy-policy.html", "terms.html", "refund-policy.html",
]

WORDMARK = (
    '<span class="wm" role="img" aria-label="Nousvara">'
    '<svg class="wm-n" viewBox="0 0 87 100" aria-hidden="true" focusable="false">'
    '<rect class="wm-n-stem" x="0" y="0" width="18" height="100"/>'
    '<rect class="wm-n-stem" x="69" y="0" width="18" height="100"/>'
    '<polygon class="wm-n-diag" points="18,0 37,0 87,100 69,100"/>'
    '</svg>OUSVARA</span>'
)
ICON_EMAIL = ('<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"></rect>'
              '<path d="m3 7 9 6 9-6"></path></svg>')
ICON_LOCATION = ('<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path>'
                 '<circle cx="12" cy="10" r="2.5"></circle></svg>')


def footer(base: str, home_anchor: str) -> str:
    products = "".join(f'<a href="{base}{href}">{name}</a>' for name, href in PRODUCTS)
    return (
        '<footer class="footer"><div class="container">'
        '<div class="footer-top">'
        f'<div><div class="footer-logo">{WORDMARK}</div>'
        '<p>An independent software studio building private, offline-first tools, grounded in twenty years of embedded, IoT and cloud engineering.</p></div>'
        f'<div class="footer-col"><h5>Products</h5>{products}<a href="{base}products.html">All products</a></div>'
        '<div class="footer-col"><h5>Studio &amp; policies</h5>'
        f'<a href="{base}philosophy.html">Philosophy</a>'
        f'<a href="{base}method.html">The Unlearn First method</a>'
        f'<a href="{base}about.html">About</a>'
        f'<a href="{base}privacy-policy.html">Privacy policy</a>'
        f'<a href="{base}terms.html">Terms &amp; license</a>'
        f'<a href="{base}refund-policy.html">Refund policy</a></div>'
        '<div class="footer-col"><h5>Contact</h5>'
        '<div class="footer-contact" aria-label="Contact Nousvara" style="flex-direction:column;align-items:flex-start;gap:12px;">'
        f'<a href="mailto:contact@nousvara.com">{ICON_EMAIL}<span>contact@nousvara.com</span></a>'
        f'<span>{ICON_LOCATION}<span>Gurugram, India · building globally</span></span>'
        '</div></div>'
        '</div>'
        '<div class="footer-bottom"><span class="made">Built in India, <b>for people everywhere.</b></span>'
        f'<span>© {YEAR} Nousvara. All rights reserved.</span></div>'
        '</div></footer>'
    )


FOOTER_SLOT = re.compile(r'<div id="site-footer">.*?</div>\s*(?=<script)', re.S)


def write_footers() -> None:
    pages = sorted(SITE.glob("*.html")) + sorted((SITE / "products").glob("*.html"))
    for page in pages:
        in_products = page.parent.name == "products"
        # 404.html sets <base href="/">, so it uses root-relative links.
        base = "../" if in_products else ""
        text = page.read_text(encoding="utf-8")
        new = FOOTER_SLOT.sub(f'<div id="site-footer">{footer(base, "")}</div>', text, count=1)
        if new == text and "<div id=\"site-footer\">" not in text:
            print("  no footer slot:", page.relative_to(SITE))
            continue
        if new != text:
            page.write_text(new, encoding="utf-8")
            print("  footer:", page.relative_to(SITE))


# Each page's content fingerprint and the date it last changed. File dates
# can't be used: a fresh `git clone` stamps every file with the clone date,
# which would tell search engines that every page changed that day.
DATES_FILE = Path(__file__).resolve().parent / "page-dates.json"


# Breadcrumb trail for each page: the names shown in Google instead of the
# raw address. Add a line here when you add a page.
BREADCRUMBS = {
    "products.html": [("Products", "products.html")],
    "products/swaro.html": [("Products", "products.html"), ("Swaro", "products/swaro.html")],
    "products/swaro-pricing.html": [("Products", "products.html"), ("Swaro", "products/swaro.html"), ("Pricing", "products/swaro-pricing.html")],
    "products/swaro-changelog.html": [("Products", "products.html"), ("Swaro", "products/swaro.html"), ("Changelog", "products/swaro-changelog.html")],
    "products/jigsaw.html": [("Products", "products.html"), ("Jigsaw", "products/jigsaw.html")],
    "about.html": [("About", "about.html")],
    "philosophy.html": [("Philosophy", "philosophy.html")],
    "method.html": [("Philosophy", "philosophy.html"), ("The Unlearn First method", "method.html")],
    "terms.html": [("Terms and license", "terms.html")],
    "privacy-policy.html": [("Privacy policy", "privacy-policy.html")],
    "refund-policy.html": [("Refund policy", "refund-policy.html")],
}

# The block this script owns. Everything between the markers is rewritten on
# every run, so never edit it by hand; change the page or the lists above.
GENERATED = re.compile(r"\n?\s*<!-- generated:structured-data -->.*?<!-- /generated:structured-data -->", re.S)


def _text(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).replace(" .", ".").replace(" ,", ",").strip()


def structured_data(rel: str, html: str) -> list[dict]:
    blocks = []
    trail = BREADCRUMBS.get(rel)
    if trail:
        items = [("Home", "")] + trail
        blocks.append({
            "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "name": name, "item": DOMAIN + href}
                for i, (name, href) in enumerate(items)
            ],
        })
    # Questions and answers taken from the page's visible FAQ section, so the
    # data always matches what visitors read.
    faq = re.search(r'<section[^>]*id="faq".*?</section>', html, re.S)
    if faq:
        pairs = re.findall(r"<summary>(.*?)</summary>\s*<div class=\"ac-body\">(.*?)</div>\s*</details>", faq.group(0), re.S)
        if pairs:
            blocks.append({
                "@context": "https://schema.org", "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": _text(q), "acceptedAnswer": {"@type": "Answer", "text": _text(a)}}
                    for q, a in pairs
                ],
            })
    return blocks


def write_structured_data() -> None:
    for rel in SITEMAP_PAGES:
        path = SITE / rel
        text = path.read_text(encoding="utf-8")
        clean = GENERATED.sub("", text)
        blocks = structured_data(rel, clean)
        if blocks:
            scripts = "\n  ".join(
                '<script type="application/ld+json">' + json.dumps(b, ensure_ascii=False, separators=(",", ":")) + "</script>"
                for b in blocks
            )
            clean = clean.replace("</head>", f"\n  <!-- generated:structured-data -->\n  {scripts}\n  <!-- /generated:structured-data -->\n</head>", 1)
        if clean != text:
            path.write_text(clean, encoding="utf-8")
            print("  structured data:", rel)


def write_sitemap() -> None:
    known = json.loads(DATES_FILE.read_text()) if DATES_FILE.exists() else {}
    today = datetime.date.today().isoformat()
    rows = []
    for rel in SITEMAP_PAGES:
        path = SITE / rel
        fingerprint = hashlib.sha256(path.read_bytes()).hexdigest()
        entry = known.get(rel)
        if not entry or entry["sha256"] != fingerprint:
            entry = {"sha256": fingerprint, "lastmod": today}
            known[rel] = entry
        modified = entry["lastmod"]
        loc = DOMAIN if rel == "index.html" else DOMAIN + rel
        rows.append(f"  <url><loc>{loc}</loc><lastmod>{modified}</lastmod></url>")
    (SITE / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(rows) + "\n</urlset>\n",
        encoding="utf-8",
    )
    DATES_FILE.write_text(json.dumps(known, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"  sitemap: {len(rows)} pages with dates")


if __name__ == "__main__":
    write_footers()
    write_structured_data()
    write_sitemap()  # last, so its dates see the finished pages
