"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_SMOOTH } from "@/lib/game/spin-timing";

/** Soft enter fade for hub / sport shells — respects reduced-motion via CSS. */
export function PageFade({
  children,
  className = "",
  instant = false,
}: {
  children: ReactNode;
  className?: string;
  /** Skip enter animation — mode-select and loading shells feel snappier. */
  instant?: boolean;
}) {
  if (instant) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_SMOOTH }}
    >
      {children}
    </motion.div>
  );
}
