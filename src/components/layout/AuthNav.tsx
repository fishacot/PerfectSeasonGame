"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";

interface AuthNavProps {
  locale: Locale;
  labels: {
    friends: string;
    signIn: string;
    signOut: string;
  };
}

interface SessionUser {
  name: string;
  friendCode: string;
}

export function AuthNav({ locale, labels }: AuthNavProps) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setUser(data.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = async () => {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setUser(null);
  };

  return (
    <>
      <Link
        href={`/${locale}/friends`}
        className="rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted transition-all hover:bg-surface-hover hover:text-text sm:px-4 sm:py-2"
      >
        {user ? labels.friends : labels.signIn}
      </Link>
      {user && (
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted transition-all hover:bg-surface-hover hover:text-text sm:px-4 sm:py-2"
          title={user.friendCode}
        >
          {labels.signOut}
        </button>
      )}
    </>
  );
}
