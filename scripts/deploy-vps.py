"""Deploy Perfect Season Hub to VPS via git pull (fast). Password: env VPS_PASS or ~/.perfect-season-vps."""
from __future__ import annotations

import os
import sys
import time
from pathlib import Path

import paramiko

HOST = os.environ.get("VPS_HOST", "83.147.235.105")
USER = os.environ.get("VPS_USER", "root")
_PASS_FILE = Path.home() / ".perfect-season-vps"
PASS = os.environ.get("VPS_PASS") or (
    _PASS_FILE.read_text(encoding="utf-8").strip() if _PASS_FILE.is_file() else None
)
REMOTE = "/var/www/perfect-season"
REPO = os.environ.get("VPS_REPO", "https://github.com/fishacot/PerfectSeasonGame.git")
BRANCH = os.environ.get("VPS_BRANCH", "main")
APP_PORT = "3010"


def run(client: paramiko.SSHClient, cmd: str, timeout: int = 600) -> tuple[int, str, str]:
    print(f"$ {cmd}", flush=True)
    _, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    code = stdout.channel.recv_exit_status()

    def safe(s: str) -> str:
        return s.encode("ascii", "replace").decode("ascii")

    if out.strip():
        print(safe(out[-4000:]))
    if err.strip():
        print("[stderr]", safe(err[-2000:]))
    print(f"[exit {code}]", flush=True)
    return code, out, err


def connect() -> paramiko.SSHClient:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    last: Exception | None = None
    for attempt in range(1, 4):
        try:
            print(f"ssh connect attempt {attempt}", flush=True)
            client.connect(
                HOST,
                username=USER,
                password=PASS,
                timeout=60,
                banner_timeout=60,
                auth_timeout=60,
                allow_agent=False,
                look_for_keys=False,
            )
            return client
        except Exception as e:  # noqa: BLE001
            last = e
            print(f"connect failed: {e}", flush=True)
            time.sleep(8)
    raise RuntimeError(f"SSH failed: {last}")


def main() -> int:
    if not PASS:
        print("Set VPS_PASS env var or create ~/.perfect-season-vps", file=sys.stderr)
        return 2

    client = connect()
    run(client, "mkdir -p /var/lib/perfect-season")

    _, out, _ = run(client, f"test -d {REMOTE}/.git && echo yes || echo no")
    if "yes" not in out:
        print("first deploy: git clone (one-time)", flush=True)
        run(client, f"rm -rf {REMOTE}.bak {REMOTE}.old 2>/dev/null; mv {REMOTE} {REMOTE}.bak 2>/dev/null || true")
        code, _, _ = run(
            client,
            f"git clone --depth 1 -b {BRANCH} {REPO} {REMOTE}",
            timeout=600,
        )
        if code != 0:
            client.close()
            return code
    else:
        print("fast deploy: git pull", flush=True)
        code, _, _ = run(
            client,
            f"cd {REMOTE} && git fetch origin {BRANCH} && git reset --hard origin/{BRANCH}",
            timeout=120,
        )
        if code != 0:
            client.close()
            return code

    code, _, _ = run(
        client,
        f"cd {REMOTE} && npm ci && node scripts/sync-public-data.mjs && npm run build",
        timeout=1200,
    )
    if code != 0:
        client.close()
        return code

    unit = f"""[Unit]
Description=Perfect Season Hub
After=network.target

[Service]
Type=simple
WorkingDirectory={REMOTE}
Environment=NODE_ENV=production
Environment=PORT={APP_PORT}
Environment=PERFECT_SEASON_DB=/var/lib/perfect-season/perfect-season.sqlite.json
Environment=NEXT_PUBLIC_SITE_URL=https://perfectseason.duckdns.org
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
"""
    run(
        client,
        f"cat > /etc/systemd/system/perfect-season.service <<'EOF'\n{unit}EOF\n"
        "systemctl daemon-reload && systemctl enable perfect-season && systemctl restart perfect-season",
    )
    run(
        client,
        "systemctl is-active perfect-season; "
        "CSS=$(ls /var/www/perfect-season/.next/static/css 2>/dev/null | head -1); "
        "curl -sI http://127.0.0.1:3010/_next/static/css/$CSS | head -5; "
        "curl -sI http://127.0.0.1:3010/ru | head -5",
    )
    client.close()
    print("deploy OK", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
