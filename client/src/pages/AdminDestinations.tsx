import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, Check, Eye, Handshake, ImagePlus, Loader2, Map, MessageSquare, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { ADMIN_FEEDBACKS_ROUTE } from "@/pages/AdminFeedbacks";

type Editable = Record<string, string | boolean>;
type DemoImage = { id: number; imageUrl: string; altText: string; caption?: string | null; sortOrder: number };
type DemoDestination = {
  id: number;
  images: DemoImage[];
  [key: string]: string | boolean | number | DemoImage[] | null | undefined;
};

const emptyForm: Editable = {
  slug: "", title: "", polo: "", category: "", municipality: "", summary: "", description: "", mapQuery: "", routeUrl: "", sourceName: "", sourceUrl: "", sourceYear: "", operationalStatus: "verificar", hours: "", pricing: "", accessInfo: "", contactInfo: "", visitNotes: "", operationalSource: "", operationalSourceUrl: "", lastVerifiedAt: "", published: false,
};

function toForm(destination: any): Editable {
  return {
    ...emptyForm,
    ...destination,
    lastVerifiedAt: destination.lastVerifiedAt ? new Date(destination.lastVerifiedAt).toISOString().slice(0, 10) : "",
    hours: destination.hours ?? "", pricing: destination.pricing ?? "", accessInfo: destination.accessInfo ?? "", contactInfo: destination.contactInfo ?? "", visitNotes: destination.visitNotes ?? "", operationalSource: destination.operationalSource ?? "", operationalSourceUrl: destination.operationalSourceUrl ?? "",
  };
}

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (value: string) => void; hint?: string }) {
  return <div><Label>{label}</Label><Input className="mt-2" value={value} onChange={(event) => onChange(event.target.value)} />{hint && <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>}</div>;
}

function TextField({ label, value, onChange, rows }: { label: string; value: string; onChange: (value: string) => void; rows: number }) {
  return <div className="mt-4"><Label>{label}</Label><Textarea className="mt-2" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

export default function AdminDestinations() {
  const { data, isLoading } = trpc.destinations.list.useQuery();
  const [items, setItems] = useState<DemoDestination[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<Editable>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");

  useEffect(() => {
    if (data && items === null) setItems(data.map((item) => ({ ...item, ...toForm(item), images: item.images ?? [] }) as unknown as DemoDestination));
  }, [data, items]);

  const destinations = items ?? [];
  const selected = useMemo(() => destinations.find((item) => item.id === selectedId) ?? null, [destinations, selectedId]);
  useEffect(() => { if (selected) setForm(toForm(selected)); }, [selected]);
  const setField = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const save = () => {
    const title = String(form.title).trim();
    if (!title) { toast.error("Informe ao menos o título do destino para a simulação."); return; }
    const updated = { ...form, id: selected?.id ?? Date.now(), images: selected?.images ?? [] } as DemoDestination;
    setItems((current) => selected ? (current ?? []).map((item) => item.id === selected.id ? updated : item) : [...(current ?? []), updated]);
    setSelectedId(updated.id);
    toast.success("Alteração simulada nesta sessão. Nada foi publicado no atlas.");
  };

  const togglePublished = () => {
    if (!selected) return;
    const published = !selected.published;
    setItems((current) => (current ?? []).map((item) => item.id === selected.id ? { ...item, published } : item));
    setForm((current) => ({ ...current, published }));
    toast.success(published ? "Publicação simulada." : "Despublicação simulada.");
  };

  const addImage = () => {
    if (!selected || !imageFile || !imageAlt.trim()) { toast.error("Selecione uma imagem e escreva um texto alternativo."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const image: DemoImage = { id: Date.now(), imageUrl: String(reader.result), altText: imageAlt.trim(), caption: imageCaption.trim() || null, sortOrder: selected.images.length };
      setItems((current) => (current ?? []).map((item) => item.id === selected.id ? { ...item, images: [...item.images, image] } : item));
      setImageFile(null); setImageAlt(""); setImageCaption("");
      toast.success("Imagem adicionada apenas à demonstração local.");
    };
    reader.readAsDataURL(imageFile);
  };

  const removeImage = (id: number) => {
    if (!selected) return;
    setItems((current) => (current ?? []).map((item) => item.id === selected.id ? { ...item, images: item.images.filter((image) => image.id !== id) } : item));
    toast.success("Imagem removida da demonstração local.");
  };

  if (isLoading || items === null) return <div className="grid min-h-screen place-items-center bg-[#F5ECD8]"><Loader2 className="animate-spin text-[#B9572D]" /></div>;

  return <div className="min-h-screen bg-[#F5ECD8] text-[#26311E] lg:grid lg:grid-cols-[260px_1fr]">
    <aside className="bg-[#314027] px-6 py-7 text-[#F5ECD8] lg:min-h-screen"><div className="flex items-center justify-between lg:block"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#D9A640]">Bora Piauí</p><h1 className="display-font mt-2 text-3xl">Painel<br />demonstrativo</h1></div><Link href="/" className="rounded-full border border-[#F5ECD8]/30 p-2 lg:hidden"><ArrowUpRight className="h-4 w-4" /></Link></div><p className="mt-5 max-w-[210px] text-sm leading-6 text-[#F5ECD8]/70">Edições e imagens funcionam somente nesta sessão do navegador.</p><nav className="mt-10 space-y-2"><div className="flex items-center gap-3 rounded-xl bg-[#F5ECD8]/10 px-3 py-3 text-sm font-bold"><Map className="h-4 w-4 text-[#D9A640]" />Destinos</div><Link href="/admin/editorial" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#F5ECD8]/75 hover:bg-[#F5ECD8]/10"><Handshake className="h-4 w-4 text-[#D9A640]" />Agenda e parceiros</Link><Link href={ADMIN_FEEDBACKS_ROUTE} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#F5ECD8]/75 hover:bg-[#F5ECD8]/10"><MessageSquare className="h-4 w-4 text-[#D9A640]" />Feedbacks</Link><Link href="/" className="hidden items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-[#F5ECD8]/75 hover:bg-[#F5ECD8]/10 lg:flex"><Eye className="h-4 w-4 text-[#D9A640]" />Ver atlas público</Link></nav></aside>
    <main className="px-5 py-7 sm:px-8 lg:px-12 lg:py-10"><div className="mx-auto max-w-7xl"><header className="flex flex-col justify-between gap-5 border-b border-[#314027]/15 pb-7 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#B9572D]">Protótipo · edição local</p><h2 className="display-font mt-2 text-4xl tracking-[-.05em] sm:text-5xl">Destinos e visitação</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#536049]">Uma prévia de como a equipe pode organizar conteúdo, imagens e condições de visitação. As ações abaixo não alteram o site publicado.</p></div><div className="flex flex-wrap gap-2"><Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[#314027]/20 px-4 py-2 text-sm font-bold">Ver atlas <ArrowUpRight className="h-4 w-4" /></Link><Button onClick={() => { setSelectedId(null); setForm(emptyForm); }} className="rounded-full bg-[#B9572D] hover:bg-[#A84626]"><Plus className="mr-2 h-4 w-4" />Novo rascunho</Button></div></header>
      <div className="mt-7 grid gap-6 xl:grid-cols-[.72fr_1.28fr]"><section className="rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-4"><div className="flex items-center justify-between px-2"><h3 className="text-sm font-bold">{destinations.length} destinos</h3><span className="rounded-full bg-[#D9A640]/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#735A10]">demo</span></div><div className="mt-3 space-y-2">{destinations.map((item) => <button key={item.id} onClick={() => setSelectedId(item.id)} className={`w-full rounded-xl p-3 text-left transition-colors ${selectedId === item.id ? "bg-[#F5ECD8] ring-1 ring-[#B9572D]/25" : "hover:bg-[#F5ECD8]/75"}`}><div className="flex justify-between gap-2"><span className="font-bold">{String(item.title)}</span><span className={`text-[10px] font-bold ${item.published ? "text-[#566B37]" : "text-muted-foreground"}`}>{item.published ? "PUBLICADO" : "RASCUNHO"}</span></div><p className="mt-1 text-xs text-muted-foreground">{String(item.polo)} · {String(item.municipality)}</p></button>)}</div></section>
        <section className="rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#B9572D]">{selected ? "Editar destino" : "Novo rascunho"}</p><h3 className="mt-1 text-2xl font-bold">{selected ? String(selected.title) : "Preencha a ficha"}</h3></div>{selected && <Button variant="outline" onClick={togglePublished}>{selected.published ? "Simular despublicação" : "Simular publicação"}</Button>}</div>
          <div className="mt-7 grid gap-4 md:grid-cols-2"><Field label="Título" value={String(form.title)} onChange={(value) => setField("title", value)} /><Field label="Slug" value={String(form.slug)} onChange={(value) => setField("slug", value)} hint="minúsculas e hífens" /><Field label="Polo" value={String(form.polo)} onChange={(value) => setField("polo", value)} /><Field label="Categoria" value={String(form.category)} onChange={(value) => setField("category", value)} /><Field label="Município" value={String(form.municipality)} onChange={(value) => setField("municipality", value)} /><Field label="Pesquisa no mapa" value={String(form.mapQuery)} onChange={(value) => setField("mapQuery", value)} /><Field label="URL de rota" value={String(form.routeUrl)} onChange={(value) => setField("routeUrl", value)} /><Field label="Fonte institucional" value={String(form.sourceName)} onChange={(value) => setField("sourceName", value)} /><Field label="URL da fonte" value={String(form.sourceUrl)} onChange={(value) => setField("sourceUrl", value)} /><Field label="Ano / referência da fonte" value={String(form.sourceYear)} onChange={(value) => setField("sourceYear", value)} /><div><Label>Status operacional</Label><select value={String(form.operationalStatus)} onChange={(event) => setField("operationalStatus", event.target.value)} className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"><option value="verificar">Verificar</option><option value="confirmado">Confirmado</option><option value="indisponivel">Indisponível</option></select></div><div><Label>Última confirmação</Label><Input className="mt-2" type="date" value={String(form.lastVerifiedAt)} onChange={(event) => setField("lastVerifiedAt", event.target.value)} /></div></div>
          <div className="mt-4"><TextField label="Resumo" value={String(form.summary)} onChange={(value) => setField("summary", value)} rows={2} /><TextField label="Descrição" value={String(form.description)} onChange={(value) => setField("description", value)} rows={5} /><div className="grid gap-4 md:grid-cols-2"><TextField label="Horários confirmados" value={String(form.hours)} onChange={(value) => setField("hours", value)} rows={2} /><TextField label="Valores confirmados" value={String(form.pricing)} onChange={(value) => setField("pricing", value)} rows={2} /><TextField label="Acesso" value={String(form.accessInfo)} onChange={(value) => setField("accessInfo", value)} rows={2} /><TextField label="Contato" value={String(form.contactInfo)} onChange={(value) => setField("contactInfo", value)} rows={2} /><TextField label="Notas para a visita" value={String(form.visitNotes)} onChange={(value) => setField("visitNotes", value)} rows={3} /><div className="space-y-3"><Field label="Fonte operacional" value={String(form.operationalSource)} onChange={(value) => setField("operationalSource", value)} /><Field label="URL da fonte operacional" value={String(form.operationalSourceUrl)} onChange={(value) => setField("operationalSourceUrl", value)} /></div></div></div>
          <label className="mt-5 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={Boolean(form.published)} onChange={(event) => setField("published", event.target.checked)} /> Publicar no atlas</label><Button onClick={save} className="mt-5 rounded-full bg-[#B9572D] hover:bg-[#A84626]"><Save className="mr-2 h-4 w-4" />Salvar simulação</Button>
          {selected && <div className="mt-10 border-t border-[#314027]/15 pt-7"><div className="flex items-center gap-2"><ImagePlus className="h-5 w-5 text-[#B9572D]" /><h4 className="text-lg font-bold">Galeria demonstrativa</h4></div><p className="mt-1 text-xs text-muted-foreground">Os arquivos selecionados permanecem apenas nesta tela até que ela seja fechada.</p><div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]"><Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} /><Input value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} placeholder="Texto alternativo descritivo" /><Button variant="outline" onClick={addImage}>Adicionar imagem</Button></div><Input className="mt-3" value={imageCaption} onChange={(event) => setImageCaption(event.target.value)} placeholder="Legenda e crédito, se aplicável" /><div className="mt-5 grid gap-3 sm:grid-cols-2">{selected.images.map((image) => <div key={image.id} className="overflow-hidden rounded-xl border border-[#314027]/15"><img src={image.imageUrl} alt={image.altText} className="h-36 w-full object-cover" /><div className="flex items-center justify-between gap-3 p-3"><span className="line-clamp-2 text-xs text-muted-foreground">{image.altText}</span><Button size="icon" variant="ghost" aria-label="Remover imagem" onClick={() => removeImage(image.id)}><Trash2 className="h-4 w-4 text-[#B9572D]" /></Button></div></div>)}</div></div>}
        </section></div><p className="mt-7 flex items-center gap-2 text-xs text-[#566B37]"><Check className="h-4 w-4" />Modo demonstrativo ativo: a base pública não recebe alterações nesta tela.</p></div></main>
  </div>;
}
