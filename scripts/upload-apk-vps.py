"""Upload release APK to VPS for direct download (correct MIME, no Telegram corruption)."""
from __future__ import annotations

import os
import sys
from pathlib import Path

import paramiko

HOST = os.environ.get("VPS_HOST", "83.147.235.105")
USER = os.environ.get("VPS_USER", "root")
_PASS_FILE = Path.home() / ".perfect-season-vps"
PASS = os.environ.get("VPS_PASS") or (
    _PASS_FILE.read_text(encoding="utf-8").strip() if _PASS_FILE.is_file() else None
)
REMOTE_DIR = "/var/www/perfect-season-downloads"
APK_NAME = "perfect-season.apk"

DEFAULT_APK = Path.home() / "Desktop" / "PerfectSeason-app-release.apk"


def main() -> int:
    if not PASS:
        print("Set VPS_PASS or ~/.perfect-season-vps", file=sys.stderr)
        return 2

    apk = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_APK
    if not apk.is_file():
        print(f"APK not found: {apk}", file=sys.stderr)
        return 1

    size = apk.stat().st_size
    print(f"upload {apk} ({size} bytes)")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=60, allow_agent=False, look_for_keys=False)

    def run(cmd: str) -> None:
        print(f"$ {cmd}")
        _, o, e = client.exec_command(cmd, timeout=120)
        out = (o.read() + e.read()).decode("utf-8", "replace")
        if out.strip():
            print(out.encode("ascii", "replace").decode("ascii")[-2000:])

    run(f"mkdir -p {REMOTE_DIR}")
    sftp = client.open_sftp()
    remote = f"{REMOTE_DIR}/{APK_NAME}"
    sftp.put(str(apk), remote)
    sftp.close()

  # nginx snippet for perfectseason.duckdns.org
    nginx = f"""
# APK direct download (add inside server {{ }} for perfectseason.duckdns.org)
location = /download/perfect-season.apk {{
    alias {REMOTE_DIR}/{APK_NAME};
    default_type application/vnd.android.package-archive;
    add_header Content-Disposition 'attachment; filename="PerfectSeason.apk"';
}}
"""
    run(f"test -f {remote} && ls -la {remote}")
    client.close()

    print("\nupload OK")
    print(f"URL: https://perfectseason.duckdns.org/download/perfect-season.apk")
    print(f"Friend must see file size: {size} bytes")
    print("\nIf nginx 404, add to /etc/nginx/sites-enabled/perfectseason.duckdns.org:")
    print(nginx)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
