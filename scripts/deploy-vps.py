"""Deploy Perfect Season Hub to VPS. Password via env VPS_PASS only (never commit)."""
from __future__ import annotations

import os
import sys
import tarfile
import tempfile
import time
from pathlib import Path

import paramiko

ROOT = Path(__file__).resolve().parents[1]
HOST = os.environ.get("VPS_HOST", "83.147.235.105")
USER = os.environ.get("VPS_USER", "root")
PASS = os.environ.get("VPS_PASS")
REMOTE = "/var/www/perfect-season"
APP_PORT = "3010"

EXCLUDE = {
    "node_modules",
    ".next",
    "out",
    "android",
    "www",
    ".git",
    "test-results",
    ".runtime",
    "data/raw",
}


def run(client: paramiko.SSHClient, cmd: str, timeout: int = 600) -> tuple[int, str, str]:
    print(f"$ {cmd}")
    _, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    code = stdout.channel.recv_exit_status()

    def safe(s: str) -> str:
        return s.encode("ascii", "replace").decode("ascii")

    if out.strip():
        print(safe(out[-3000:]))
    if err.strip():
        print("[stderr]", safe(err[-1500:]))
    print(f"[exit {code}]")
    return code, out, err


def main() -> int:
    if not PASS:
        print("Set VPS_PASS env var", file=sys.stderr)
        return 2

    with tempfile.TemporaryDirectory() as tmp:
        archive = Path(tmp) / "app.tar.gz"
        with tarfile.open(archive, "w:gz") as tar:
            for path in ROOT.rglob("*"):
                if not path.is_file():
                    continue
                rel = path.relative_to(ROOT).as_posix()
                if any(part in EXCLUDE for part in Path(rel).parts):
                    continue
                if rel.endswith((".apk", ".aab", ".keystore", ".pem")):
                    continue
                tar.add(path, arcname=rel)
        print(f"archive {archive.stat().st_size} bytes")

        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        last: Exception | None = None
        for attempt in range(1, 4):
            try:
                print(f"ssh connect attempt {attempt}")
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
                break
            except Exception as e:  # noqa: BLE001
                last = e
                print(f"connect failed: {e}")
                time.sleep(8)
        else:
            raise RuntimeError(f"SSH failed: {last}")

        sftp = client.open_sftp()
        run(client, "mkdir -p /tmp/psh-upload /var/www/perfect-season /var/lib/perfect-season")
        sftp.put(str(archive), "/tmp/psh-upload/app.tar.gz")
        sftp.close()

        run(client, f"tar -xzf /tmp/psh-upload/app.tar.gz -C {REMOTE}")
        code, _, _ = run(
            client,
            f"cd {REMOTE} && npm ci --omit=dev && node scripts/sync-public-data.mjs && npm run build",
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
Environment=NEXT_PUBLIC_SITE_URL=http://{HOST}:8088
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
        run(client, "systemctl is-active perfect-season; curl -sI http://127.0.0.1:3010/en | head -5")
        client.close()
        print("deploy OK")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
