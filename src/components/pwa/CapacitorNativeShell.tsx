"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

/** Native lifecycle hooks when running inside the Capacitor Android/iOS shell. */
export function CapacitorNativeShell() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    void StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    void StatusBar.setBackgroundColor({ color: "#0B0F14" }).catch(() => {});
    void SplashScreen.hide().catch(() => {});

    const sub = CapApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
        return;
      }
      void CapApp.exitApp();
    });

    return () => {
      void sub.then((h) => h.remove());
    };
  }, []);

  return null;
}
