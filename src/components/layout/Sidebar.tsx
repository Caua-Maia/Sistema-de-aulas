"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sprints", label: "Sprints", icon: BookOpen },
  { href: "/progresso", label: "Progresso", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { xp, level } = useProgress();

  return (
    <aside className="sidebar-glow hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:left-0 bg-brand-sidebar text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-tight tracking-tight">
            Ford Enter
          </p>
          <p className="text-xs text-brand-secondary/90 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Trilha de Apoio
          </p>
        </div>
      </div>

      {/* Compact user access */}
      {user && (
        <div className="px-3 py-3 border-b border-white/8">
          <Link
            href="/perfil"
            className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:bg-white/5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-brand-secondary font-bold text-sm uppercase select-none">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate capitalize">
                  {user.name}
                </p>
                <p className="text-xs text-white/60 truncate">
                  Nível {level} · {xp} XP
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70" />
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l-2 border-transparent",
                isActive
                  ? "nav-item-active"
                  : "text-white/60 hover:bg-white/5 hover:text-white hover:border-white/10"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-brand-secondary" : "text-white/50"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/8 space-y-1">
        <ThemeToggle variant="sidebar" />
        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
