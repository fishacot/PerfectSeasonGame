# VPS multiplayer runbook

Perfect Season now uses two local processes on VPS:

- Next.js app: `npm run start` (existing service, port from `PORT`)
- Room broadcaster: `npm run start:ws` (default `PSH_WS_PORT=3011`)

## Local development

For live room presence while developing:

```bash
npm run start:ws
```

In development the client connects to `ws://127.0.0.1:3011` directly.
In production it uses `/ws` (nginx proxy below).

Nginx should proxy `/ws` to the WS process:

```nginx
location /ws {
  proxy_pass http://127.0.0.1:3011;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_set_header Host $host;
}
```

Runtime account storage defaults to `.runtime/perfect-season.sqlite.json`.
Set `PERFECT_SEASON_DB=/var/lib/perfect-season/perfect-season.sqlite.json`
on VPS and back that file up with the normal deploy backup.

Minimal systemd unit:

```ini
[Unit]
Description=Perfect Season rooms
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/perfect-season
Environment=PSH_WS_PORT=3011
Environment=PERFECT_SEASON_DB=/var/lib/perfect-season/perfect-season.sqlite.json
ExecStart=/usr/bin/npm run start:ws
Restart=always

[Install]
WantedBy=multi-user.target
```
