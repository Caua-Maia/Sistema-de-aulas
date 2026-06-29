"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Flame, Lightbulb, Send, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PracticeChallengeProps {
  challenge: string;
  isCompleted: boolean;
  savedAnswer?: string;
  onSubmit: (answer: string) => void;
}

export function PracticeChallenge({
  challenge,
  isCompleted,
  savedAnswer,
  onSubmit,
}: PracticeChallengeProps) {
  const [answer, setAnswer] = useState(savedAnswer ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    onSubmit(answer.trim());
    // Small optimistic delay so the user sees feedback
    setTimeout(() => setSubmitting(false), 300);
  };

  return (
    <div className="challenge-card p-6 relative">
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-glow">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-text flex items-center gap-2">
                Desafio Prático
                <Flame className="h-4 w-4 text-brand-secondary animate-pulse-soft" />
              </h3>
              <p className="text-xs text-brand-secondary font-medium">
                Hora de colocar a mão na massa!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <Badge variant="success" className="hidden sm:inline-flex">
                <CheckCircle2 className="h-3 w-3" />
                Enviado
              </Badge>
            ) : (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <Target className="h-3 w-3" />
                XP Bonus
              </Badge>
            )}
          </div>
        </div>

        {/* Challenge text */}
        <p className="text-sm leading-relaxed text-brand-text/90 font-medium">
          {challenge}
        </p>

        {/* Answer area */}
        <div className="space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isCompleted}
            placeholder={
              isCompleted
                ? "Desafio enviado! Você pode revisar sua resposta acima."
                : "Descreva sua solução ou cole seu código aqui..."
            }
            rows={5}
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-sm font-mono resize-none transition-colors duration-200 outline-none",
              "bg-brand-bg border-brand-border text-brand-text placeholder:text-brand-text-muted",
              "focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30",
              isCompleted && "opacity-60 cursor-not-allowed"
            )}
          />

          {!isCompleted ? (
            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || submitting}
              className="w-full sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Enviar desafio
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-brand-success font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Desafio concluído — parabéns!
            </div>
          )}
        </div>

        {/* Pending hint */}
        {!isCompleted && answer.trim() === "" && (
          <p className="flex items-center gap-1.5 text-xs text-brand-text-muted">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Escreva sua resposta antes de enviar.
          </p>
        )}
      </div>
    </div>
  );
}
