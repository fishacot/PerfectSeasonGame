import { cookies } from "next/headers";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { createHash, randomUUID } from "crypto";

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  friendCode: string;
  createdAt: number;
  lastSeenAt: number;
}

export interface Friendship {
  id: string;
  fromId: string;
  toId: string;
  status: "pending" | "accepted";
  createdAt: number;
}

export interface GameInvite {
  id: string;
  roomId: string;
  fromId: string;
  toId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: number;
}

interface StoreShape {
  users: AccountUser[];
  friendships: Friendship[];
  invites: GameInvite[];
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  friendCode: string;
  lastSeenAt: number;
}

const STORE_PATH =
  process.env.PERFECT_SEASON_DB ??
  join(process.cwd(), ".runtime", "perfect-season.sqlite.json");
const SESSION_COOKIE = "psh_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function emptyStore(): StoreShape {
  return { users: [], friendships: [], invites: [] };
}

function readStore(): StoreShape {
  if (!existsSync(STORE_PATH)) return emptyStore();
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf8")) as StoreShape;
  } catch {
    return emptyStore();
  }
}

function writeStore(store: StoreShape): void {
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function hashPassword(password: string): string {
  return createHash("sha256")
    .update(`psh:${password}`)
    .digest("hex");
}

function friendCode(name: string, store: StoreShape): string {
  const base = name
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 5)
    .toUpperCase() || "PSH";
  let code = "";
  do {
    code = `${base}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  } while (store.users.some((u) => u.friendCode === code));
  return code;
}

export function toPublicUser(user: AccountUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    friendCode: user.friendCode,
    lastSeenAt: user.lastSeenAt,
  };
}

export async function currentUser(): Promise<PublicUser | null> {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!session) return null;
  const store = readStore();
  const user = store.users.find((u) => u.id === session);
  if (!user) return null;
  user.lastSeenAt = Date.now();
  writeStore(store);
  return toPublicUser(user);
}

export async function setSession(userId: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export function registerAccount(
  name: string,
  email: string,
  password: string,
): PublicUser {
  const cleanName = name.trim().slice(0, 32);
  const cleanEmail = email.trim().toLowerCase();
  if (cleanName.length < 2) throw new Error("name");
  if (!cleanEmail.includes("@")) throw new Error("email");
  if (password.length < 4) throw new Error("password");

  const store = readStore();
  if (store.users.some((u) => u.email === cleanEmail)) {
    throw new Error("exists");
  }
  const user: AccountUser = {
    id: randomUUID(),
    name: cleanName,
    email: cleanEmail,
    passwordHash: hashPassword(password),
    friendCode: friendCode(cleanName, store),
    createdAt: Date.now(),
    lastSeenAt: Date.now(),
  };
  store.users.push(user);
  writeStore(store);
  return toPublicUser(user);
}

export function loginAccount(email: string, password: string): PublicUser {
  const store = readStore();
  const user = store.users.find(
    (u) =>
      u.email === email.trim().toLowerCase() &&
      u.passwordHash === hashPassword(password),
  );
  if (!user) throw new Error("invalid");
  user.lastSeenAt = Date.now();
  writeStore(store);
  return toPublicUser(user);
}

export function friendsSnapshot(userId: string) {
  const store = readStore();
  const friends = store.friendships
    .filter(
      (f) =>
        f.status === "accepted" && (f.fromId === userId || f.toId === userId),
    )
    .map((f) => f.fromId === userId ? f.toId : f.fromId)
    .map((id) => store.users.find((u) => u.id === id))
    .filter((u): u is AccountUser => Boolean(u))
    .map(toPublicUser);
  const incoming = store.friendships
    .filter((f) => f.status === "pending" && f.toId === userId)
    .map((f) => ({
      id: f.id,
      user: toPublicUser(store.users.find((u) => u.id === f.fromId)!),
    }));
  const outgoing = store.friendships
    .filter((f) => f.status === "pending" && f.fromId === userId)
    .map((f) => ({
      id: f.id,
      user: toPublicUser(store.users.find((u) => u.id === f.toId)!),
    }));
  const invites = store.invites
    .filter((i) => i.toId === userId && i.status === "pending")
    .map((i) => ({
      ...i,
      from: toPublicUser(store.users.find((u) => u.id === i.fromId)!),
    }));
  return { friends, incoming, outgoing, invites };
}

export function sendFriendRequest(userId: string, codeOrEmail: string): void {
  const store = readStore();
  const target = store.users.find(
    (u) =>
      u.friendCode.toLowerCase() === codeOrEmail.trim().toLowerCase() ||
      u.email === codeOrEmail.trim().toLowerCase(),
  );
  if (!target || target.id === userId) throw new Error("target");
  const exists = store.friendships.some(
    (f) =>
      (f.fromId === userId && f.toId === target.id) ||
      (f.fromId === target.id && f.toId === userId),
  );
  if (exists) return;
  store.friendships.push({
    id: randomUUID(),
    fromId: userId,
    toId: target.id,
    status: "pending",
    createdAt: Date.now(),
  });
  writeStore(store);
}

export function acceptFriendRequest(userId: string, id: string): void {
  const store = readStore();
  const req = store.friendships.find(
    (f) => f.id === id && f.toId === userId && f.status === "pending",
  );
  if (!req) throw new Error("request");
  req.status = "accepted";
  writeStore(store);
}

export function sendInvite(userId: string, friendId: string): GameInvite {
  const store = readStore();
  const isFriend = store.friendships.some(
    (f) =>
      f.status === "accepted" &&
      ((f.fromId === userId && f.toId === friendId) ||
        (f.fromId === friendId && f.toId === userId)),
  );
  if (!isFriend) throw new Error("friend");
  const invite: GameInvite = {
    id: randomUUID(),
    roomId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    fromId: userId,
    toId: friendId,
    status: "pending",
    createdAt: Date.now(),
  };
  store.invites.push(invite);
  writeStore(store);
  return invite;
}

export function respondInvite(
  userId: string,
  inviteId: string,
  status: "accepted" | "declined",
): GameInvite {
  const store = readStore();
  const invite = store.invites.find(
    (i) => i.id === inviteId && i.toId === userId && i.status === "pending",
  );
  if (!invite) throw new Error("invite");
  invite.status = status;
  writeStore(store);
  return invite;
}
