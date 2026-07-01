"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navItems = [
  { href: "/monitor", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/monitor/alunos", label: "Alunos", icon: Users, exact: false },
];

export function MonitorLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, isMonitor, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!isMonitor) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, isMonitor, router]);

  if (isLoading || !isAuthenticated || !isMonitor || !user) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-primary border-t-brand-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg">
      {/* Sidebar */}
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
              Painel Monitor
            </p>
          </div>
        </div>

        {/* User badge compacto */}
        <div className="px-5 py-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-brand-secondary font-bold text-xs uppercase select-none">
              {user.name.charAt(0)}
            </div>
            <p className="text-xs font-medium text-white/70 truncate capitalize">
              {user.name}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);
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

          <div className="pt-3 mt-2 border-t border-white/8">
            <Link
              href="/dashboard"
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white/80 transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 text-white/40 transition-transform group-hover:-translate-x-0.5" />
              Área do aluno
            </Link>
          </div>
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

      {/* Main */}
      <main className="md:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
