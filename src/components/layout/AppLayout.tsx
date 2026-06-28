"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-primary border-t-brand-secondary" />
          <p className="text-sm font-medium text-brand-text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen mesh-bg">
      <Sidebar />
      <Header />
      <main className="md:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
