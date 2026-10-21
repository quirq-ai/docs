"""A stand-in for the services behind the xo server, on 127.0.0.1 only, for recording the docs
home page's xo commands. Every answer here is made up: two users (sam, who records, and alex, who
shares with sam), a fake Clerk Backend API (keys, users, metadata) and a fake XO core API (space
creates and GET /spaces/{id}). The shapes follow xo's own test fakes (quirq-ai/xo
tests/test_server.py FakeClerk, at 10937c6) and the core API's spec (src/xo/openapi.json).

It then runs the real `xo serve` against them, so every xo command recorded through it is the real
CLI and the real server; only the data is invented. Nothing here talks to Clerk, XO or xo.quirq.dev.

Usage: python3 xo-standin.py   (xo on PATH; serves on 127.0.0.1:8790, fakes on 127.0.0.1:8791)
The demo keys are below; they work only against this stand-in.
"""
import json
import os
import signal
import subprocess
import sys
import threading
import urllib.parse
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SERVE_PORT, FAKE_PORT = 8790, 8791
CLERK_SECRET = "sk_" + "standin_only"
KEYS = {  # built at runtime: not key-shaped literals
    "ak_" + "demo_sam": {"id": "ak_sam", "subject": "user_sam"},
    "ak_" + "demo_alex": {"id": "ak_alex", "subject": "user_alex"},
}
USERS = {
    "user_sam": {"id": "user_sam", "username": "sam", "first_name": "Sam", "created_at": 1760000000000,
                 "primary_email_address_id": "idn_1",
                 "email_addresses": [{"id": "idn_1", "email_address": "sam@example.com"}],
                 "public_metadata": {}, "private_metadata": {}},
    "user_alex": {"id": "user_alex", "username": "alex", "first_name": "Alex", "created_at": 1760000000000,
                  "primary_email_address_id": "idn_2",
                  "email_addresses": [{"id": "idn_2", "email_address": "alex@example.com"}],
                  "public_metadata": {}, "private_metadata": {}},
}
SPACES: dict[str, dict] = {}  # XO space id -> what the fake core made
lock = threading.Lock()


class Handler(BaseHTTPRequestHandler):
    def _serve(self) -> None:
        raw = self.rfile.read(int(self.headers.get("Content-Length") or 0))
        body = json.loads(raw) if raw else None
        with lock:
            status, out = self._core(body) if self.path.startswith("/core/") else self._clerk(body)
        data = json.dumps(out).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _caller(self):
        key = KEYS.get(self.headers.get("Authorization", "").removeprefix("Bearer "))
        return key and key["subject"]

    def _core(self, body):
        path = self.path[len("/core"):]
        who = self._caller()
        if who is None:
            return 401, {"success": False, "error": "Invalid API key"}
        if self.command == "POST" and path.strip("/") in ("claude-code", "codex", "antigravity", "hermes",
                                                          "openclaw", "xo-cowork", "nebius-openclaw"):
            sid = str(uuid.uuid5(uuid.NAMESPACE_URL, "standin/" + body["name"]))
            SPACES[sid] = {"id": sid, "name": body["name"], "owner": who, "type": path.strip("/")}
            return 201, {"success": True, "data": SPACES[sid]}
        if self.command == "GET" and path.startswith("/spaces/"):
            space = SPACES.get(path.split("/")[2])
            if space is None or space["owner"] != who:
                return 404, {"success": False, "error": "Space not found"}
            api = f"https://{space['name']}.spaces.example.com"
            return 200, {"success": True, "data": {"userId": who, "spaceName": space["name"], "spaceApiUrl": api,
                                                   "openClawRestartUrl": api + "/restart", "sharedUsers": []}}
        return 404, {"success": False, "error": "Not found"}

    def _clerk(self, body):
        if self.headers.get("Authorization") != f"Bearer {CLERK_SECRET}":
            return 401, {"errors": [{"code": "authentication_invalid"}]}
        if self.command == "POST" and self.path == "/v1/api_keys/verify":
            key = KEYS.get((body or {}).get("secret"))
            if key is None:
                return 404, {"errors": [{"code": "resource_not_found"}]}
            return 200, {**key, "claims": None, "revoked": False, "expired": False}
        if self.command == "GET" and self.path.startswith("/v1/users?"):
            query = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query)
            if "user_id" in query:
                return 200, [u for u in USERS.values() if u["id"] in query["user_id"]]
            return 200, [u for u in USERS.values() if u["username"] == query.get("username", [None])[0]]
        parts = self.path.split("/")  # "", v1, users, id[, metadata]
        user = USERS.get(parts[3]) if len(parts) > 3 and parts[2] == "users" else None
        if user is None:
            return 404, {"errors": [{"code": "resource_not_found"}]}
        if self.command == "PATCH" and parts[4:] == ["metadata"]:
            for bucket, changes in body.items():
                stored = user.setdefault(bucket, {})
                for k, v in changes.items():
                    stored.pop(k, None) if v is None else stored.__setitem__(k, v)
        return 200, user

    do_GET = do_POST = do_PATCH = _serve

    def log_message(self, *args) -> None:
        pass


def main() -> int:
    fake = ThreadingHTTPServer(("127.0.0.1", FAKE_PORT), Handler)
    threading.Thread(target=fake.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{FAKE_PORT}"
    env = {k: v for k, v in os.environ.items() if not k.startswith(("CLERK_", "XO_"))}
    env.update(CLERK_SECRET_KEY=CLERK_SECRET, CLERK_API_URL=base, XO_CORE_API_URL=base + "/core",
               NO_PROXY="127.0.0.1,localhost", no_proxy="127.0.0.1,localhost")
    for name in ("HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy"):
        env.pop(name, None)
    serve = subprocess.Popen(["xo", "serve", "--host", "127.0.0.1", "--port", str(SERVE_PORT)], env=env)
    # Stopping the stand-in stops xo serve too, so no server outlives its fakes.
    signal.signal(signal.SIGTERM, lambda *_: serve.terminate())
    try:
        return serve.wait()
    finally:
        serve.terminate()


if __name__ == "__main__":
    sys.exit(main())
