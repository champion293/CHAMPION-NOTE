"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LiquidButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function LiquidButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: LiquidButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden select-none";

  const styles: Record<string, string> = {
    primary:
      "liquid-bg text-white shadow-[0_8px_30px_rgba(124,58,237,0.35)] hover:shadow-[0_8px_40px_rgba(124,58,237,0.55)]",
    secondary:
      "glass text-white hover:bg-white/10 hover:border-white/20",
    danger:
      "bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-500/50",
    ghost:
      "text-white/70 hover:text-white hover:bg-white/5 border border-transparent",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
