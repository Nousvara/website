"""The one command to run after changing anything on the site.

    python3 sources/update.py

It rebuilds the web images from sources/masters/ (only if Pillow is
installed), then writes the footer into every page and refreshes sitemap.xml.
Running it when nothing changed is harmless: it changes nothing.
"""

import importlib.util
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def run(script: str) -> None:
    print(f"→ {script}")
    subprocess.run([sys.executable, str(HERE / script)], check=True)


if importlib.util.find_spec("PIL") is None:
    print("→ optimize_images.py skipped: Pillow is not installed.")
    print("  Images are fine unless you changed something in sources/masters/.")
    print("  To install it:  python3 -m pip install Pillow")
else:
    run("optimize_images.py")
run("build_static.py")
print("Done. Now preview, then commit and push (see README).")
