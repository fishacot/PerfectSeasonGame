"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/** Registers the installability service worker once on the client (web only). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    if (Capacitor.isNativePlatform()) return;
    if (process.env.NODE_ENV !== "production") {
      return;
    }
    void navigator.serviceWorker.register("/sw.js").catch(() => {
      /* ignore — SW is optional for browsing */
    });
  }, []);

  return null;
}
