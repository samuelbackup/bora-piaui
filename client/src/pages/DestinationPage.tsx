import { trpc } from "@/lib/trpc";
import { ArrowLeft, ExternalLink, FileCheck2, MapPinned, ShieldCheck, Images } from "lucide-react";
import { Link, useRoute } from "wouter";

const statusCopy = {
  confirmado: { label: "Condição confirmada", tone: "bg-[#E3F0DF] text-[#34502E]" },
  verificar: { label: "Confirme antes de sair", tone: "bg-[#F8E5B4] text-[#71571B]" },
  indisponivel: { label: "Condição indisponível", tone: "bg-[#F2D7CF] text-[#833C26]" },
} as const;

function dateLabel(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" });
}

export default function DestinationPage() {
  const [, params] = useRoute("/destinos/:slug");
  const slug = params?.slug ?? "nao-encontrado";
  const { data: destination, isLoading, error } = trpc.destinations.bySlug.useQuery({ slug });

  if (isLoading) return <main className="min-h-screen bg-[#F5ECD8] px-5 py-20 text-center text-[#566B37]">Carregando destino…</main>;
  if (error || !destination) return <main className="min-h-screen bg-[#F5ECD8] px-5 py-20 text-center"><p className="display-font text-4xl text-[#303722]">Destino não encontrado.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-[#B9572D] px-5 py-3 text-sm font-extrabold text-white">Voltar ao atlas</Link></main>;

  const status = statusCopy[destination.operationalStatus];
  const operationalRows = [
    ["Horários", destination.hours],
    ["Valores", destination.pricing],
    ["Acesso", destination.accessInfo],
    ["Contato", destination.contactInfo],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <div className="min-h-screen bg-[#F5ECD8] text-[#303722]">
      <header className="border-b border-[#3C482D]/10 bg-[#F5ECD8]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#3C482D]"><ArrowLeft className="h-4 w-4" /> Atlas do Piauí</Link>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#B9572D]">Ficha de destino</span>
        </div>
      </header>

      <main>
        <section className="bg-[#3C482D] px-5 py-12 text-white sm:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#D9A640]">{destination.polo} · {destination.category}</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
              <div><h1 className="display-font max-w-4xl text-5xl leading-[.9] tracking-[-.06em] sm:text-7xl">{destination.title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">{destination.summary}</p></div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/8 p-5"><p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-white/55">Município</p><p className="mt-2 text-lg font-bold">{destination.municipality}</p><a href={destination.routeUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#CD6D45]"><MapPinned className="h-4 w-4" /> Abrir rota</a></div>
            </div>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8 lg:py-16"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.18fr_.82fr]">
          <article><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#B9572D]">Leitura do lugar</p><p className="mt-4 text-lg leading-8 text-[#536049]">{destination.description}</p><a href={destination.sourceUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#566B37] hover:text-[#B9572D]"><FileCheck2 className="h-4 w-4" /> {destination.sourceName} · {destination.sourceYear}<ExternalLink className="h-3.5 w-3.5" /></a></article>
          <aside className="rounded-[1.75rem] border border-[#3C482D]/10 bg-[#FFFDF6] p-6"><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-2 text-xs font-extrabold ${status.tone}`}>{status.label}</span></div><h2 className="display-font mt-5 text-3xl tracking-[-.04em]">Antes de visitar</h2>{destination.visitNotes && <p className="mt-3 text-sm leading-6 text-[#5D6853]">{destination.visitNotes}</p>}{destination.lastVerifiedAt && <p className="mt-4 text-xs font-bold text-[#68705C]">Informação revisada em {dateLabel(destination.lastVerifiedAt)}.</p>}{destination.operationalSourceUrl && <a href={destination.operationalSourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-[#566B37]">Fonte operacional: {destination.operationalSource ?? "ver fonte"}<ExternalLink className="h-3 w-3" /></a>}</aside>
        </div></section>

        <section className="border-y border-[#3C482D]/10 bg-[#E9DCC0] px-5 py-12 sm:px-8 lg:py-16"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-6"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#B9572D]">Imagem do território</p><h2 className="display-font mt-3 text-4xl tracking-[-.05em]">Galeria</h2></div><Images className="h-6 w-6 text-[#B9572D]" /></div>{destination.images.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{destination.images.map((image) => <figure key={image.id} className="overflow-hidden rounded-[1.35rem] bg-[#FFFDF6]"><img src={image.imageUrl} alt={image.altText} className="h-64 w-full object-cover" />{image.caption && <figcaption className="p-4 text-xs leading-5 text-[#62705A]">{image.caption}</figcaption>}</figure>)}</div> : <div className="mt-7 rounded-[1.5rem] border border-dashed border-[#3C482D]/25 bg-[#FFFDF6]/60 p-8"><p className="font-bold text-[#3C482D]">Galeria em atualização.</p><p className="mt-2 max-w-xl text-sm leading-6 text-[#66705E]">As imagens deste destino serão publicadas pela curadoria quando houver material contextualizado e os créditos necessários.</p></div>}</div></section>

        <section className="px-5 py-12 sm:px-8 lg:py-16"><div className="mx-auto max-w-7xl"><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#B9572D]">Informações operacionais</p><h2 className="display-font mt-3 text-4xl tracking-[-.05em]">Planejamento da visita</h2>{operationalRows.length ? <dl className="mt-7 grid gap-4 md:grid-cols-2">{operationalRows.map(([label, value]) => <div key={label} className="rounded-[1.25rem] border border-[#3C482D]/10 bg-[#FFFDF6] p-5"><dt className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#B9572D]">{label}</dt><dd className="mt-2 text-sm leading-6 text-[#56624E]">{value}</dd></div>)}</dl> : <div className="mt-7 flex gap-3 rounded-[1.5rem] border border-[#D9A640]/50 bg-[#FFF9E8] p-5"><ShieldCheck className="h-5 w-5 shrink-0 text-[#A87412]" /><p className="text-sm leading-6 text-[#615734]">Horários, preços e contatos permanecem sem publicação até confirmação operacional. Use a rota e a fonte institucional acima para iniciar o planejamento.</p></div>}</div></section>
      </main>
    </div>
  );
}
