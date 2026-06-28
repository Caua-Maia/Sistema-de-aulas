"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LogOut, Menu, Star, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sprints", label: "Sprints" },
  { href: "/progresso", label: "Progresso" },
];

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { xp, level } = useProgress();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-card/90 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-brand-text text-sm leading-tight">
              Ford Enter
            </span>
            {user && (
              <span className="text-[10px] text-brand-text-muted leading-tight flex items-center gap-1">
                <Star className="h-2.5 w-2.5 text-brand-primary" />
                Nível {level} · {xp} XP
              </span>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle variant="header" />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl p-2 text-brand-text hover:bg-brand-card-secondary transition-colors duration-200"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-brand-border px-4 py-3 space-y-1 animate-slide-up">
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 mb-2 rounded-xl bg-brand-card-secondary">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary font-bold text-xs uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate capitalize">
                  {user.name}
                </p>
                <p className="text-xs text-brand-text-muted truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {navItems.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-brand-text hover:bg-brand-card-secondary"
                )}
              >
                {label}
              </Link>
            );
          })}

          <button
            onClick={() => {
              setMenuOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
