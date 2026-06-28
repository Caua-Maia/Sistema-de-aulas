"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "sidebar" | "header";
}

export function ThemeToggle({ className, variant = "sidebar" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("h-9 w-9", className)} aria-hidden />;
  }

  function cycleTheme() {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }

  const label =
    theme === "system"
      ? "Tema: automático"
      : theme === "dark"
        ? "Tema: escuro"
        : "Tema: claro";

  const Icon = theme === "system" ? Monitor : theme === "dark" ? Moon : Sun;

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={cycleTheme}
        aria-label={label}
        title={label}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all duration-200",
          className
        )}
      >
        <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
        {theme === "system" ? "Tema automático" : theme === "dark" ? "Modo escuro" : "Modo claro"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-xl p-2 text-brand-text hover:bg-brand-card-secondary transition-colors duration-200",
        className
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
