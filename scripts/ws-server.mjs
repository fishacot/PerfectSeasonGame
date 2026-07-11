#!/usr/bin/env node
import { WebSocketServer } from "ws";

const port = Number(process.env.PSH_WS_PORT ?? 3011);
const wss = new WebSocketServer({ port });
const rooms = new Map();

function roomClients(roomId) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  return rooms.get(roomId);
}

function broadcast(roomId, payload, except) {
  const clients = roomClients(roomId);
  const text = JSON.stringify(payload);
  for (const client of clients) {
    if (client !== except && client.readyState === client.OPEN) {
      client.send(text);
    }
  }
}

wss.on("connection", (ws) => {
  let roomId = null;
  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(String(raw));
    } catch {
      return;
    }
    if (msg.type === "join" && typeof msg.roomId === "string") {
      roomId = msg.roomId.toUpperCase();
      roomClients(roomId).add(ws);
      broadcast(roomId, { type: "presence", count: roomClients(roomId).size }, null);
      return;
    }
    if (!roomId) return;
    broadcast(roomId, { ...msg, roomId, at: Date.now() }, ws);
  });
  ws.on("close", () => {
    if (!roomId) return;
    const clients = roomClients(roomId);
    clients.delete(ws);
    broadcast(roomId, { type: "presence", count: clients.size }, null);
    if (clients.size === 0) rooms.delete(roomId);
  });
});

console.log(`Perfect Season WS room server listening on :${port}`);
