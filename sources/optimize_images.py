"""Builds the web-ready images the site serves from the original PNGs.

The PNG screenshots are kept as the masters. The site serves WebP copies
resized to the largest size anyone sees (the click-to-enlarge lightbox), which
keeps them sharp while cutting their weight by roughly ten times.

Run from the repository root:  python3 sources/optimize_images.py
Masters (PNG/JPG) live in sources/masters/ and are never served on the site;
the web-ready files are written into docs/assets/products/.
Needs Pillow (`python3 -m pip install Pillow`).
"""

from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
MASTERS = HERE / "masters"
ASSETS = HERE.parent / "docs" / "assets" / "products"

# Screenshots are shown up to about 1500 px wide in the lightbox. 1600 px keeps
# them crisp there and on high-density screens in the page itself.
SCREENSHOT_WIDTH = 1600
# 82 is where WebP text in UI screenshots stays clean; lower starts to smear.
SCREENSHOT_QUALITY = 82

SCREENSHOTS = [
    "swaro-record.png",
    "swaro-tts.png",
    "swaro-models.png",
    "swaro-settings-stt.png",
    "swaro-settings-tts.png",
    "swaro-about.png",
]

# Jigsaw phone screenshots (1080 px wide, taken on the phone). Replace a file
# with a new screenshot of the same name and rerun this script to update the site.
JIGSAW_SCREENS = ["jigsaw_1.jpg", "jigsaw_2.jpg", "jigsaw_3.jpg", "jigsaw_4.jpg"]
# Height of Android's navigation bar in those screenshots, in pixels.
JIGSAW_NAV_BAR = 150
# Shown up to ~340 px wide; 720 px keeps them sharp on 2x screens and in the lightbox.
JIGSAW_WIDTH = 720

# Shared-link previews: social sites expect 1200 x 630, and many still do not
# read WebP, so these stay JPEG.
OG_SIZE = (1200, 630)
OG_BACKGROUND = (11, 26, 43)  # the site's --hero colour, #0b1a2b


def save_webp(image: Image.Image, target: Path, quality: int) -> None:
    image.save(target, "WEBP", quality=quality, method=6)


def resized(image: Image.Image, width: int) -> Image.Image:
    if image.width <= width:
        return image.copy()
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.LANCZOS)


def fitted_on_background(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Scales an image to fit inside `size` and centres it on the brand colour."""
    canvas = Image.new("RGB", size, OG_BACKGROUND)
    scale = min(size[0] / image.width, size[1] / image.height)
    fitted = image.resize(
        (round(image.width * scale), round(image.height * scale)), Image.LANCZOS
    )
    canvas.paste(
        fitted.convert("RGB"),
        ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2),
    )
    return canvas


def main() -> None:
    for name in SCREENSHOTS:
        with Image.open(MASTERS / name) as source:
            save_webp(
                resized(source.convert("RGB"), SCREENSHOT_WIDTH),
                ASSETS / name.replace(".png", ".webp"),
                SCREENSHOT_QUALITY,
            )

    # Real Jigsaw phone screenshots, in the order a player sees them. The
    # Android navigation bar along the bottom is cropped off: it belongs to the
    # phone, not the app, and looks like clutter inside a drawn phone frame.
    for name in JIGSAW_SCREENS:
        with Image.open(MASTERS / name) as source:
            screen = source.convert("RGB")
            screen = screen.crop((0, 0, screen.width, screen.height - JIGSAW_NAV_BAR))
            save_webp(
                resized(screen, JIGSAW_WIDTH),
                ASSETS / name.replace(".jpg", ".webp"),
                SCREENSHOT_QUALITY,
            )

    # The hero graphic is rendered at 2x for sharp text on Retina screens.
    with Image.open(MASTERS / "hero-product-family.png") as source:
        save_webp(source.convert("RGB"), ASSETS / "hero-product-family.webp", 85)
        fitted_on_background(source, OG_SIZE).save(
            ASSETS / "og-nousvara.jpg", "JPEG", quality=86, optimize=True
        )

    with Image.open(MASTERS / "swaro-record.png") as source:
        fitted_on_background(source, OG_SIZE).save(
            ASSETS / "og-swaro.jpg", "JPEG", quality=86, optimize=True
        )

    # The icon is shown at 48-64 px; 192 px covers 3x screens.
    with Image.open(MASTERS / "swaro-icon.png") as source:
        source.resize((192, 192), Image.LANCZOS).save(
            ASSETS / "swaro-icon.webp", "WEBP", quality=90, method=6
        )

    for path in sorted(ASSETS.glob("*.webp")) + sorted(ASSETS.glob("og-*.jpg")):
        with Image.open(path) as built:
            print(f"{path.name:32} {built.width:>5}x{built.height:<5} {path.stat().st_size / 1024:7.0f} KB")


if __name__ == "__main__":
    main()
