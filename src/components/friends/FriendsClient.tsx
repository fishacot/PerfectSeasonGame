"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/types";

interface PublicUser {
  id: string;
  name: string;
  email: string;
  friendCode: string;
  lastSeenAt: number;
}

interface Snapshot {
  user: PublicUser | null;
  friends?: PublicUser[];
  incoming?: { id: string; user: PublicUser }[];
  outgoing?: { id: string; user: PublicUser }[];
  invites?: {
    id: string;
    roomId: string;
    from: PublicUser;
    createdAt: number;
  }[];
}

export function FriendsClient({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<Snapshot>({ user: null });
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [now, setNow] = useState(0);

  const ru = locale === "ru";

  const refresh = async () => {
    const auth = await fetch("/api/auth/session").then((r) => r.json());
    if (!auth.user) {
      setSnapshot({ user: null });
      return;
    }
    const data = await fetch("/api/friends").then((r) => r.json());
    setSnapshot(data);
  };

  useEffect(() => {
    setNow(Date.now());
    void refresh();
    const id = window.setInterval(() => {
      setNow(Date.now());
      void refresh();
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const auth = async () => {
    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: mode, name, email, password }),
    });
    if (!res.ok) {
      setMessage(ru ? "Не получилось войти" : "Sign-in failed");
      return;
    }
    setMessage(null);
    await refresh();
  };

  const friendAction = async (body: Record<string, string>) => {
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setMessage(ru ? "Действие не удалось" : "Action failed");
      return null;
    }
    const data = await res.json();
    setSnapshot(data);
    setMessage(null);
    return data;
  };

  const sendInvite = async (friendId: string) => {
    const data = await friendAction({ action: "invite", friendId });
    if (data?.invite?.roomId) {
      router.push(`/${locale}/basketball/live/${data.invite.roomId}`);
    }
  };

  const respondInvite = async (id: string, status: "accepted" | "declined") => {
    const data = await friendAction({ action: "invite-response", id, status });
    if (status === "accepted" && data?.invite?.roomId) {
      router.push(`/${locale}/basketball/live/${data.invite.roomId}`);
    }
  };

  if (!snapshot.user) {
    return (
      <div className="page-shell mx-auto max-w-xl py-10">
        <div className="rounded-3xl border border-white/10 bg-surface/70 p-5 backdrop-blur-md sm:p-8">
          <h1 className="font-display text-4xl tracking-tight text-sport">
            {ru ? "АККАУНТ" : "ACCOUNT"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {ru
              ? "Играть можно гостем, но live 1 на 1 с друзьями требует аккаунт."
              : "You can play as a guest, but live 1v1 with friends requires an account."}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {(["register", "login"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`rounded-xl py-3 text-[10px] font-black uppercase tracking-widest ${
                  mode === m ? "bg-sport text-bg" : "border border-white/10 text-muted"
                }`}
                onClick={() => setMode(m)}
              >
                {m === "register" ? (ru ? "Создать" : "Create") : (ru ? "Войти" : "Login")}
              </button>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {mode === "register" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={ru ? "Ник" : "Name"}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-sport"
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-sport"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={ru ? "Пароль" : "Password"}
              type="password"
              className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-sport"
            />
            <button
              type="button"
              className="rounded-2xl bg-sport py-4 font-display text-xl tracking-widest text-bg"
              onClick={() => void auth()}
            >
              {(mode === "register" ? (ru ? "Создать" : "Create") : (ru ? "Войти" : "Login")).toUpperCase()}
            </button>
            {message && <p className="text-center text-xs text-red-300">{message}</p>}
          </div>
        </div>
      </div>
    );
  }

  const friends = snapshot.friends ?? [];
  const incoming = snapshot.incoming ?? [];
  const outgoing = snapshot.outgoing ?? [];
  const invites = snapshot.invites ?? [];

  return (
    <div className="page-shell mx-auto max-w-4xl py-8 sm:py-12">
      <div className="mb-6 rounded-3xl border border-sport/20 bg-sport/10 p-5 text-center backdrop-blur-md">
        <p className="micro-label text-muted">{ru ? "Ваш код друга" : "Your friend code"}</p>
        <h1 className="mt-1 font-display text-4xl tracking-widest text-sport">
          {snapshot.user.friendCode}
        </h1>
        <p className="mt-2 text-sm text-muted">{snapshot.user.name}</p>
      </div>

      {invites.length > 0 && (
        <div className="mb-6 rounded-3xl border border-red-400/25 bg-red-500/10 p-5">
          <h2 className="font-display text-2xl text-red-200">
            {ru ? "ПРИГЛАШЕНИЯ" : "INVITES"}
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {invites.map((invite) => (
              <div key={invite.id} className="flex flex-col gap-3 rounded-2xl bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-bold text-text">
                  {invite.from.name} {ru ? "зовёт сыграть" : "wants to play"}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-xl bg-sport px-4 py-2 text-[10px] font-black uppercase text-bg"
                    onClick={() => void respondInvite(invite.id, "accepted")}
                  >
                    {ru ? "Принять" : "Accept"}
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 px-4 py-2 text-[10px] font-black uppercase text-muted"
                    onClick={() => void respondInvite(invite.id, "declined")}
                  >
                    {ru ? "Нет" : "Decline"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-3xl border border-white/10 bg-surface/70 p-5 backdrop-blur-md">
          <h2 className="font-display text-2xl text-sport">
            {ru ? "ДОБАВИТЬ ДРУГА" : "ADD FRIEND"}
          </h2>
          <p className="mt-2 text-xs text-muted">
            {ru ? "Введи код друга или email." : "Enter a friend code or email."}
          </p>
          <div className="mt-4 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={ru ? "Код или email" : "Code or email"}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-sport"
            />
            <button
              type="button"
              className="rounded-xl bg-sport px-4 text-[10px] font-black uppercase text-bg"
              onClick={() => void friendAction({ action: "add", code })}
            >
              {ru ? "Добавить" : "Add"}
            </button>
          </div>
          {message && <p className="mt-3 text-xs text-muted">{message}</p>}
          {outgoing.length > 0 && (
            <p className="mt-4 text-xs text-muted">
              {ru ? "Ожидают ответа: " : "Pending: "}
              {outgoing.map((o) => o.user.name).join(", ")}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-surface/70 p-5 backdrop-blur-md">
          <h2 className="font-display text-2xl text-sport">
            {ru ? "ДРУЗЬЯ" : "FRIENDS"}
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {incoming.map((req) => (
              <div key={req.id} className="flex items-center justify-between rounded-2xl border border-sport/20 bg-sport/5 p-4">
                <span className="font-bold">{req.user.name}</span>
                <button
                  type="button"
                  className="rounded-xl bg-sport px-4 py-2 text-[10px] font-black uppercase text-bg"
                  onClick={() => void friendAction({ action: "accept", id: req.id })}
                >
                  {ru ? "Принять" : "Accept"}
                </button>
              </div>
            ))}
            {friends.length === 0 && incoming.length === 0 && (
              <p className="rounded-2xl border border-white/10 bg-black/20 p-5 text-center text-sm text-muted">
                {ru ? "Пока нет друзей." : "No friends yet."}
              </p>
            )}
            {friends.map((friend) => (
              <div key={friend.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-text">{friend.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted">
                    {now - friend.lastSeenAt < 90_000
                      ? (ru ? "онлайн" : "online")
                      : (ru ? "не в сети" : "offline")}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-xl bg-sport px-5 py-3 text-[10px] font-black uppercase tracking-widest text-bg"
                  onClick={() => void sendInvite(friend.id)}
                >
                  {ru ? "Играть" : "Play"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
