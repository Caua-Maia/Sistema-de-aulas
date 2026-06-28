import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle variant="header" />
      </div>
      <p className="text-8xl font-extrabold gradient-text">404</p>
      <h1 className="mt-4 text-2xl font-bold text-brand-text">
        Página não encontrada
      </h1>
      <p className="mt-2 text-brand-text-muted">
        Essa rota não existe na trilha de apoio.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
