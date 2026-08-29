import { useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, CircleHelp, Eye, Filter, Inbox, Lightbulb, Mail, MessageSquare, Search, ShieldCheck, Star, ThumbsUp, X } from "lucide-react";
import { Link } from "wouter";

type FeedbackCategory = "elogio" | "sugestao" | "problema";
type FeedbackStatus = "lido" | "nao_lido";

export const ADMIN_FEEDBACKS_ROUTE = "/admin/feedbacks";

type Feedback = {
  id: number;
  name: string;
  email: string;
  rating: number | null;
  category: FeedbackCategory;
  status: FeedbackStatus;
  sentAt: string;
  message: string;
  city?: string;
  place?: string;
};

/** Registros estruturais sintéticos: não representam opiniões, pessoas, notas ou mensagens reais. */
export const mockFeedbacks: Feedback[] = [
  { id: 1, name: "Registro sintético 01", email: "não aplicável", rating: null, category: "elogio", status: "nao_lido", sentAt: "2026-08-29T09:15:00-03:00", message: "Amostra técnica para testar a categoria Elogios; não é feedback de usuário.", city: "Teresina", place: "Encontro dos Rios" },
  { id: 2, name: "Registro sintético 02", email: "não aplicável", rating: null, category: "sugestao", status: "lido", sentAt: "2026-08-28T16:40:00-03:00", message: "Amostra técnica para testar a categoria Sugestões; não é feedback de usuário.", city: "Parnaíba", place: "Delta do Parnaíba" },
  { id: 3, name: "Registro sintético 03", email: "não aplicável", rating: null, category: "problema", status: "nao_lido", sentAt: "2026-08-28T11:05:00-03:00", message: "Amostra técnica para testar a categoria Dúvidas/Problemas; não é feedback de usuário.", city: "São Raimundo Nonato", place: "Serra da Capivara" },
  { id: 4, name: "Registro sintético 04", email: "não aplicável", rating: null, category: "sugestao", status: "lido", sentAt: "2026-08-27T14:20:00-03:00", message: "Amostra técnica para testar busca e resposta; não é feedback de usuário.", city: "Oeiras", place: "Centro histórico" },
  { id: 5, name: "Registro sintético 05", email: "não aplicável", rating: null, category: "elogio", status: "lido", sentAt: "2026-08-26T10:10:00-03:00", message: "Amostra técnica para testar a visualização de uma mensagem longa; não é feedback de usuário.", city: "Teresina", place: "Polo Cerâmico do Poti Velho" },
  { id: 6, name: "Registro sintético 06", email: "não aplicável", rating: null, category: "problema", status: "nao_lido", sentAt: "2026-08-25T18:30:00-03:00", message: "Amostra técnica para testar o estado Não lido; não é feedback de usuário.", city: "Piripiri", place: "Parque Nacional de Sete Cidades" },
  { id: 7, name: "Registro sintético 07", email: "não aplicável", rating: null, category: "sugestao", status: "lido", sentAt: "2026-08-24T08:50:00-03:00", message: "Amostra técnica para testar o estado Lido; não é feedback de usuário.", city: "Coronel José Dias", place: "Museu da Natureza" },
  { id: 8, name: "Registro sintético 08", email: "não aplicável", rating: null, category: "elogio", status: "nao_lido", sentAt: "2026-08-23T12:00:00-03:00", message: "Amostra técnica para testar o modal de detalhes; não é feedback de usuário.", city: "Cajueiro da Praia", place: "Barra Grande" },
];

const categoryLabels: Record<FeedbackCategory, string> = { elogio: "Elogio", sugestao: "Sugestão", problema: "Dúvida / problema" };
const categoryStyles: Record<FeedbackCategory, string> = {
  elogio: "bg-emerald-100 text-emerald-800",
  sugestao: "bg-sky-100 text-sky-800",
  problema: "bg-amber-100 text-amber-900",
};
const formatDate = (value: string) => new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export function filterFeedbacks(items: Feedback[], query: string, category: FeedbackCategory | "todos", status: FeedbackStatus | "todos") {
  const normalized = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesText = !normalized || [item.name, item.email, item.message].some((value) => value.toLowerCase().includes(normalized));
    const matchesCategory = category === "todos" || item.category === category;
    const matchesStatus = status === "todos" || item.status === status;
    return matchesText && matchesCategory && matchesStatus;
  });
}

function Avatar({ name }: { name: string }) {
  return <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#bae6fd] text-sm font-extrabold text-[#0f172a]">{name.replace("Registro sintético ", "R")}</span>;
}

function Stars({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-sm font-semibold text-slate-400">Sem avaliação real</span>;
  return <span aria-label={`${rating} de 5 estrelas`} className="inline-flex items-center gap-0.5 text-amber-500">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= rating ? "fill-current" : ""}`} />)}</span>;
}

export default function AdminFeedbacks() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FeedbackCategory | "todos">("todos");
  const [status, setStatus] = useState<FeedbackStatus | "todos">("todos");
  const [items, setItems] = useState(mockFeedbacks);
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [reply, setReply] = useState("");
  const [replySent, setReplySent] = useState(false);

  const filtered = useMemo(() => filterFeedbacks(items, query, category, status), [category, items, query, status]);

  const unreadCount = items.filter((item) => item.status === "nao_lido").length;
  const suggestionCount = items.filter((item) => item.category === "sugestao").length;
  const markRead = (id: number) => setItems((current) => current.map((item) => item.id === id ? { ...item, status: item.status === "lido" ? "nao_lido" : "lido" } : item));
  const openDetails = (item: Feedback) => { setSelected(item); setReply(""); setReplySent(false); };
  const closeDetails = () => { setSelected(null); setReply(""); setReplySent(false); };
  const sendReply = (event: React.FormEvent) => { event.preventDefault(); if (!reply.trim()) return; setReplySent(true); };

  return <div className="min-h-screen bg-slate-100 text-slate-900 lg:grid lg:grid-cols-[250px_1fr]">
    <aside className="bg-[#0f172a] px-5 py-6 text-white lg:min-h-screen"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-amber-400">Bora Piauí</p><h1 className="display-font mt-2 text-3xl leading-none">Painel<br />editorial</h1></div><Link href="/" aria-label="Voltar ao atlas público" className="rounded-full border border-white/20 p-2 lg:hidden"><ArrowUpRight className="h-4 w-4" /></Link></div><p className="mt-5 max-w-[210px] text-sm leading-6 text-slate-300">Administração demonstrativa para organizar retornos do público.</p><nav className="mt-9 space-y-2"><div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-bold"><MessageSquare className="h-4 w-4 text-amber-400" />Feedbacks</div><Link href="/admin/destinos" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"><MapIcon />Destinos</Link><Link href="/admin/editorial" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"><Inbox className="h-4 w-4 text-amber-400" />Agenda e parceiros</Link><Link href="/" className="mt-5 hidden items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 lg:flex"><Eye className="h-4 w-4 text-amber-400" />Ver atlas público</Link></nav></aside>
    <main className="min-w-0 px-4 py-6 sm:px-7 lg:px-10 lg:py-9"><div className="mx-auto max-w-7xl"><header className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-sky-700">Protótipo · dados locais</p><h2 className="display-font mt-2 text-4xl tracking-[-.05em] sm:text-5xl">Administração de Feedbacks</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Uma visão de triagem para revisar mensagens por destino, categoria e status.</p></div><Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold hover:border-sky-500 hover:text-sky-700"><ArrowUpRight className="h-4 w-4" />Voltar ao atlas</Link></header>
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" /><p><strong>Modo demonstração:</strong> os oito registros são sintéticos e não representam usuários, avaliações ou mensagens reais. Nenhum dado é persistido.</p></div>
      <section aria-label="Indicadores" className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={<MessageSquare />} label="Total de Feedbacks" value={String(items.length)} tone="slate" /><Kpi icon={<Star />} label="Avaliação Média" value="—" hint="sem avaliações reais" tone="amber" /><Kpi icon={<Eye />} label="Feedbacks Não Lidos" value={String(unreadCount)} tone="sky" /><Kpi icon={<Lightbulb />} label="Sugestões" value={String(suggestionCount)} tone="amber" /></section>
      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><label className="relative min-w-0 flex-1"><span className="sr-only">Buscar por nome, e-mail ou mensagem</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, e-mail ou mensagem" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" /></label><label className="relative flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold lg:w-44"><Filter className="h-4 w-4 text-slate-500" /><span className="sr-only">Filtrar por status</span><select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.target.value as FeedbackStatus | "todos")} className="min-w-0 flex-1 appearance-none bg-transparent outline-none"><option value="todos">Todos os status</option><option value="nao_lido">Não lidos</option><option value="lido">Lidos</option></select><ChevronDown className="pointer-events-none h-4 w-4 text-slate-500" /></label></div><div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Categorias de feedback">{(["todos", "elogio", "sugestao", "problema"] as const).map((value) => <button key={value} type="button" role="tab" aria-selected={category === value} onClick={() => setCategory(value)} className={`rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${category === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{value === "todos" ? "Todos" : categoryLabels[value]}</button>)}</div></section>
      <div className="mt-5 flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-600"><span className="text-slate-900">{filtered.length}</span> registro{filtered.length === 1 ? "" : "s"} encontrado{filtered.length === 1 ? "" : "s"}</p><p className="hidden text-xs text-slate-500 sm:block">Clique em um registro para ver detalhes</p></div>
      <section className="mt-3 grid gap-3 xl:grid-cols-2" aria-label="Lista de feedbacks">{filtered.length === 0 ? <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><CircleHelp className="mx-auto h-8 w-8 text-slate-400" /><h3 className="mt-3 font-bold">Nenhum registro encontrado</h3><p className="mt-1 text-sm text-slate-500">Ajuste a busca ou os filtros para testar outros estados.</p></div> : filtered.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-5"><div className="flex items-start gap-3"><Avatar name={item.name} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold text-slate-900">{item.name}</h3><p className="mt-0.5 truncate text-xs text-slate-500">{item.email}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${categoryStyles[item.category]}`}>{categoryLabels[item.category]}</span></div><div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500"><Stars rating={item.rating} /><span>{formatDate(item.sentAt)}</span>{item.status === "nao_lido" && <span className="inline-flex items-center gap-1 font-bold text-sky-700"><span className="h-1.5 w-1.5 rounded-full bg-sky-600" />Não lido</span>}</div></div></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-700">{item.message}</p><p className="mt-3 text-xs font-semibold text-slate-500">{item.city} · {item.place}</p><div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => openDetails(item)} className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"><Eye className="h-4 w-4" />Ver mensagem completa</button><button type="button" onClick={() => markRead(item.id)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-300 ${item.status === "lido" ? "border border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-slate-900 text-white hover:bg-slate-800"}`}><Check className="h-4 w-4" />{item.status === "lido" ? "Marcar como não lido" : "Marcar como lido"}</button></div></article>)}</section>
    </div></main>
    {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) closeDetails(); }}><section role="dialog" aria-modal="true" aria-labelledby="feedback-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-sky-700">Detalhes do registro</p><h2 id="feedback-detail-title" className="mt-1 text-2xl font-bold">{selected.name}</h2><p className="mt-1 text-sm text-slate-500">{selected.email} · {formatDate(selected.sentAt)}</p></div><button type="button" onClick={closeDetails} aria-label="Fechar detalhes" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Detail label="Categoria" value={categoryLabels[selected.category]} /><Detail label="Cidade / ponto" value={`${selected.city ?? "Não informado"} · ${selected.place ?? "Não informado"}`} /></div><blockquote className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selected.message}</blockquote><form onSubmit={sendReply} className="mt-6 border-t border-slate-200 pt-6"><label htmlFor="feedback-reply" className="text-sm font-bold">Enviar resposta por e-mail <span className="font-normal text-slate-500">(simulado)</span></label><textarea id="feedback-reply" value={reply} onChange={(event) => setReply(event.target.value)} rows={4} placeholder="Escreva uma resposta para esta demonstração" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" /><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">O envio não dispara e-mail nem salva dados.</p><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"><Mail className="h-4 w-4" />Enviar resposta</button></div>{replySent && <p role="status" className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700"><ThumbsUp className="h-4 w-4" />Resposta simulada nesta sessão.</p>}</form></section></div>}
  </div>;
}

function Kpi({ icon, label, value, hint, tone }: { icon: React.ReactNode; label: string; value: string; hint?: string; tone: "slate" | "amber" | "sky" }) {
  const styles = { slate: "bg-slate-900 text-white", amber: "bg-amber-50 text-amber-950", sky: "bg-sky-50 text-sky-950" };
  return <article className={`rounded-2xl p-4 shadow-sm ${styles[tone]}`}><div className="flex items-center justify-between gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15"><span className="h-5 w-5">{icon}</span></span><strong className="text-3xl tracking-tight">{value}</strong></div><p className="mt-3 text-sm font-bold">{label}</p>{hint && <p className="mt-1 text-xs opacity-70">{hint}</p>}</article>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>;
}

function MapIcon() {
  return <span aria-hidden="true" className="grid h-4 w-4 place-items-center rounded border border-amber-400 text-[9px] font-black text-amber-400">M</span>;
}
