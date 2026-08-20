import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, ExternalLink, FilterX, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type AgendaEvent = {
  id: number;
  title: string;
  city: string;
  category: string;
  startsAt: Date;
  endsAt: Date | null;
  venue: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
};

const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export function filterAgendaEvents(events: AgendaEvent[], city: string, category: string, month: string) {
  return events.filter(event => {
    const matchesCity = city === "Todos" || event.city === city;
    const matchesCategory = category === "Todos" || event.category === category;
    const eventMonth = `${event.startsAt.getFullYear()}-${String(event.startsAt.getMonth() + 1).padStart(2, "0")}`;
    const matchesMonth = month === "Todos" || eventMonth === month;
    return matchesCity && matchesCategory && matchesMonth;
  });
}

function Topbar() {
  return <header className="sticky top-0 z-40 border-b border-[#3C482D]/10 bg-[#F5ECD8]/95 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-2 text-sm font-extrabold text-[#3C482D] hover:text-[#B9572D]"><ArrowLeft className="h-4 w-4" /> Voltar ao atlas</Link><nav className="flex items-center gap-3 text-xs font-extrabold sm:gap-5 sm:text-sm"><Link href="/patrimonios" className="hidden hover:text-[#B9572D] sm:inline">Patrimônios</Link><Link href="/sabores" className="hidden hover:text-[#B9572D] sm:inline">Sabores</Link><Link href="/dados" className="hidden hover:text-[#B9572D] sm:inline">Dados</Link><Link href="/agenda" className="text-[#B9572D]">Agenda</Link><Link href="/parceiros" className="rounded-full bg-[#3C482D] px-3 py-2 text-white hover:bg-[#566B37]">Seja parceiro</Link></nav></div></header>;
}

function eventPeriod(event: AgendaEvent) {
  if (!event.endsAt || event.endsAt.toDateString() === event.startsAt.toDateString()) return dateFormatter.format(event.startsAt);
  return `${dateFormatter.format(event.startsAt)} — ${dateFormatter.format(event.endsAt)}`;
}

export default function AgendaPage() {
  const { data, isLoading, isError } = trpc.agenda.list.useQuery();
  const events = (data ?? []) as AgendaEvent[];
  const [city, setCity] = useState("Todos");
  const [category, setCategory] = useState("Todos");
  const [month, setMonth] = useState("Todos");
  const cities = useMemo(() => Array.from(new Set(events.map(event => event.city))).sort((a, b) => a.localeCompare(b, "pt-BR")), [events]);
  const categories = useMemo(() => Array.from(new Set(events.map(event => event.category))).sort((a, b) => a.localeCompare(b, "pt-BR")), [events]);
  const months = useMemo(() => Array.from(new Set(events.map(event => `${event.startsAt.getFullYear()}-${String(event.startsAt.getMonth() + 1).padStart(2, "0")}`))).sort(), [events]);
  const visibleEvents = useMemo(() => filterAgendaEvents(events, city, category, month), [events, city, category, month]);
  const hasFilters = city !== "Todos" || category !== "Todos" || month !== "Todos";

  return <div className="min-h-screen bg-[#F5ECD8] text-[#2E3222]"><Topbar /><main>
    <section className="border-b border-[#3C482D]/10 px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_.42fr] lg:items-end"><div className="border-l-2 border-[#B9572D] pl-5 sm:pl-6"><span className="text-[10px] font-extrabold uppercase tracking-[.17em] text-[#B9572D]">Agenda do território</span><h1 className="display-font mt-4 text-5xl leading-[.92] tracking-[-.06em] sm:text-6xl">Calendário cultural.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-[#66705E] sm:text-lg">Programações confirmadas, com cidade, período e referência de origem para organizar a visita com mais segurança.</p></div><aside className="rounded-[1.5rem] border border-[#3C482D]/15 bg-[#FFFDF6] p-5"><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#B9572D]">Como usar</p><p className="mt-3 text-sm font-medium leading-6 text-[#66705E]">A agenda só recebe itens com período, local e fonte registrados pela curadoria editorial.</p></aside></div></section>
    <section className="px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="overflow-hidden rounded-[1.5rem] border border-[#3C482D]/15 bg-[#FFFDF6]"><div className="flex items-center justify-between gap-4 border-b border-[#3C482D]/10 bg-[#E9DCC0]/55 px-5 py-3"><span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#566B37]">Refine a seleção</span><span className="hidden text-xs text-[#66705E] sm:block">Filtros aplicados à programação confirmada</span></div><div className="grid gap-4 p-5 md:grid-cols-3"><label className="text-sm font-bold text-[#3C482D]">Cidade<select value={city} onChange={event => setCity(event.target.value)} className="mt-2 h-11 w-full rounded-full border border-[#3C482D]/15 bg-[#FDF9F0] px-4 text-sm font-medium outline-none focus:border-[#B9572D]"><option value="Todos">Todas as cidades</option>{cities.map(item => <option key={item} value={item}>{item}</option>)}</select></label><label className="text-sm font-bold text-[#3C482D]">Categoria<select value={category} onChange={event => setCategory(event.target.value)} className="mt-2 h-11 w-full rounded-full border border-[#3C482D]/15 bg-[#FDF9F0] px-4 text-sm font-medium outline-none focus:border-[#B9572D]"><option value="Todos">Todas as categorias</option>{categories.map(item => <option key={item} value={item}>{item}</option>)}</select></label><label className="text-sm font-bold text-[#3C482D]">Mês<select value={month} onChange={event => setMonth(event.target.value)} className="mt-2 h-11 w-full rounded-full border border-[#3C482D]/15 bg-[#FDF9F0] px-4 text-sm font-medium outline-none focus:border-[#B9572D]"><option value="Todos">Todos os meses</option>{months.map(item => <option key={item} value={item}>{monthFormatter.format(new Date(`${item}-01T12:00:00`))}</option>)}</select></label></div></div>
      <div className="mt-8">{isLoading ? <div className="grid gap-5 md:grid-cols-2"><div className="h-56 animate-pulse rounded-[1.5rem] bg-[#E9DCC0]" /><div className="h-56 animate-pulse rounded-[1.5rem] bg-[#E9DCC0]" /></div> : isError ? <div className="rounded-[1.5rem] border border-[#B9572D]/25 bg-[#FFFDF6] p-7"><p className="font-bold">Não foi possível carregar a agenda agora.</p><p className="mt-2 text-sm text-[#66705E]">Tente atualizar a página. Nenhuma programação é exibida sem confirmação editorial.</p></div> : visibleEvents.length === 0 ? <div className="rounded-[1.5rem] border border-[#3C482D]/15 bg-[#FFFDF6] p-7 sm:p-9"><div className="flex max-w-2xl items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E9DCC0] text-[#B9572D]"><CalendarDays className="h-5 w-5" /></span><div><p className="font-bold">Nenhum evento confirmado para esta seleção.</p><p className="mt-2 text-sm leading-6 text-[#66705E]">O calendário só publica eventos com período, local e fonte de referência informados pela equipe editorial.</p>{hasFilters && <button type="button" onClick={() => { setCity("Todos"); setCategory("Todos"); setMonth("Todos"); }} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#B9572D] hover:underline"><FilterX className="h-4 w-4" /> Limpar filtros</button>}</div></div></div> : <div className="grid gap-5 md:grid-cols-2">{visibleEvents.map(event => <article key={event.id} className="rounded-[1.5rem] border border-[#3C482D]/12 bg-[#FFFDF6] p-6"><div className="flex items-start justify-between gap-4"><span className="rounded-full bg-[#E9DCC0] px-3 py-2 text-[10px] font-extrabold uppercase tracking-[.13em] text-[#566B37]">{event.category}</span><CalendarDays className="h-5 w-5 text-[#B9572D]" /></div><h2 className="display-font mt-6 text-3xl tracking-[-.045em]">{event.title}</h2><div className="mt-4 space-y-2 text-sm font-semibold text-[#566457]"><p className="flex gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#B9572D]" />{eventPeriod(event)}</p><p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B9572D]" />{event.venue} · {event.city}</p></div><p className="mt-4 text-sm leading-6 text-[#66705E]">{event.summary}</p><a href={event.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#B9572D] hover:underline">{event.sourceName} <ArrowUpRight className="h-4 w-4" /></a></article>)}</div>}</div>
    </div></section>
    <section className="border-t border-[#3C482D]/10 bg-[#3C482D] px-4 py-9 text-white sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#D9A640]" /><p className="text-sm font-semibold text-white/84">Data, local e fonte são requisitos mínimos para a publicação.</p></div><Link href="/parceiros" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#D9A640] hover:text-white">Apresentar um negócio local <ExternalLink className="h-4 w-4" /></Link></div></section>
  </main></div>;
}
