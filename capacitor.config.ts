import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Bundled APK: game UI + data live in `out/` (Next static export).
 * No remote server.url — play works offline for Classic basketball.
 */
const config: CapacitorConfig = {
  appId: "com.perfectseasonhub.app",
  appName: "Perfect Season",
  webDir: "out",
  android: {
    allowMixedContent: false,
    backgroundColor: "#0B0F14",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#0B0F14",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0B0F14",
    },
  },
};

export default config;
