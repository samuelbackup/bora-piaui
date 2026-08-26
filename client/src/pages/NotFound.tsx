import { AlertCircle, Compass, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="grid min-h-screen place-items-center bg-[#F5ECD8] px-6 text-[#26311E]">
      <div className="max-w-md rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#E9DCC0] text-[#B9572D]">
          <AlertCircle className="h-6 w-6" />
        </span>
        <p className="display-font mt-4 text-5xl tracking-[-.05em]">404</p>
        <h1 className="display-font mt-2 text-2xl">Este percurso não existe no atlas.</h1>
        <p className="mt-3 text-sm leading-6 text-[#66705E]">
          O endereço que você tentou abrir foi movido ou nunca fez parte do mapa. Volte ao início e retome a viagem pelos destinos verificados.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link href="/" className="tap inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#A84626]">
            <Home className="h-4 w-4" /> Voltar ao atlas
          </Link>
          <button type="button" onClick={() => setLocation("/agenda")} className="tap inline-flex items-center gap-2 rounded-full border border-[#314027]/20 px-4 py-2.5 text-sm font-extrabold text-[#314027] hover:bg-[#F5ECD8]">
            <Compass className="h-4 w-4" /> Ver a agenda
          </button>
        </div>
      </div>
    </div>
  );
}
