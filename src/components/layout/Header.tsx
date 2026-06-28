"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/sprints", label: "Sprints" },
  { href: "/progresso", label: "Progresso" },
];

export function Header() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-brand-text text-sm">Ford Enter</span>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl p-2 text-brand-text hover:bg-slate-100 transition-colors duration-200"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200/80 px-4 py-3 space-y-1 animate-slide-up">
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
                    : "text-brand-text hover:bg-slate-100"
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
            className="block w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            Sair
          </button>
        </nav>
      )}
    </header>
  );
}
