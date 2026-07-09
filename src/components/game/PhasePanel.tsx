"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_SMOOTH } from "@/lib/game/spin-timing";

export function PhasePanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: EASE_SMOOTH }}
    >
      {children}
    </motion.div>
  );
}
