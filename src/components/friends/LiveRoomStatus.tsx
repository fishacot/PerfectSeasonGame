"use client";

import { useEffect, useState } from "react";

function roomWsUrl(): string {
  // Next rewrites often drop WebSocket Upgrade — hit the room process directly in dev.
  if (process.env.NODE_ENV === "development") {
    return "ws://127.0.0.1:3011";
  }
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}/ws`;
}

export function LiveRoomStatus({ roomId, locale }: { roomId: string; locale: string }) {
  const [count, setCount] = useState(1);
  const [connected, setConnected] = useState(false);
  const ru = locale === "ru";

  useEffect(() => {
    const socket = new WebSocket(roomWsUrl());
    socket.addEventListener("open", () => {
      setConnected(true);
      socket.send(JSON.stringify({ type: "join", roomId }));
    });
    socket.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(String(event.data));
        if (msg.type === "presence") setCount(Number(msg.count ?? 1));
      } catch {
        // ignore malformed room telemetry
      }
    });
    socket.addEventListener("close", () => setConnected(false));
    return () => socket.close();
  }, [roomId]);

  return (
    <div className="page-shell pt-5">
      <div className="mx-auto max-w-2xl rounded-2xl border border-sport/25 bg-sport/10 px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-sport">
        {ru ? "Live-комната" : "Live room"} {roomId} ·{" "}
        {connected
          ? ru
            ? `${count}/2 игроков онлайн`
            : `${count}/2 players online`
          : ru
            ? "подключение..."
            : "connecting..."}
      </div>
    </div>
  );
}
