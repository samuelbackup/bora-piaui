import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, Check, ChevronDown, CircleHelp, Eye, Filter, Inbox, Lightbulb, Loader2, Mail, MapPin, MessageSquare, Search, ShieldCheck, Star, ThumbsUp, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type FeedbackCategory = "elogio" | "sugestao" | "problema";
type FeedbackStatus = "lido" | "nao_lido";

export const ADMIN_FEEDBACKS_ROUTE = "/admin/feedbacks";

export type Feedback = {
  id: number;
  category: FeedbackCategory;
  message: string;
  rating: number | null;
  destinationSlug: string | null;
  destinationName: string | null;
  isRead: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
};

const categoryLabels: Record<FeedbackCategory, string> = { elogio: "Elogio", sugestao: "Sugestão", problema: "Dúvida / problema" };
const categoryStyles: Record<FeedbackCategory, string> = {
  elogio: "bg-emerald-100 text-emerald-800",
  sugestao: "bg-sky-100 text-sky-800",
  problema: "bg-amber-100 text-amber-900",
};
const formatDate = (value: Date | string) => new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export function filterFeedbacks(items: Feedback[], query: string, category: FeedbackCategory | "todos", status: FeedbackStatus | "todos") {
  const normalized = query.trim().toLowerCase();
  return items.filter((item) => {
    const searchable = [item.message, item.destinationName, item.destinationSlug].filter(Boolean).join(" ").toLowerCase();
    const matchesText = !normalized || searchable.includes(normalized);
    const matchesCategory = category === "todos" || item.category === category;
    const matchesStatus = status === "todos" || (status === "lido" ? item.isRead : !item.isRead);
    return matchesText && matchesCategory && matchesStatus;
  });
}

function DestinationLabel({ item }: { item: Feedback }) {
  if (!item.destinationName && !item.destinationSlug) return <span className="text-slate-500">Feedback geral do atlas</span>;
  return <span>{item.destinationName ?? item.destinationSlug}</span>;
}

function Avatar({ item }: { item: Feedback }) {
  const label = item.destinationName?.slice(0, 2).toUpperCase() ?? "BP";
  return <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#bae6fd] text-sm font-extrabold text-[#0f172a]">{label}</span>;
}

function Stars({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-sm font-semibold text-slate-400">Sem avaliação</span>;
  return <span aria-label={`${rating} de 5 estrelas`} className="inline-flex items-center gap-0.5 text-amber-500">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= rating ? "fill-current" : ""}`} />)}</span>;
}

export default function AdminFeedbacks() {
  const utils = trpc.useUtils();
  const feedbackQuery = trpc.feedbacks.adminList.useQuery(undefined, { retry: false });
  const markReadMutation = trpc.feedbacks.markRead.useMutation({
    onSuccess: () => {
      utils.feedbacks.adminList.invalidate();
      toast.success("Status do feedback atualizado.");
    },
    onError: (error) => toast.error(error.message),
  });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FeedbackCategory | "todos">("todos");
  const [status, setStatus] = useState<FeedbackStatus | "todos">("todos");
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [reply, setReply] = useState("");
  const [replySent, setReplySent] = useState(false);

  const items = (feedbackQuery.data ?? []) as Feedback[];
  const filtered = useMemo(() => filterFeedbacks(items, query, category, status), [category, items, query, status]);
  const unreadCount = items.filter((item) => !item.isRead).length;
  const suggestionCount = items.filter((item) => item.category === "sugestao").length;
  const ratedItems = items.filter((item) => item.rating !== null);
  const averageRating = ratedItems.length ? (ratedItems.reduce((total, item) => total + (item.rating ?? 0), 0) / ratedItems.length).toFixed(1) : "—";

  const openDetails = (item: Feedback) => { setSelected(item); setReply(""); setReplySent(false); };
  const closeDetails = () => { setSelected(null); setReply(""); setReplySent(false); };
  const toggleRead = (item: Feedback) => markReadMutation.mutate({ id: item.id, isRead: !item.isRead });
  const sendReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reply.trim()) return;
    setReplySent(true);
    toast.success("Resposta simulada nesta sessão; nenhum e-mail foi enviado.");
  };

  if (feedbackQuery.isLoading) {
    return <div className="grid min-h-screen place-items-center bg-slate-100 text-slate-900"><div className="inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold shadow-sm"><Loader2 className="h-5 w-5 animate-spin text-sky-600" /> Carregando feedbacks reais...</div></div>;
  }

  if (feedbackQuery.error) {
    return <div className="grid min-h-screen place-items-center bg-[#F5ECD8] px-6 text-[#26311E]"><div className="max-w-md rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-7 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#E9DCC0] text-[#B9572D]"><ShieldCheck className="h-5 w-5" /></span><h1 className="display-font mt-4 text-3xl">Área editorial restrita</h1><p className="mt-3 text-sm leading-6 text-[#536049]">O painel de feedbacks exige uma sessão administrativa válida. Nenhum conteúdo foi exibido porque a consulta protegida não foi autorizada.</p><div className="mt-5 flex flex-wrap items-center justify-center gap-2"><Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#A84626]">Entrar</Link><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[#314027]/20 px-4 py-2.5 text-sm font-extrabold text-[#314027] hover:bg-[#F5ECD8]">Voltar ao atlas público</Link></div></div></div>;
  }

  return <div className="min-h-screen bg-slate-100 text-slate-900 lg:grid lg:grid-cols-[250px_1fr]">
    <aside className="bg-[#0f172a] px-5 py-6 text-white lg:min-h-screen"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-amber-400">Bora Piauí</p><h1 className="display-font mt-2 text-3xl leading-none">Painel<br />editorial</h1></div><Link href="/" aria-label="Voltar ao atlas público" className="rounded-full border border-white/20 p-2 lg:hidden"><ArrowUpRight className="h-4 w-4" /></Link></div><p className="mt-5 max-w-[210px] text-sm leading-6 text-slate-300">Administração protegida para organizar retornos reais do público.</p><nav className="mt-9 space-y-2"><div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-bold"><MessageSquare className="h-4 w-4 text-amber-400" />Feedbacks</div><Link href="/admin/destinos" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"><MapIcon />Destinos</Link><Link href="/admin/editorial" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"><Inbox className="h-4 w-4 text-amber-400" />Agenda e parceiros</Link><Link href="/" className="mt-5 hidden items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/10 lg:flex"><Eye className="h-4 w-4 text-amber-400" />Ver atlas público</Link></nav></aside>
    <main className="min-w-0 px-4 py-6 sm:px-7 lg:px-10 lg:py-9"><div className="mx-auto max-w-7xl"><header className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-sky-700">Protótipo · dados persistidos</p><h2 className="display-font mt-2 text-4xl tracking-[-.05em] sm:text-5xl">Administração de Feedbacks</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Uma visão de triagem para revisar mensagens reais por destino, categoria e status de leitura.</p></div><Link href="/" className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold hover:border-sky-500 hover:text-sky-700"><ArrowUpRight className="h-4 w-4" />Voltar ao atlas</Link></header>
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" /><p><strong>Privacidade:</strong> os feedbacks não possuem nome, e-mail ou outro identificador pessoal. A busca considera apenas mensagem e contexto editorial do destino.</p></div>
      <section aria-label="Indicadores" className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Kpi icon={<MessageSquare />} label="Total de Feedbacks" value={String(items.length)} tone="slate" /><Kpi icon={<Star />} label="Avaliação Média" value={averageRating} hint={ratedItems.length ? `${ratedItems.length} avaliação(ões)` : "sem avaliações enviadas"} tone="amber" /><Kpi icon={<Eye />} label="Feedbacks Não Lidos" value={String(unreadCount)} tone="sky" /><Kpi icon={<Lightbulb />} label="Sugestões" value={String(suggestionCount)} tone="amber" /></section>
      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex flex-col gap-3 lg:flex-row lg:items-center"><label className="relative min-w-0 flex-1"><span className="sr-only">Buscar por mensagem ou destino</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por mensagem ou destino" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" /></label><label className="relative flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold lg:w-44"><Filter className="h-4 w-4 text-slate-500" /><span className="sr-only">Filtrar por status</span><select aria-label="Filtrar por status" value={status} onChange={(event) => setStatus(event.target.value as FeedbackStatus | "todos")} className="min-w-0 flex-1 appearance-none bg-transparent outline-none"><option value="todos">Todos os status</option><option value="nao_lido">Não lidos</option><option value="lido">Lidos</option></select><ChevronDown className="pointer-events-none h-4 w-4 text-slate-500" /></label></div><div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Categorias de feedback">{(["todos", "elogio", "sugestao", "problema"] as const).map((value) => <button key={value} type="button" role="tab" aria-selected={category === value} onClick={() => setCategory(value)} className={`rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${category === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{value === "todos" ? "Todos" : categoryLabels[value]}</button>)}</div></section>
      <div className="mt-5 flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-600"><span className="text-slate-900">{filtered.length}</span> registro{filtered.length === 1 ? "" : "s"} encontrado{filtered.length === 1 ? "" : "s"}</p><p className="hidden text-xs text-slate-500 sm:block">Clique em um registro para ver detalhes</p></div>
      <section className="mt-3 grid gap-3 xl:grid-cols-2" aria-label="Lista de feedbacks">{filtered.length === 0 ? <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><CircleHelp className="mx-auto h-8 w-8 text-slate-400" /><h3 className="mt-3 font-bold">Nenhum feedback encontrado</h3><p className="mt-1 text-sm text-slate-500">Ajuste a busca ou os filtros para consultar outros registros.</p></div> : filtered.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md sm:p-5"><div className="flex items-start gap-3"><Avatar item={item} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-bold text-slate-900"><DestinationLabel item={item} /></h3><p className="mt-0.5 truncate text-xs text-slate-500">{item.destinationSlug ? `Identificador: ${item.destinationSlug}` : "Sem destino associado"}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${categoryStyles[item.category]}`}>{categoryLabels[item.category]}</span></div><div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500"><Stars rating={item.rating} /><span>{formatDate(item.createdAt)}</span>{!item.isRead && <span className="inline-flex items-center gap-1 font-bold text-sky-700"><span className="h-1.5 w-1.5 rounded-full bg-sky-600" />Não lido</span>}</div></div></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-700">{item.message}</p><p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500"><MapPin className="h-3.5 w-3.5" /> <DestinationLabel item={item} /></p><div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => openDetails(item)} className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"><Eye className="h-4 w-4" />Ver mensagem completa</button><button type="button" disabled={markReadMutation.isPending} onClick={() => toggleRead(item)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60 ${item.isRead ? "border border-slate-200 text-slate-600 hover:bg-slate-50" : "bg-slate-900 text-white hover:bg-slate-800"}`}><Check className="h-4 w-4" />{item.isRead ? "Marcar como não lido" : "Marcar como lido"}</button></div></article>)}</section>
    </div></main>
    {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) closeDetails(); }}><section role="dialog" aria-modal="true" aria-labelledby="feedback-detail-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-sky-700">Detalhes do registro</p><h2 id="feedback-detail-title" className="mt-1 text-2xl font-bold"><DestinationLabel item={selected} /></h2><p className="mt-1 text-sm text-slate-500">Enviado em {formatDate(selected.createdAt)}</p></div><button type="button" onClick={closeDetails} aria-label="Fechar detalhes" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-300"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Detail label="Categoria" value={categoryLabels[selected.category]} /><Detail label="Destino" value={selected.destinationName ?? selected.destinationSlug ?? "Feedback geral do atlas"} /><Detail label="Status" value={selected.isRead ? "Lido" : "Não lido"} /><Detail label="Avaliação" value={selected.rating ? `${selected.rating} de 5 estrelas` : "Não informada"} /></div><blockquote className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{selected.message}</blockquote><form onSubmit={sendReply} className="mt-6 border-t border-slate-200 pt-6"><label htmlFor="feedback-reply" className="text-sm font-bold">Enviar resposta por e-mail <span className="font-normal text-slate-500">(simulado)</span></label><textarea id="feedback-reply" value={reply} onChange={(event) => setReply(event.target.value)} rows={4} placeholder="Escreva uma resposta para esta demonstração" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" /><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-500">O envio não dispara e-mail nem salva dados pessoais.</p><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"><Mail className="h-4 w-4" />Enviar resposta</button></div>{replySent && <p role="status" className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700"><ThumbsUp className="h-4 w-4" />Resposta simulada nesta sessão.</p>}</form></section></div>}
  </div>;
}

function Kpi({ icon, label, value, hint, tone }: { icon: ReactNode; label: string; value: string; hint?: string; tone: "slate" | "amber" | "sky" }) {
  const styles = { slate: "bg-slate-900 text-white", amber: "bg-amber-50 text-amber-950", sky: "bg-sky-50 text-sky-950" };
  return <article className={`rounded-2xl p-4 shadow-sm ${styles[tone]}`}><div className="flex items-center justify-between gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15"><span className="h-5 w-5">{icon}</span></span><strong className="text-3xl tracking-tight">{value}</strong></div><p className="mt-3 text-sm font-bold">{label}</p>{hint && <p className="mt-1 text-xs opacity-70">{hint}</p>}</article>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>;
}

function MapIcon() {
  return <span aria-hidden="true" className="grid h-4 w-4 place-items-center rounded border border-amber-400 text-[9px] font-black text-amber-400">M</span>;
}
