import type { NextConfig } from "next";
import path from "path";

/** CAPACITOR=1 → static HTML/JS/CSS for the Android APK (no Node server). */
const capacitor = process.env.CAPACITOR === "1";
/** On Vercel we can't proxy WS (serverless), but SSRed pages work fine. */
const onVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  ...(capacitor
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : onVercel
      ? {} // Vercel: all pages work, WS features unavailable
      : {
          async rewrites() {
            return [{ source: "/ws", destination: "http://127.0.0.1:3011/" }];
          },
        }),
};

export default nextConfig;
