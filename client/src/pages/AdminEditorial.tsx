import { useState } from "react";
import { CalendarDays, Check, Download, Eye, Handshake, Loader2, Plus, Send, ShieldCheck, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { buildPartnerProposalsCsv, partnerProposalsCsvFilename } from "@/lib/partnerCsv";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type EventForm = { title: string; city: string; category: string; date: string; endDate: string; venue: string; summary: string; sourceName: string; sourceUrl: string };
const emptyEvent: EventForm = { title: "", city: "", category: "Cultura", date: "", endDate: "", venue: "", summary: "", sourceName: "", sourceUrl: "" };
const statusLabels = {
  pendente: "Pendente",
  em_revisao: "Em revisão",
  aprovado: "Aprovado",
  recusado: "Recusado",
} as const;
type EditorialStatus = keyof typeof statusLabels;

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `evento-${Date.now()}`;
}

export default function AdminEditorial() {
  const utils = trpc.useUtils();
  const eventsQuery = trpc.agenda.adminList.useQuery(undefined, { retry: false });
  const proposalsQuery = trpc.partners.adminList.useQuery(undefined, { retry: false });
  const events = eventsQuery.data ?? [];
  const proposals = proposalsQuery.data ?? [];
  const [form, setForm] = useState<EventForm>(emptyEvent);
  const [eventToRemove, setEventToRemove] = useState<{ id: number; title: string } | null>(null);
  const createEvent = trpc.agenda.create.useMutation({
    onSuccess: () => { utils.agenda.adminList.invalidate(); utils.agenda.list.invalidate(); setForm(emptyEvent); toast.success("Evento criado e armazenado para curadoria."); },
    onError: error => toast.error(error.message),
  });
  const updateEvent = trpc.agenda.update.useMutation({
    onSuccess: () => { utils.agenda.adminList.invalidate(); utils.agenda.list.invalidate(); toast.success("Estado editorial do evento atualizado."); },
    onError: error => toast.error(error.message),
  });
  const removeEvent = trpc.agenda.delete.useMutation({
    onSuccess: () => { utils.agenda.adminList.invalidate(); utils.agenda.list.invalidate(); setEventToRemove(null); toast.success("Programação removida do protótipo."); },
    onError: error => toast.error(error.message),
  });
  const updateProposal = trpc.partners.updateEditorialStatus.useMutation({
    onSuccess: () => { utils.partners.adminList.invalidate(); toast.success("Status editorial persistido."); },
    onError: error => toast.error(error.message),
  });
  if (eventsQuery.error || proposalsQuery.error) {
    return <div className="grid min-h-screen place-items-center bg-[#F5ECD8] px-6 text-[#26311E]"><div className="max-w-md rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-7 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#E9DCC0] text-[#B9572D]"><ShieldCheck className="h-5 w-5" /></span><h1 className="display-font mt-4 text-3xl">Área editorial restrita</h1><p className="mt-3 text-sm leading-6 text-[#536049]">Este painel é exclusivo da equipe de curadoria. Entre com a conta editorial para gerenciar a Agenda e as propostas de parceiros.</p><div className="mt-5 flex flex-wrap items-center justify-center gap-2"><Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#A84626]">Entrar</Link><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[#314027]/20 px-4 py-2.5 text-sm font-extrabold text-[#314027] hover:bg-[#F5ECD8]">Voltar ao atlas público</Link></div></div></div>;
  }
  const addEvent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.city.trim() || !form.date || !form.venue.trim() || !form.summary.trim() || !form.sourceName.trim() || !form.sourceUrl.trim()) { toast.error("Preencha título, cidade, período, local, resumo e referência de fonte."); return; }
    if (form.endDate && form.endDate < form.date) { toast.error("A data de término não pode ser anterior à data de início."); return; }
    createEvent.mutate({ slug: `${slugify(form.title)}-${Date.now()}`, title: form.title.trim(), city: form.city.trim(), category: form.category, startsAt: new Date(`${form.date}T12:00:00`).toISOString(), endsAt: form.endDate ? new Date(`${form.endDate}T12:00:00`).toISOString() : null, venue: form.venue.trim(), summary: form.summary.trim(), sourceName: form.sourceName.trim(), sourceUrl: form.sourceUrl.trim(), confirmationStatus: "confirmado", published: false });
  };
  const toggleEvent = (item: typeof events[number]) => updateEvent.mutate({ id: item.id, published: !item.published });
  const confirmRemoveEvent = () => {
    if (eventToRemove) removeEvent.mutate({ id: eventToRemove.id });
  };
  const formatEventPeriod = (item: typeof events[number]) => {
    const start = new Date(item.startsAt).toLocaleDateString("pt-BR");
    const end = item.endsAt ? new Date(item.endsAt).toLocaleDateString("pt-BR") : null;
    return end && end !== start ? `${start} — ${end}` : start;
  };
  const exportProposals = () => {
    if (!proposals.length) {
      toast.error("Ainda não há propostas para exportar.");
      return;
    }

    const csv = buildPartnerProposalsCsv(proposals);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = partnerProposalsCsvFilename();
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    toast.success(`${proposals.length} proposta${proposals.length === 1 ? "" : "s"} exportada${proposals.length === 1 ? "" : "s"} em CSV.`);
  };

  return <div className="min-h-screen bg-[#F5ECD8] text-[#26311E] lg:grid lg:grid-cols-[260px_1fr]"><aside className="bg-[#314027] px-6 py-7 text-[#F5ECD8] lg:min-h-screen"><div className="flex items-center justify-between lg:block"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#D9A640]">Bora Piauí</p><h1 className="display-font mt-2 text-3xl">Painel<br />demonstrativo</h1></div><Link href="/" className="rounded-full border border-[#F5ECD8]/30 p-2 lg:hidden"><Eye className="h-4 w-4" /></Link></div><p className="mt-5 max-w-[210px] text-sm leading-6 text-[#F5ECD8]/70">Este painel persiste a curadoria da Agenda e das propostas de parceiros no banco do protótipo.</p><nav className="mt-10 space-y-2"><Link href="/admin/destinos" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#F5ECD8]/75 hover:bg-[#F5ECD8]/10"><CalendarDays className="h-4 w-4 text-[#D9A640]" />Destinos</Link><div className="flex items-center gap-3 rounded-xl bg-[#F5ECD8]/10 px-3 py-3 text-sm font-bold"><Handshake className="h-4 w-4 text-[#D9A640]" />Agenda e parceiros</div><Link href="/" className="hidden items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#F5ECD8]/75 hover:bg-[#F5ECD8]/10 lg:flex"><Eye className="h-4 w-4 text-[#D9A640]" />Ver atlas público</Link></nav></aside>
    <main className="px-5 py-7 sm:px-8 lg:px-12 lg:py-10"><div className="mx-auto max-w-6xl"><header className="border-b border-[#314027]/15 pb-7"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#B9572D]">Protótipo · curadoria persistida</p><h2 className="display-font mt-2 text-4xl tracking-[-.05em] sm:text-5xl">Agenda e rede local</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#536049]">Uma demonstração do fluxo editorial: eventos só aparecem publicamente quando confirmados e publicados; propostas recebidas seguem em revisão humana.</p></header>
      <section className="mt-8 grid gap-6 xl:grid-cols-[.95fr_1.05fr]"><form onSubmit={addEvent} className="rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-5 sm:p-7"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#E9DCC0] text-[#B9572D]"><CalendarDays className="h-4 w-4" /></span><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#B9572D]">Agenda</p><h3 className="text-xl font-bold">Preparar programação</h3></div></div><p className="mt-4 text-xs leading-5 text-[#566457]">A ficha exige fonte e período antes de permitir uma publicação editorial.</p><div className="mt-5 grid gap-4"><label className="text-sm font-bold">Título<input required value={form.title} onChange={event => setForm(current => ({ ...current, title: event.target.value }))} className="mt-2 h-10 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Cidade<input required value={form.city} onChange={event => setForm(current => ({ ...current, city: event.target.value }))} className="mt-2 h-10 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm" /></label><label className="text-sm font-bold">Categoria<select value={form.category} onChange={event => setForm(current => ({ ...current, category: event.target.value }))} className="mt-2 h-10 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm"><option>Cultura</option><option>Patrimônio</option><option>Gastronomia</option><option>Natureza</option></select></label></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold">Data de início<input required type="date" value={form.date} onChange={event => setForm(current => ({ ...current, date: event.target.value }))} className="mt-2 h-10 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm" /></label><label className="text-sm font-bold">Data de término <span className="font-normal text-[#566457]">(opcional)</span><input type="date" min={form.date || undefined} value={form.endDate} onChange={event => setForm(current => ({ ...current, endDate: event.target.value }))} className="mt-2 h-10 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm" /></label></div><label className="text-sm font-bold">Local<input required value={form.venue} onChange={event => setForm(current => ({ ...current, venue: event.target.value }))} className="mt-2 h-10 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm" /></label><label className="text-sm font-bold">Resumo editorial<textarea required minLength={20} rows={3} value={form.summary} onChange={event => setForm(current => ({ ...current, summary: event.target.value }))} className="mt-2 w-full rounded-md border border-[#314027]/15 bg-white p-3 text-sm" /></label><label className="text-sm font-bold">Nome da fonte<input required value={form.sourceName} onChange={event => setForm(current => ({ ...current, sourceName: event.target.value }))} className="mt-2 h-10 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm" /></label><label className="text-sm font-bold">URL da fonte<input required type="url" value={form.sourceUrl} onChange={event => setForm(current => ({ ...current, sourceUrl: event.target.value }))} className="mt-2 h-10 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm" /></label></div><button type="submit" disabled={createEvent.isPending} className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[#B9572D] px-4 text-sm font-bold text-white hover:bg-[#A84626] disabled:opacity-60"><Plus className="h-4 w-4" />{createEvent.isPending ? "Criando…" : "Adicionar rascunho"}</button></form>
        <section className="rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#B9572D]">Revisão editorial</p><h3 className="mt-1 text-xl font-bold">Eventos persistidos</h3></div><span className="rounded-full bg-[#D9A640]/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#735A10]">banco do protótipo</span></div><div className="mt-5 space-y-3">{eventsQuery.isLoading ? <div className="flex items-center gap-2 text-sm text-[#566457]"><Loader2 className="h-4 w-4 animate-spin" />Carregando eventos…</div> : events.length === 0 ? <p className="rounded-xl border border-dashed border-[#314027]/20 p-5 text-sm leading-6 text-[#566457]">Nenhuma programação cadastrada. Use a ficha ao lado para preparar um evento e depois simular sua publicação.</p> : events.map(item => <article key={item.id} className="rounded-xl border border-[#314027]/12 bg-white p-4"><div className="flex flex-col gap-4 sm:flex-row sm:justify-between"><div><h4 className="font-bold">{item.title}</h4><p className="mt-1 text-xs text-[#566457]">{item.city} · {item.venue} · {formatEventPeriod(item)}</p><p className="mt-2 text-xs font-semibold text-[#566B37]">Fonte: {item.sourceName}</p></div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" disabled={updateEvent.isPending} onClick={() => toggleEvent(item)} className={`rounded-full px-3 py-2 text-xs font-bold disabled:opacity-60 ${item.published ? "bg-[#566B37] text-white" : "bg-[#E9DCC0] text-[#566B37]"}`}>{item.published ? "Despublicar" : "Publicar"}</button><button type="button" disabled={removeEvent.isPending} onClick={() => setEventToRemove({ id: item.id, title: item.title })} className="inline-flex items-center gap-1 rounded-full border border-[#B9572D]/35 px-3 py-2 text-xs font-bold text-[#B9572D] hover:bg-[#B9572D]/10 disabled:opacity-60"><Trash2 className="h-3.5 w-3.5" />Remover</button></div></div></article>)}</div></section></section>
      <section className="mt-6 rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-5 sm:p-7"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#E9DCC0] text-[#B9572D]"><Handshake className="h-4 w-4" /></span><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#B9572D]">Rede local</p><h3 className="text-xl font-bold">Propostas recebidas</h3></div></div><div className="flex flex-wrap items-center gap-3"><button type="button" title="Exporta somente campos não sensíveis para demonstração" disabled={proposalsQuery.isLoading || proposals.length === 0} onClick={exportProposals} className="inline-flex h-9 items-center gap-2 rounded-full border border-[#566B37] px-3 text-xs font-bold text-[#566B37] hover:bg-[#566B37] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"><Download className="h-4 w-4" />Exportar CSV</button><Link href="/parceiros" className="inline-flex items-center gap-2 text-sm font-bold text-[#B9572D] hover:underline">Abrir formulário público <Send className="h-4 w-4" /></Link></div></div><p className="mt-4 flex gap-2 text-xs leading-5 text-[#566457]"><ShieldCheck className="h-4 w-4 shrink-0 text-[#B9572D]" />As propostas são gravadas no banco do protótipo. A exportação demonstrativa omite telefone, endereço e descrição; alterar status não publica dados ou perfis automaticamente no atlas.</p><div className="mt-5 grid gap-4 lg:grid-cols-2">{proposalsQuery.isLoading ? <div className="flex items-center gap-2 text-sm text-[#566457]"><Loader2 className="h-4 w-4 animate-spin" />Carregando propostas…</div> : proposals.length === 0 ? <p className="rounded-xl border border-dashed border-[#314027]/20 p-5 text-sm leading-6 text-[#566457]">Ainda não há propostas recebidas. O formulário “Seja parceiro” cria os registros que aparecem neste painel.</p> : proposals.map(item => <article key={item.id} className="rounded-xl border border-[#314027]/12 bg-white p-4"><div className="flex items-start justify-between gap-4"><div><h4 className="font-bold">{item.businessName}</h4><p className="mt-1 text-xs text-[#566457]">{item.city} · {item.category}</p></div><span className="rounded-full bg-[#E9DCC0] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#566B37]">{item.plan}</span></div><label className="mt-4 block text-xs font-bold">Status editorial<select value={item.editorialStatus} disabled={updateProposal.isPending} onChange={event => updateProposal.mutate({ id: item.id, editorialStatus: event.target.value as EditorialStatus, editorialNotes: item.editorialNotes ?? null })} className="mt-2 h-9 w-full rounded-md border border-[#314027]/15 bg-[#FDF9F0] px-3 text-sm disabled:opacity-60">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></article>)}</div></section>
      <p className="mt-7 flex items-center gap-2 text-xs text-[#566B37]"><Check className="h-4 w-4" />Modo de protótipo ativo: o painel persiste registros de teste, mas não oferece contas, cobrança ou publicação automática de parceiros.</p>
      <AlertDialog open={Boolean(eventToRemove)} onOpenChange={open => { if (!open) setEventToRemove(null); }}><AlertDialogContent className="border-[#314027]/15 bg-[#FDF9F0] text-[#26311E]"><AlertDialogHeader><AlertDialogTitle>Remover programação?</AlertDialogTitle><AlertDialogDescription className="leading-6 text-[#566457]">{eventToRemove ? `“${eventToRemove.title}” será removida definitivamente do banco do protótipo e deixará de aparecer na Agenda se estiver publicada.` : "Esta ação remove a programação do protótipo."}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={removeEvent.isPending}>Cancelar</AlertDialogCancel><AlertDialogAction disabled={removeEvent.isPending} onClick={event => { event.preventDefault(); confirmRemoveEvent(); }} className="bg-[#B9572D] text-white hover:bg-[#A84626]">{removeEvent.isPending ? "Removendo…" : "Remover programação"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div></main></div>;
}
