import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-extrabold gradient-text">404</p>
      <h1 className="mt-4 text-2xl font-bold text-brand-text">
        Página não encontrada
      </h1>
      <p className="mt-2 text-slate-600">
        Essa rota não existe na trilha de apoio.
      </p>
      <Button asChild variant="accent" className="mt-8">
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
