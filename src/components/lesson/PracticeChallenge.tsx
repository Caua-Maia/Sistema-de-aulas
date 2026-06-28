import { Flame, Lightbulb, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PracticeChallengeProps {
  challenge: string;
}

export function PracticeChallenge({ challenge }: PracticeChallengeProps) {
  return (
    <div className="challenge-card p-6 relative">
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-4">
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
          <Badge variant="secondary" className="hidden sm:inline-flex">
            <Target className="h-3 w-3" />
            XP Bonus
          </Badge>
        </div>
        <p className="text-sm leading-relaxed text-brand-text/90 font-medium">
          {challenge}
        </p>
      </div>
    </div>
  );
}
