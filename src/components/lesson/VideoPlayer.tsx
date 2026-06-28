"use client";

import { Play, Sparkles } from "lucide-react";

interface VideoPlayerProps {
  title: string;
  videoUrl?: string;
}

export function VideoPlayer({ title }: VideoPlayerProps) {
  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-brand-sidebar shadow-card-hover">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/80 via-brand-secondary/60 to-brand-accent/40" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-brand-secondary/40 blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-brand-accent/30 blur-3xl animate-pulse-soft" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
        <button
          type="button"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30 group-hover:shadow-glow cursor-default"
          aria-label="Reproduzir videoaula"
        >
          <Play className="h-7 w-7 fill-white text-white ml-1" />
        </button>
        <div className="text-center px-4">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
            <Sparkles className="h-3.5 w-3.5" />
            Videoaula
          </p>
          <p className="mt-2 text-lg font-bold">{title}</p>
          <p className="mt-2 text-xs text-white/50">
            Player placeholder — vídeo em breve
          </p>
        </div>
      </div>
    </div>
  );
}
