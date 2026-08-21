import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpenText, ChevronLeft, ExternalLink, Landmark, MapPinned, Phone, Route, Store, TreePine } from "lucide-react";
import { Link, useRoute } from "wouter";
import { MvpContentState } from "@/components/MvpContentState";
import { PiauiMap } from "@/components/PiauiMap";
import { PilotCityNavigator } from "@/components/PilotCityNavigator";
import { getPilotCategories, getPilotCity, getPilotCurationTopics, getPilotEditorialHighlights, getPilotItem, getPilotItems, getPilotItinerary, getPilotNearbyItems, loadPilotCatalog, type PilotCatalog, type PilotItemKind } from "@/lib/mvpPilot";
import { trackMvpEvent } from "@/lib/mvpEvents";

const markImage = "/manus-storage/bora-piaui-sun-river-mark_032a7fc1.png";

function SourceLine({ name, url, verifiedAt }: { name: string; url: string; verifiedAt: string }) {
  return <p className="text-xs leading-5 text-[#67705D]">Fonte: <a href={url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#566B37] underline decoration-[#566B37]/35 underline-offset-2">{name}</a> · {verifiedAt}</p>;
}

export default function CityPage() {
  const [, params] = useRoute("/cidades/:slug");
  const [kind, setKind] = useState<PilotItemKind | "all">("all");
  const [category, setCategory] = useState("all");
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<PilotCatalog | null>(null);
  const city = catalog ? getPilotCity(params?.slug ?? "", catalog) : null;
  const categories = useMemo(() => city && catalog ? getPilotCategories(city.slug, kind, catalog) : [], [catalog, city, kind]);
  const items = useMemo(() => city && catalog ? getPilotItems(city.slug, kind, category, catalog) : [], [catalog, category, city, kind]);
  const itinerary = city && catalog ? getPilotItinerary(city.slug, catalog) : null;
  const activeItem = useMemo(() => activeMapId && catalog ? getPilotItem(activeMapId, catalog) : null, [activeMapId, catalog]);
  const nearbyItems = useMemo(() => activeMapId && catalog ? getPilotNearbyItems(activeMapId, catalog) : [], [activeMapId, catalog]);
  const curationTopics = useMemo(() => city && catalog ? getPilotCurationTopics(city.slug, catalog) : [], [catalog, city]);
  const editorialHighlights = useMemo(() => city && catalog ? getPilotEditorialHighlights(city.slug, catalog) : [], [catalog, city]);

  useEffect(() => {
    let mounted = true;
    const delayMs = new URLSearchParams(window.location.search).get("mvpLoading") === "1" ? 450 : 0;
    loadPilotCatalog({ delayMs }).then((nextCatalog) => {
      if (mounted) setCatalog(nextCatalog);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!city) return;
    setCategory("all");
    setActiveMapId(getPilotItems(city.slug, "all", "all", catalog ?? undefined)[0]?.id ?? null);
    trackMvpEvent("search", { scope: "pilot_city", city: city.slug });
  }, [city?.slug]);

  useEffect(() => {
    if (items.length && !items.some((item) => item.id === activeMapId)) setActiveMapId(items[0].id);
  }, [activeMapId, items]);

  useEffect(() => {
    if (catalog && !city) trackMvpEvent("ui_error", { scope: "pilot_city", reason: "not_found", slug: params?.slug ?? "unknown" });
  }, [catalog, city, params?.slug]);

  if (!catalog) {
    return <main className="min-h-screen bg-[#F5ECD8] px-4 py-16 text-[#2E3222] sm:px-6"><div className="mx-auto max-w-2xl"><MvpContentState kind="loading" title="Preparando a cidade" description="Organizando atrações, fontes e referências de navegação." /></div></main>;
  }

  if (!city) {
    return <main className="min-h-screen bg-[#F5ECD8] px-4 py-16 text-[#2E3222] sm:px-6"><div className="mx-auto max-w-2xl"><MvpContentState kind="error" title="Cidade fora do recorte atual" description="Este endereço não está entre as cidades-piloto preparadas para a jornada de MVP." action={<Link href="/" className="tap inline-flex items-center gap-2 rounded-full bg-[#3C482D] px-4 py-2.5 text-sm font-extrabold text-white">Voltar ao atlas <ChevronLeft className="h-4 w-4" /></Link>} /></div></main>;
  }

  const mapItems = items.filter((item) => item.kind === "attraction");

  return (
    <div className="min-h-screen bg-[#F5ECD8] text-[#2E3222]">
      <header className="border-b border-[#3C482D]/12 bg-[#F5ECD8]/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="tap flex items-center gap-3" aria-label="Voltar ao início"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#B9572D]"><img src={markImage} alt="Marca Bora Piauí" className="h-8 w-8 object-contain" /></span><span className="display-font text-[1.4rem] tracking-[-0.06em]">bora <span className="text-[#B9572D]">piauí</span></span></Link>
          <Link href="/#explorar" className="tap inline-flex items-center gap-2 text-sm font-extrabold text-[#566B37] hover:text-[#B9572D]"><ChevronLeft className="h-4 w-4" /> Atlas</Link>
        </div>
      </header>

      <main>
        <section className="border-b border-[#3C482D]/10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14" style={{ background: `linear-gradient(135deg, ${city.accent} 0%, #3C482D 72%)` }}>
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl text-white"><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/70">MVP de cidades · {city.eyebrow}</p><h1 className="display-font mt-4 text-5xl leading-none tracking-[-0.06em] sm:text-6xl">{city.name}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{city.summary}</p></div>
            {itinerary && <Link href={`/roteiros/${itinerary.slug}`} onClick={() => trackMvpEvent("add_to_itinerary", { city: city.slug, itinerary: itinerary.slug })} className="tap inline-flex items-center justify-center gap-2 rounded-full bg-[#FFFDF6] px-5 py-3 text-sm font-extrabold text-[#3C482D] hover:bg-[#F5ECD8]"><Route className="h-4 w-4 text-[#B9572D]" /> Ver roteiro de 1 dia</Link>}
          </div>
        </section>

        <PilotCityNavigator cities={catalog.cities} currentSlug={city.slug} />

        <section className="px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
          <div className="grid gap-6 border-y border-[#3C482D]/12 py-5 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#566B37]">Descoberta por cidade</p><h2 className="display-font mt-3 text-3xl tracking-[-0.05em] sm:text-4xl">Atrações primeiro. Cultura e história com fontes.</h2></div><SourceLine {...city.source} /></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block"><span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#68705C]">Tipo de item</span><select value={kind} onChange={(event) => setKind(event.target.value as PilotItemKind | "all")} className="mt-2 h-11 w-full rounded-full border border-[#3C482D]/14 bg-[#FFFDF6] px-4 text-sm font-bold outline-none focus:border-[#B9572D] focus:ring-2 focus:ring-[#B9572D]/15"><option value="all">Atrações e negócios</option><option value="attraction">Atrações</option><option value="business">Negócios locais</option></select></label>
            <label className="block"><span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#68705C]">Categoria</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-11 w-full rounded-full border border-[#3C482D]/14 bg-[#FFFDF6] px-4 text-sm font-bold outline-none focus:border-[#B9572D] focus:ring-2 focus:ring-[#B9572D]/15"><option value="all">Todas as categorias</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <div className="rounded-2xl border border-[#3C482D]/12 bg-[#FFFDF6] px-4 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#68705C]">Resultado do recorte</p><p className="mt-1 text-sm font-bold text-[#3C482D]">{items.length} {items.length === 1 ? "item disponível" : "itens disponíveis"}</p></div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {items.map((item) => <article key={item.id} className="overflow-hidden rounded-[1.75rem] border border-[#3C482D]/14 bg-[#FFFDF6]">
              {item.image ? <img src={item.image.url} alt={item.image.alt} className="h-48 w-full object-cover" /> : <MvpContentState compact kind="missing-image" title="Imagem em curadoria" description="A interface preserva este espaço até receber uma imagem com crédito e texto alternativo." />}
              <div className="p-5"><div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-[#E9DCC0] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#566B37]">{item.kind === "attraction" ? "Atração" : "Negócio local"} · {item.category}</span>{item.operationalStatus !== "confirmed" && <span className="text-[11px] font-bold text-[#B9572D]">Operação a confirmar</span>}</div><h3 className="display-font mt-4 text-2xl tracking-[-0.04em]">{item.title}</h3><p className="mt-2 text-sm leading-6 text-[#66705E]">{item.summary}</p><div className="mt-4"><SourceLine {...item.source} /></div><div className="mt-5 flex flex-wrap gap-2"><Link href={`/cidades/${city.slug}/locais/${item.slug}`} onClick={() => trackMvpEvent("view_item", { item: item.id, city: city.slug })} className="tap inline-flex items-center gap-2 rounded-full bg-[#3C482D] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#566B37]">Ver detalhes <ArrowRight className="h-4 w-4" /></Link>{item.routeUrl ? <a href={item.routeUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackMvpEvent("open_route", { item: item.id })} className="tap inline-flex items-center gap-2 rounded-full border border-[#3C482D]/18 px-4 py-2.5 text-sm font-extrabold text-[#3C482D] hover:bg-[#EDE0C4]"><MapPinned className="h-4 w-4 text-[#B9572D]" /> Abrir rota</a> : <span className="inline-flex items-center rounded-full border border-[#3C482D]/10 px-4 py-2.5 text-sm font-bold text-[#7B806F]">Rota indisponível</span>}{item.contactUrl && <a href={item.contactUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackMvpEvent("open_external_link", { item: item.id, source: "contact" })} className="tap inline-flex items-center gap-2 rounded-full border border-[#3C482D]/18 px-4 py-2.5 text-sm font-extrabold text-[#3C482D] hover:bg-[#EDE0C4]"><Phone className="h-4 w-4 text-[#B9572D]" /> Contato</a>}{item.externalUrl && <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackMvpEvent("open_external_link", { item: item.id })} className="tap inline-flex items-center gap-2 rounded-full border border-[#3C482D]/18 px-4 py-2.5 text-sm font-extrabold text-[#3C482D] hover:bg-[#EDE0C4]"><ExternalLink className="h-4 w-4" /> Fonte</a>}</div></div>
            </article>)}
          </div>
          {!items.length && <div className="mt-8"><MvpContentState kind="empty" title={kind === "business" ? "Negócios em curadoria" : "Nenhum item neste filtro"} description={kind === "business" ? "Não exibimos restaurantes, passeios ou outros negócios sem validação editorial, fonte e dados operacionais permitidos." : "Ajuste os filtros para retomar as atrações disponíveis neste recorte."} action={<button onClick={() => { setKind("all"); setCategory("all"); }} className="tap rounded-full bg-[#3C482D] px-4 py-2.5 text-sm font-extrabold text-white">Limpar filtros</button>} /></div>}
          {city.slug !== "teresina" && !!curationTopics.length && <aside aria-label="Categorias em curadoria" className="mt-8 grid gap-3 md:grid-cols-2">{curationTopics.map((topic) => <div key={topic.id} className="rounded-2xl border border-dashed border-[#3C482D]/20 bg-[#FFFDF6] p-5"><div className="flex items-center gap-2 text-[#B9572D]"><Store className="h-4 w-4" /><span className="text-[10px] font-extrabold uppercase tracking-[0.14em]">{topic.category === "gastronomy" ? "Para comer" : "Para organizar a visita"}</span></div><h3 className="display-font mt-3 text-xl tracking-[-0.04em]">{topic.title}</h3><p className="mt-2 text-sm leading-6 text-[#66705E]">{topic.description}</p></div>)}</aside>}
          {city.slug === "teresina" && editorialHighlights.length > 0 && <section aria-labelledby="cultura-historia-title" className="mt-10 border-y border-[#3C482D]/12 py-8"><div className="max-w-3xl"><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#566B37]">Leituras de Teresina</p><h2 id="cultura-historia-title" className="display-font mt-3 text-3xl tracking-[-0.05em] sm:text-4xl">Cultura e História</h2><p className="mt-3 text-sm leading-6 text-[#66705E]"><strong className="text-[#3C482D]">Curadoria responsável:</strong> conteúdo editorial com base verificável, e não uma lista de recomendações. Cada bloco indica sua fonte pública para consulta.</p></div><div className="mt-7 grid gap-5 lg:grid-cols-2">{editorialHighlights.map((highlight) => <article key={highlight.id} className="rounded-[1.75rem] border border-[#3C482D]/14 bg-[#FFFDF6] p-6"><div className="flex items-center gap-3 text-[#B9572D]">{highlight.id.endsWith("cultura") ? <BookOpenText className="h-5 w-5" /> : <Landmark className="h-5 w-5" />}<span className="text-[10px] font-extrabold uppercase tracking-[0.14em]">Teresina em contexto</span></div><h3 className="display-font mt-4 text-3xl tracking-[-0.05em]">{highlight.title}</h3><p className="mt-3 text-sm leading-6 text-[#66705E]">{highlight.description}</p><div className="mt-5"><SourceLine {...highlight.source} /></div></article>)}</div></section>}
        </div></section>

        <section id="por-perto" className="bg-[#FFF8EA] px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="grid gap-5 border-y border-[#3C482D]/12 py-5 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#566B37]">Descoberta por proximidade</p><h2 className="display-font mt-3 text-3xl tracking-[-0.05em] sm:text-4xl">{activeItem ? `O que há por perto de ${activeItem.title}` : "Escolha uma âncora no mapa"}</h2></div><p className="max-w-md text-sm leading-6 text-[#66705E]">Relações editoriais de território: não usamos tempo ou distância sem dados confirmados.</p></div>{activeItem && nearbyItems.length ? <div className="mt-7 grid gap-5 lg:grid-cols-2">{nearbyItems.map(({ item, relation }) => <article key={relation.id} className="rounded-[1.75rem] border border-[#3C482D]/14 bg-[#FFFDF6] p-6"><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#B9572D]">{relation.category}</p><h3 className="display-font mt-3 text-3xl tracking-[-0.05em]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[#66705E]">{relation.editorialReason}</p><div className="mt-5"><SourceLine {...relation.source} /></div><div className="mt-5 flex flex-wrap gap-2"><Link href={`/cidades/${city.slug}/locais/${item.slug}`} onClick={() => trackMvpEvent("view_item", { item: item.id, anchor: activeItem.id, source: "proximity" })} className="tap inline-flex items-center gap-2 rounded-full bg-[#3C482D] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#566B37]">Conhecer o local <ArrowRight className="h-4 w-4" /></Link>{item.routeUrl && <a href={item.routeUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackMvpEvent("open_route", { item: item.id, anchor: activeItem.id, source: "proximity" })} className="tap inline-flex items-center gap-2 rounded-full border border-[#3C482D]/18 px-4 py-2.5 text-sm font-extrabold text-[#3C482D] hover:bg-[#EDE0C4]"><MapPinned className="h-4 w-4 text-[#B9572D]" /> Abrir rota</a>}</div></article>)}</div> : <div className="mt-7"><MvpContentState compact kind="empty" title="Relações próximas em curadoria" description={activeItem ? "Ainda não há uma conexão editorial publicada para este ponto. A cidade continua disponível para exploração por filtros e mapa." : "Selecione um marcador para ver as relações editoriais já publicadas."} /></div>}</div></section>

        <section className="bg-[#EDE0C4] px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#566B37]">Mapa sincronizado</p><h2 className="display-font mt-3 text-3xl tracking-[-0.05em] sm:text-4xl">Localize as atrações do recorte.</h2></div><p className="max-w-md text-sm leading-6 text-[#66705E]">O mapa acompanha a lista filtrada. Dados de rota e operação continuam dependentes de confirmação.</p></div>{mapItems.length ? <div className="mt-7"><PiauiMap places={mapItems.map((item) => ({ id: item.id, title: item.title, municipality: city.name, category: item.category, mapQuery: item.mapQuery, accent: item.accent }))} activePlaceId={activeMapId} onSelect={(id) => { setActiveMapId(id); trackMvpEvent("view_item", { item: id, source: "city_map" }); }} /></div> : <div className="mt-7"><MvpContentState kind="empty" title="Sem atrações para mapear neste filtro" description="Selecione atrações ou limpe os filtros para disponibilizar os marcadores." /></div>}</div></section>

        <section className="px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl rounded-[2rem] border border-[#3C482D]/14 bg-[#FFFDF6] p-6 sm:p-8"><div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center"><div><div className="flex items-center gap-2 text-[#B9572D]"><TreePine className="h-5 w-5" /><span className="text-[10px] font-extrabold uppercase tracking-[0.15em]">Próxima parada</span></div><h2 className="display-font mt-3 text-3xl tracking-[-0.05em]">Planeje com margem para confirmação.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#66705E]">{itinerary?.confirmationNotice ?? "Os dados de roteiro ainda serão integrados à curadoria."}</p></div>{itinerary && <Link href={`/roteiros/${itinerary.slug}`} className="tap inline-flex items-center justify-center gap-2 rounded-full bg-[#B9572D] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#CD6D45]"><Store className="h-4 w-4" /> Abrir roteiro</Link>}</div></div></section>
      </main>
    </div>
  );
}
