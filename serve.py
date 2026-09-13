#!/usr/bin/env python3
"""
Serves the built site on one port.

MkDocs has no production server of its own — `mkdocs serve` is a development
server, and it serves one config, which here would mean one language. The
built output is plain static files, so this serves them directly and the
reverse-proxy vhost in front does not have to change: it still proxies to
127.0.0.1:3100, it just reaches files now instead of Next.js.

Standard library only, so there is nothing to keep up to date.
"""

from __future__ import annotations

import argparse
import os
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# Where "/" goes. English rather than Finnish because the site says so itself:
# where the language versions differ, English wins. One word to change.
DEFAULT_LANG = "en"

LANGS = ("fi", "en")

# Fingerprinted assets could be cached hard, but mkdocs does not fingerprint
# them, so everything is revalidated instead. The proxy adds no-cache of its
# own on top; this is the origin being honest rather than the last word.
CACHE_CONTROL = "public, max-age=0, must-revalidate"


class SiteHandler(SimpleHTTPRequestHandler):
    server_version = "common-time-docs"
    sys_version = ""

    # Match what the pages actually are, and stop the browser guessing.
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".svg": "image/svg+xml",
        ".woff2": "font/woff2",
        ".xml": "application/xml; charset=utf-8",
    }

    def do_GET(self):  # noqa: N802 — the base class spells it this way
        if self._redirect_root():
            return
        super().do_GET()

    def do_HEAD(self):  # noqa: N802
        if self._redirect_root():
            return
        super().do_HEAD()

    def _redirect_root(self) -> bool:
        """The site root is a choice of language, not a page."""
        if self.path not in ("/", ""):
            return False
        self.send_response(HTTPStatus.FOUND)
        self.send_header("Location", f"/{DEFAULT_LANG}/")
        self.send_header("Content-Length", "0")
        self.end_headers()
        return True

    def end_headers(self):
        self.send_header("Cache-Control", CACHE_CONTROL)
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        """Serve the built 404 page of whichever language was being read."""
        if code == HTTPStatus.NOT_FOUND:
            lang = self.path.lstrip("/").split("/", 1)[0]
            if lang not in LANGS:
                lang = DEFAULT_LANG
            page = Path(self.directory) / lang / "404.html"
            if page.is_file():
                body = page.read_bytes()
                self.send_response(HTTPStatus.NOT_FOUND, "Not Found")
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(body)
                return
        super().send_error(code, message, explain)

    def log_message(self, fmt, *args):
        """journald already stamps the time; the default line repeats it."""
        print(f"{self.address_string()} {fmt % args}", flush=True)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=3100)
    ap.add_argument(
        "--root",
        default=str(Path(__file__).resolve().parent / "site"),
        help="directory holding the per-language builds",
    )
    args = ap.parse_args()

    root = Path(args.root).resolve()
    missing = [lang for lang in LANGS if not (root / lang / "index.html").is_file()]
    if missing:
        # Failing here beats serving a directory listing of an empty tree.
        raise SystemExit(f"not built: {', '.join(missing)} (run ./build.sh) under {root}")

    handler = partial(SiteHandler, directory=str(root))
    with ThreadingHTTPServer((args.host, args.port), handler) as httpd:
        print(f"serving {root} on http://{args.host}:{args.port} (/ -> /{DEFAULT_LANG}/)", flush=True)
        httpd.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
