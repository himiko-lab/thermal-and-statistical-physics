#!/usr/bin/env python3
"""
Server lokal untuk deck hasil build.

`python3 -m http.server` biasa tidak cukup: MIME type untuk .mjs dan .wasm
salah, sehingga browser menolak modul MediaPipe mentah-mentah.

Akses kamera butuh secure context, dan http://localhost termasuk di dalamnya,
jadi tidak perlu sertifikat apa pun.

    python3 serve.py             # sajikan dist/ di http://localhost:8011
    python3 serve.py 9000        # ganti port
    python3 serve.py --no-open   # jangan buka browser otomatis

Diadaptasi dari serve.py milik deck Sensatype.
"""

import http.server
import os
import socketserver
import sys
import webbrowser
from functools import partial

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

args = [a for a in sys.argv[1:] if not a.startswith("-")]
PORT = int(args[0]) if args else 8011
AUTO_OPEN = "--no-open" not in sys.argv


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".mjs": "text/javascript",
        ".js": "text/javascript",
        ".wasm": "application/wasm",
        ".task": "application/octet-stream",
    }

    def do_GET(self):
        # Buang header kondisional supaya tidak pernah menjawab 304 saat
        # latihan; kalau tidak, stylesheet yang baru diubah diam-diam tetap
        # menyajikan versi lama.
        del self.headers["If-Modified-Since"]
        del self.headers["If-None-Match"]
        super().do_GET()

    def end_headers(self):
        # Cross-origin isolation supaya runtime wasm boleh memakai thread.
        # Semua yang kita muat itu same-origin, jadi require-corp tidak
        # merugikan apa pun.
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "304" not in fmt % args:
            super().log_message(fmt, *args)


if __name__ == "__main__":
    if not os.path.isdir(ROOT):
        sys.exit(
            "\n  dist/ belum ada. Jalankan dulu:\n\n"
            "      npm install\n"
            "      npm run build\n"
        )

    socketserver.TCPServer.allow_reuse_address = True
    handler = partial(Handler, directory=ROOT)
    with socketserver.TCPServer(("127.0.0.1", PORT), handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"\n  Deck siap  ->  {url}\n  Ctrl+C untuk berhenti\n")
        if AUTO_OPEN:
            webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Berhenti.\n")
