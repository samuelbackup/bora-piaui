import { ArrowLeft, Compass, Info } from "lucide-react";
import { Link } from "wouter";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#F5ECD8] px-4 py-10 text-[#2E3222] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col justify-center">
        <Link href="/" className="tap inline-flex w-fit items-center gap-2 text-sm font-extrabold text-[#566B37] hover:text-[#B9572D]"><ArrowLeft className="h-4 w-4" /> Voltar ao Polo Origens</Link>
        <span className="mt-12 inline-flex w-fit items-center gap-2 rounded-full bg-[#E9DCC0] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.14em] text-[#B9572D]"><Compass className="h-3.5 w-3.5" /> Em breve</span>
        <h1 className="display-font mt-5 max-w-2xl text-5xl leading-[.92] tracking-[-.06em] sm:text-6xl">Esta área ainda não faz parte da versão pública.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[#66705E] sm:text-lg">O Bora Piauí está concentrado no Polo Origens enquanto dados, integrações e operação editorial são estruturados. Esta página não recebe propostas, reservas, pagamentos ou alterações de conteúdo.</p>
        <div className="mt-10 flex max-w-2xl gap-3 border-y border-[#3C482D]/12 py-5 text-sm leading-6 text-[#566457]"><Info className="h-5 w-5 shrink-0 text-[#B9572D]" />Quando uma nova área for apresentada, ela terá fontes identificadas e uma operação verificada antes de ser divulgada.</div>
      </div>
    </main>
  );
}
