import type { NextConfig } from "next";
import path from "path";

/** CAPACITOR=1 → static HTML/JS/CSS for the Android APK (no Node server). */
const capacitor = process.env.CAPACITOR === "1";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  ...(capacitor
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {
        // Presence WS process (npm run start:ws). Prod may still need nginx.
        async rewrites() {
          return [{ source: "/ws", destination: "http://127.0.0.1:3011/" }];
        },
      }),
};

export default nextConfig;
