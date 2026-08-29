/* Cerrado e Rios — Atlas de Percursos: atlas editorial, filtros territoriais e dados públicos; barro queimado é a única cor de ação. */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ArrowRight,
  Bookmark,
  ChartNoAxesColumnIncreasing,
  Check,
  Compass,
  ExternalLink,
  Info,
  Landmark,
  MapPinned,
  Menu,
  MessageSquare,
  Minus,
  Moon,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  TreePine,
  Waves,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PiauiMap } from "@/components/PiauiMap";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTheme } from "@/contexts/ThemeContext";
import { getPilotItinerary, pilotCities } from "@/lib/mvpPilot";
import { confusoesUrl, deltaSourceUrl, observatoryUrl, pilotPlaces as places, seteCidadesUrl, type Category, type Place, type Region } from "@/lib/mvpPlaces";
import { trackMvpEvent } from "@/lib/mvpEvents";

const heroImage = "/manus-storage/bora-piaui-atlas-hero_eff0e2e7.jpg";
const markImage = "/manus-storage/bora-piaui-sun-river-mark_032a7fc1.png";
const ibgeUrl = "https://www.ibge.gov.br/cidades-e-estados/pi.html";
const capivaraVisitUrl = "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/caatinga/lista-de-ucs/parna-da-serra-da-capivara/arquivos/p5_pup_serracapivara_final_vf_junho_2026__4_.pdf";


const categories = ["Todos", "Natureza", "Patrimônio", "Litoral", "Cultura", "Cidade"] as const;
const regions = ["Todos", "Polo Teresina", "Aventura e Mistério", "Costa do Delta", "Águas", "Nascentes", "Origens", "Histórico Cultural"] as const;

export function getAvailablePoles(
  catalog: Pick<Place, "region" | "category" | "title" | "municipality">[],
  selectedCategory: (typeof categories)[number],
  searchQuery: string,
) {
  const normalizedQuery = searchQuery.toLowerCase();

  return (regions.slice(1) as Region[]).flatMap((item) => {
    const total = catalog.filter((place) =>
      place.region === item
      && (selectedCategory === "Todos" || place.category === selectedCategory)
      && `${place.title} ${place.category} ${place.region} ${place.municipality}`.toLowerCase().includes(normalizedQuery),
    ).length;

    return total ? [{ region: item, total }] : [];
  });
}

export function getPolePreview(
  catalog: Pick<Place, "id" | "region" | "category" | "title" | "municipality" | "text" | "image" | "accent">[],
  targetRegion: Region | null,
  selectedCategory: (typeof categories)[number],
  searchQuery: string,
) {
  if (!targetRegion) return null;
  const normalizedQuery = searchQuery.toLowerCase();
  return catalog.find((place) =>
    place.region === targetRegion
    && (selectedCategory === "Todos" || place.category === selectedCategory)
    && `${place.title} ${place.category} ${place.region} ${place.municipality}`.toLowerCase().includes(normalizedQuery),
  ) ?? catalog.find((place) => place.region === targetRegion) ?? null;
}

const supplyData = [
  { name: "Restaurantes", total: 378 },
  { name: "Agências", total: 323 },
  { name: "Eventos", total: 310 },
  { name: "Transportes", total: 204 },
  { name: "Especializados", total: 124 },
];
const protectedAreaData = [
  { name: "Serra das Confusões", area: 823854.54 },
  { name: "APA Delta", area: 307590.51 },
  { name: "Sete Cidades", area: 6303.64 },
];
const supplyChartConfig = { total: { label: "Empreendimentos", color: "#B9572D" } } satisfies ChartConfig;
const areaChartConfig = { area: { label: "Hectares", color: "#566B37" } } satisfies ChartConfig;
const format = new Intl.NumberFormat("pt-BR");

function sourceAnchor(url: string, label: string) {
  return <a href={url} target="_blank" rel="noopener noreferrer" className="font-extrabold underline decoration-[#B9572D]/45 underline-offset-2 hover:text-[#B9572D]">{label}</a>;
}

export default function Home() {
  const { data: publishedDestinations } = trpc.destinations.list.useQuery();
  const { theme, toggleTheme } = useTheme();
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const [region, setRegion] = useState<(typeof regions)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [itinerary, setItinerary] = useState<string[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [mapFocus, setMapFocus] = useState<string | null>("delta-do-parnaiba");
  const [polePreviewRegion, setPolePreviewRegion] = useState<Region | null>(null);
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [feedbackPlace, setFeedbackPlace] = useState<Place | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const anyDialogOpen = Boolean(selected) || plannerOpen || feedbackPlace;
  useEffect(() => {
    if (!anyDialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [anyDialogOpen]);
  useEffect(() => {
    if (!anyDialogOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        setPlannerOpen(false);
        setFeedbackPlace(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [anyDialogOpen]);

  const catalogPlaces = useMemo<Place[]>(() => {
    if (!publishedDestinations) return places;
    return publishedDestinations.map((destination, index) => {
      const existing = places.find((place) => place.id === destination.slug);
      return {
        id: destination.slug,
        title: destination.title,
        category: destination.category as Category,
        region: destination.polo as Region,
        municipality: destination.municipality,
        text: destination.summary,
        detail: destination.description,
        route: destination.routeUrl,
        mapQuery: destination.mapQuery,
        sourceName: destination.sourceName,
        sourceUrl: destination.sourceUrl,
        sourceYear: destination.sourceYear,
        image: destination.images[0]?.imageUrl ?? existing?.image,
        accent: existing?.accent ?? ["#2E6C76", "#D9A640", "#566B37", "#B9572D"][index % 4],
      };
    });
  }, [publishedDestinations]);
  const visiblePlaces = useMemo(
    () => catalogPlaces.filter((place) => (category === "Todos" || place.category === category) && (region === "Todos" || place.region === region) && `${place.title} ${place.category} ${place.region} ${place.municipality}`.toLowerCase().includes(query.toLowerCase())),
    [catalogPlaces, category, query, region],
  );
  const availablePoles = useMemo(() => getAvailablePoles(catalogPlaces, category, query), [catalogPlaces, category, query]);
  const activePolePreview = polePreviewRegion ?? (region === "Todos" ? null : region as Region);
  const polePreview = useMemo(
    () => getPolePreview(catalogPlaces, activePolePreview, category, query),
    [activePolePreview, catalogPlaces, category, query],
  );
  const activeMapId = visiblePlaces.some((place) => place.id === mapFocus) ? mapFocus : visiblePlaces[0]?.id ?? null;
  const plan = itinerary.map((id) => catalogPlaces.find((place) => place.id === id)).filter((place): place is Place => Boolean(place));

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }

  function applyCategory(nextCategory: (typeof categories)[number]) {
    setCategory(nextCategory);
    setQuery("");
    const firstMatch = catalogPlaces.find((place) => (nextCategory === "Todos" || place.category === nextCategory) && (region === "Todos" || place.region === region));
    if (firstMatch) setMapFocus(firstMatch.id);
  }

  function applyRegion(nextRegion: (typeof regions)[number]) {
    setRegion(nextRegion);
    setQuery("");
    setPolePreviewRegion(nextRegion === "Todos" ? null : nextRegion as Region);
    const firstMatch = catalogPlaces.find((place) => (nextRegion === "Todos" || place.region === nextRegion) && (category === "Todos" || place.category === category));
    if (firstMatch) setMapFocus(firstMatch.id);
  }

  function previewPole(nextRegion: Region) {
    setPolePreviewRegion(nextRegion);
    const preview = getPolePreview(catalogPlaces, nextRegion, category, query);
    if (preview) setMapFocus(preview.id);
  }

  function clearPolePreview() {
    setPolePreviewRegion(region === "Todos" ? null : region as Region);
  }

  function toggleItinerary(place: Place) {
    setItinerary((current) => current.includes(place.id) ? current.filter((id) => id !== place.id) : [...current, place.id]);
    toast.success(itinerary.includes(place.id) ? `${place.title} removido do roteiro.` : `${place.title} entrou no roteiro.`);
  }

  function clearItinerary() {
    setItinerary([]);
    toast.message("Roteiro limpo.");
  }

  function showPlaceOnMap(place: Place) {
    setMapFocus(place.id);
    goTo("mapa");
  }

  function handleMapSelect(placeId: string) {
    const place = catalogPlaces.find((item) => item.id === placeId);
    if (!place) return;
    setMapFocus(placeId);
    setSelected(place);
  }

  function openPlaceFeedback(place: Place) {
    setFeedbackPlace(place);
  }

  return (
    <div className="home-shell min-h-screen bg-[#F5ECD8] text-[#2E3222] transition-colors duration-200">
      <header className="home-header sticky top-0 z-40 border-b border-[#3C482D]/10 bg-[#F5ECD8]/92 backdrop-blur-xl transition-colors duration-200">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => goTo("inicio")} className="tap flex items-center gap-3" aria-label="Ir ao início">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-[#B9572D] shadow-[0_6px_0_rgba(185,87,45,.16)]"><img src={markImage} alt="Marca Bora Piauí" className="h-9 w-9 object-contain" /></span>
            <span className="display-font text-[1.5rem] leading-none tracking-[-0.07em]">bora <span className="text-[#B9572D]">piauí</span></span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setPlannerOpen(true)} className="tap inline-flex h-10 items-center gap-2 rounded-full bg-[#3C482D] px-4 text-sm font-extrabold text-white"><Bookmark className="h-4 w-4" /><span className="hidden sm:inline">Meu roteiro</span><span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/18 px-1 text-[10px]">{plan.length}</span></button>
            <Link href="/feedback" aria-label="Enviar feedback" className="tap inline-flex h-10 items-center gap-2 rounded-full border border-[#B9572D]/40 bg-[#FFFDF6] px-3 text-sm font-extrabold text-[#B9572D] hover:bg-[#F3E5C9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2"><MessageSquare className="h-4 w-4" /><span className="hidden sm:inline">Feedback</span></Link>
            <button type="button" onClick={() => setMenuOpen((value) => !value)} className="tap grid h-10 w-10 place-items-center rounded-full border border-[#3C482D]/15 bg-[#F5ECD8]" aria-controls="home-navigation-menu" aria-expanded={menuOpen} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
        {menuOpen && <nav id="home-navigation-menu" aria-label="Navegação principal" className="border-t border-[#3C482D]/10 bg-[#F5ECD8] px-4 py-4 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-2 lg:grid-cols-3"><button onClick={() => goTo("explorar")} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Explorar destinos</button><Link href="/cidades/teresina" onClick={() => setMenuOpen(false)} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Cidades-piloto</Link><Link href="/patrimonios" onClick={() => setMenuOpen(false)} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Patrimônios</Link><Link href="/sabores" onClick={() => setMenuOpen(false)} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Sabores</Link><Link href="/agenda" onClick={() => setMenuOpen(false)} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Agenda cultural</Link><Link href="/dados" onClick={() => setMenuOpen(false)} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Dados oficiais</Link><button onClick={() => goTo("mapa")} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Mapa do estado</button><button onClick={() => goTo("como-funciona")} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Como funciona</button><Link href="/parceiros" onClick={() => setMenuOpen(false)} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold text-[#B9572D] hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Seja parceiro</Link><Link href="/admin/destinos" onClick={() => setMenuOpen(false)} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold text-[#566B37] hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Painel demonstrativo</Link><button onClick={() => { setPlannerOpen(true); setMenuOpen(false); }} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Meu roteiro</button></div></nav>}
        {menuOpen && <div className="home-theme-control border-t border-[#3C482D]/10 bg-[#F5ECD8] px-4 pb-4 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-xl bg-[#FFFDF6] px-3 py-3"><div><p className="text-sm font-extrabold">Modo escuro</p><p className="mt-0.5 text-xs text-[#68705C]">Use o tema que for mais confortável para você.</p></div><button type="button" role="switch" aria-checked={theme === "dark"} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} onClick={() => toggleTheme?.()} className="tap inline-flex h-10 items-center gap-2 rounded-full border border-[#3C482D]/15 bg-[#F5ECD8] px-3 text-xs font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2"><span>{theme === "dark" ? "Claro" : "Escuro"}</span>{theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}</button></div></div>}
      </header>

      <main id="inicio">
        <section className="relative overflow-hidden bg-[#3C482D] px-4 pb-10 pt-6 text-white sm:px-6 sm:pb-14 lg:px-8 lg:pt-8">
          <div className="mx-auto grid max-w-7xl items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 py-7 lg:pb-12 lg:pt-16">
              <div className="sun-chip inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em]"><Sparkles className="h-3.5 w-3.5" /> Atlas de percursos · Piauí</div>
              <h1 className="display-font mt-7 max-w-xl text-5xl leading-[0.92] tracking-[-0.065em] sm:text-6xl lg:text-7xl">Um estado inteiro de caminhos.</h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/78 sm:text-lg">Explore polos turísticos, compare referências públicas e use o mapa para transformar uma curiosidade em rota.</p>
              <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => goTo("explorar")} className="tap inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#cd6d45]">Escolher um percurso <ArrowRight className="h-4 w-4" /></button><button onClick={() => goTo("mapa")} className="tap inline-flex items-center gap-2 rounded-full border border-white/28 bg-white/8 px-5 py-3 text-sm font-extrabold text-white hover:bg-white/14">Abrir mapa <MapPinned className="h-4 w-4" /></button></div>
            </div>
            <div className="relative min-h-[340px] overflow-hidden rounded-[2.25rem] border border-white/18 bg-[#556B37] sm:min-h-[430px]"><img src={heroImage} alt="Ilustração editorial de uma paisagem do Piauí" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#2E3222]/75 via-transparent to-transparent" /><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-white/65">Do litoral à Caatinga</p><p className="mt-1 text-base font-bold">Nove âncoras para começar a explorar</p></div><span className="grid h-12 w-12 place-items-center rounded-full bg-[#FFFDF6] text-[#B9572D]"><MapPinned className="h-5 w-5" /></span></div></div>
          </div>
          <div className="route-line absolute bottom-0 left-0 h-[3px] w-full" />
        </section>

        <section id="cidades-mvp" className="scroll-mt-20 border-b border-[#3C482D]/10 bg-[#FFFDF6] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[.78fr_1.22fr] lg:items-end"><div><span className="stop-chip">MVP · três cidades-piloto</span><h2 className="display-font mt-4 text-4xl leading-none tracking-[-0.055em] sm:text-5xl">Escolha uma cidade e avance com contexto.</h2></div><p className="max-w-2xl text-sm leading-6 text-[#68705C]">Este recorte prepara a jornada pública por cidade. Atrações só aparecem com fonte; negócios entram quando houver curadoria e dados operacionais permitidos.</p></div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">{pilotCities.map((city, index) => { const itinerary = getPilotItinerary(city.slug); return <article key={city.slug} className="flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-[#3C482D]/13 bg-[#F5ECD8] p-5" style={{ background: `linear-gradient(155deg, ${city.accent}18, #FFFDF6 58%)` }}><div><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#3C482D] text-xs font-extrabold text-white">0{index + 1}</span><span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#566B37]">{city.eyebrow}</span></div><h3 className="display-font mt-8 text-3xl tracking-[-0.05em]">{city.name}</h3><p className="mt-3 text-sm leading-6 text-[#66705E]">{city.summary}</p></div><div className="mt-6"><p className="text-[11px] leading-5 text-[#66705E]">Fonte: <a href={city.source.url} target="_blank" rel="noopener noreferrer" className="font-bold underline decoration-[#566B37]/35 underline-offset-2">{city.source.name}</a></p><Link href={`/cidades/${city.slug}`} onClick={() => trackMvpEvent("search", { scope: "mvp_city_card", city: city.slug })} className="tap mt-4 inline-flex items-center gap-2 rounded-full bg-[#3C482D] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#566B37]">Explorar cidade <ArrowRight className="h-4 w-4" /></Link>{itinerary && <Link href={`/roteiros/${itinerary.slug}`} onClick={() => trackMvpEvent("add_to_itinerary", { itinerary: itinerary.slug, city: city.slug })} className="tap ml-3 inline-flex items-center gap-1 text-xs font-extrabold text-[#566B37] underline decoration-[#566B37]/35 underline-offset-4">Roteiro</Link>}</div></article>;})}</div>
          </div>
        </section>

        <section id="explorar" className="scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><span className="stop-chip">Parada 01 · escolha o território</span><h2 className="display-font mt-4 max-w-3xl text-4xl leading-none tracking-[-0.05em] sm:text-5xl">Comece pelo polo. Siga pelo que faz sentido para você.</h2></div><button onClick={() => goTo("mapa")} className="tap inline-flex items-center gap-2 self-start rounded-full bg-[#B9572D] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#cd6d45]"><MapPinned className="h-4 w-4" /> Abrir mapa estadual</button></div>
            <div className="mt-9 border-y border-[#3C482D]/12 bg-[#FFFDF6] px-4 py-5 sm:px-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div><div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#566B37]"><Compass className="h-4 w-4" /> Refine o percurso</div><p className="mt-2 text-sm leading-6 text-[#68705C]">{visiblePlaces.length} {visiblePlaces.length === 1 ? "destino disponível" : "destinos disponíveis"} neste recorte editorial.</p></div>
                {(region !== "Todos" || category !== "Todos" || query) && <button onClick={() => { setCategory("Todos"); setRegion("Todos"); setQuery(""); }} className="tap self-start text-xs font-extrabold text-[#B9572D] underline decoration-[#B9572D]/35 underline-offset-4 hover:text-[#8C3D20] sm:self-auto">Limpar seleção</button>}
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(220px,1.15fr)]">
                <label className="block"><span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#68705C]">Polo turístico</span><select value={region} onChange={(event) => applyRegion(event.target.value as (typeof regions)[number])} className="mt-2 h-11 w-full rounded-full border border-[#3C482D]/14 bg-[#F5ECD8] px-4 text-sm font-bold text-[#35402B] outline-none focus:border-[#B9572D] focus:ring-2 focus:ring-[#B9572D]/15"><option value="Todos">Todo o estado</option>{regions.slice(1).map((item) => <option key={item} value={item}>{item.replace("Polo ", "")}</option>)}</select></label>
                <label className="block"><span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#68705C]">Interesse principal</span><select value={category} onChange={(event) => applyCategory(event.target.value as (typeof categories)[number])} className="mt-2 h-11 w-full rounded-full border border-[#3C482D]/14 bg-[#F5ECD8] px-4 text-sm font-bold text-[#35402B] outline-none focus:border-[#B9572D] focus:ring-2 focus:ring-[#B9572D]/15"><option value="Todos">Todos os interesses</option>{categories.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                <label className="block"><span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#68705C]">Buscar no atlas</span><span className="mt-2 flex h-11 items-center gap-2 rounded-full border border-[#3C482D]/14 bg-[#F5ECD8] px-4 text-[#6B7057] focus-within:border-[#B9572D] focus-within:ring-2 focus-within:ring-[#B9572D]/15"><Search className="h-4 w-4 shrink-0" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Destino ou município" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#9A9B84]" /></span></label>
              </div>
              <div className="mt-5 border-t border-[#3C482D]/10 pt-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#68705C]">Polos disponíveis</p><p className="text-xs text-[#68705C]">Passe o mouse ou use Tab para antecipar uma parada.</p></div><div className="mt-3 flex flex-wrap gap-2" aria-label="Acessos rápidos por polo turístico">{availablePoles.map(({ region: item, total }) => <button key={item} type="button" onClick={() => applyRegion(item)} onMouseEnter={() => previewPole(item)} onMouseLeave={clearPolePreview} onFocus={() => previewPole(item)} onBlur={clearPolePreview} aria-pressed={region === item} aria-describedby="contexto-do-polo" className={`tap group inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-left text-xs font-extrabold transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF6] active:translate-y-0 active:scale-[0.98] ${region === item ? "border-[#B9572D] bg-[#B9572D] text-white shadow-[0_5px_14px_rgba(185,87,45,.22)]" : "border-[#3C482D]/12 bg-[#F5ECD8]/75 text-[#566B37] hover:-translate-y-0.5 hover:border-[#B9572D]/45 hover:bg-[#FFFDF6] hover:text-[#B9572D] hover:shadow-[0_7px_16px_rgba(59,72,45,.10)]"}`}><span className={`h-1.5 w-1.5 rounded-full transition-transform duration-200 group-hover:scale-125 ${region === item ? "bg-[#D9A640]" : "bg-[#B9572D]/70"}`} aria-hidden="true" />{item.replace("Polo ", "")} <span className={`text-[10px] ${region === item ? "text-white/75" : "text-[#8A8D79] group-hover:text-[#B9572D]/75"}`}>{total}</span></button>)}</div><div key={polePreview?.id ?? "preview-vazia"} id="contexto-do-polo" className="pole-preview-enter mt-4 grid gap-3 border-t border-[#3C482D]/10 pt-4 sm:grid-cols-[minmax(0,1fr)_172px] sm:items-stretch" aria-live="polite">{polePreview ? <><div className="flex min-w-0 flex-col justify-center"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B9572D]">Contexto do polo · {polePreview.region}</p><p className="mt-1 text-sm font-extrabold text-[#35402B]">{polePreview.title} <span className="font-semibold text-[#70745F]">· {polePreview.municipality}</span></p><p className="mt-1 max-w-xl text-xs leading-5 text-[#68705C]">{polePreview.text}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#566B37]">Prévia sincronizada com o marcador do mapa</p></div><div className="relative min-h-[104px] overflow-hidden rounded-[1.15rem] border border-[#3C482D]/12 bg-[#E9DCC0]">{polePreview.image ? <img src={polePreview.image} alt={`Prévia de ${polePreview.title}`} className="h-full w-full object-cover" /> : <div className="map-tile h-full"><span>{polePreview.region.toUpperCase()}</span></div>}<span className="absolute bottom-2 left-2 rounded-full bg-[#FFFDF6]/90 px-2 py-1 text-[9px] font-extrabold text-[#35402B]">{polePreview.category}</span></div></> : <div className="sm:col-span-2 flex items-center gap-3 text-xs leading-5 text-[#68705C]"><Compass className="h-4 w-4 shrink-0 text-[#B9572D]" /><span>Passe o mouse ou avance com Tab sobre um polo para ver uma parada de referência antes de aplicar o filtro.</span></div>}</div></div>
              <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#6A715D]"><Info className="mt-0.5 h-4 w-4 shrink-0 text-[#B9572D]" /><span>Seleção de destinos prioritários do protótipo, organizada pelos polos do Observatório. Não representa ranking de visitação.</span></div>
            </div>
            <div className="discovery-route mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{visiblePlaces.map((place, index) => <article key={place.id} className={`route-card place-card flex min-h-[315px] flex-col overflow-hidden rounded-[1.75rem] border border-[#3C482D]/12 bg-[#FFFDF6] shadow-[0_12px_32px_rgba(59,70,42,.06)] ${index === 0 ? "md:col-span-2 xl:row-span-2 xl:min-h-[640px]" : index === 4 ? "xl:col-span-2" : ""}`}><div className={`relative overflow-hidden ${index === 0 ? "h-44 xl:h-72" : "h-32"}`} style={{ backgroundColor: `${place.accent}18` }}>{place.image ? <img src={place.image} alt={place.id === "encontro-dos-rios" ? "Vista aérea do Encontro dos Rios, em Teresina" : `Ilustração editorial para ${place.title}`} className="place-image h-full w-full object-cover" /> : <div className="map-tile"><span>{place.region.toUpperCase()} · PARADA {index + 1}</span></div>}<span className="absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[#B9572D] text-xs font-extrabold text-white shadow-sm">{String(index + 1).padStart(2, "0")}</span>{place.id === "encontro-dos-rios" && <span className="absolute bottom-3 right-3 rounded-full bg-[#2E3222]/72 px-2 py-1 text-[9px] font-bold text-white/90">Mapa da Cultura PI</span>}</div><div className="flex flex-1 flex-col p-5"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B9572D]">{place.region} · {place.category}</p><h3 className="display-font mt-2 text-3xl leading-[0.95] tracking-[-0.045em]">{place.title}</h3><p className="mt-1 text-xs font-bold text-[#70745F]">{place.municipality}</p><p className="mt-3 text-sm leading-6 text-[#66705E]">{place.text}</p><div className="mt-auto flex flex-wrap gap-2 pt-5"><button onClick={() => showPlaceOnMap(place)} className="tap inline-flex items-center gap-1.5 rounded-full bg-[#B9572D] px-3 py-2 text-xs font-extrabold text-white hover:bg-[#cd6d45]"><MapPinned className="h-3.5 w-3.5" /> Ver no mapa</button><Link href={`/destinos/${place.id}`} className="tap rounded-full border border-[#3C482D]/15 px-3 py-2 text-xs font-extrabold">Detalhes</Link><button type="button" onClick={() => openPlaceFeedback(place)} aria-label={`Enviar feedback sobre ${place.title}`} className="tap inline-flex items-center gap-1.5 rounded-full border border-[#B9572D]/35 px-3 py-2 text-xs font-extrabold text-[#B9572D] hover:bg-[#F3E5C9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2"><MessageSquare className="h-3.5 w-3.5" aria-hidden="true" /> Feedback</button></div><span className="route-connector" aria-hidden="true" /></div></article>)}</div>
            {visiblePlaces.length === 0 && <div className="mt-8 rounded-[1.5rem] border border-dashed border-[#3C482D]/20 p-10 text-center"><SlidersHorizontal className="mx-auto h-7 w-7 text-[#B9572D]" /><p className="mt-3 font-bold">Nenhum destino encontrado nesse recorte.</p><button onClick={() => { setCategory("Todos"); setRegion("Todos"); setQuery(""); }} className="mt-4 text-sm font-extrabold text-[#566B37]">Limpar filtros</button></div>}
          </div>
        </section>

        <section id="dados" className="atlas-data scroll-mt-20 bg-[#E9DCC0] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end"><div><span className="stop-chip !bg-[#566B37] !text-white before:!bg-[#D9A640]">Parada 02 · contexto</span><h2 className="display-font mt-4 text-5xl leading-[0.92] tracking-[-0.055em] text-[#303722]">Antes de abrir a rota, veja a escala.</h2><p className="mt-5 max-w-md text-base leading-7 text-[#586049]">O Piauí ocupa 251.755,499 km² e tem 3.271.199 pessoas segundo o Censo 2022. A escala territorial ajuda a escolher percursos realistas.</p><p className="mt-4 text-xs leading-5 text-[#68705C]">{sourceAnchor(ibgeUrl, "Fonte: IBGE · Piauí")} · área territorial 2025 e Censo Demográfico 2022.</p></div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-[1.5rem] bg-[#3C482D] p-5 text-white"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#D9A640]">Território</p><p className="display-font mt-5 text-4xl tracking-[-0.06em]">251,8 mil</p><p className="mt-1 text-sm text-white/70">km² · IBGE 2025</p></div><div className="rounded-[1.5rem] bg-[#FFFDF6] p-5"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B9572D]">População</p><p className="display-font mt-5 text-4xl tracking-[-0.06em]">3,27 mi</p><p className="mt-1 text-sm text-[#68705C]">Censo IBGE 2022</p></div><div className="rounded-[1.5rem] bg-[#D9A640] p-5 text-[#303722]"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">Oferta formal</p><p className="display-font mt-5 text-4xl tracking-[-0.06em]">1.699</p><p className="mt-1 text-sm text-[#303722]/70">Cadastur · 2025</p></div></div></div>
          <div className="mt-9 grid gap-5 lg:grid-cols-2"><article className="min-h-[360px] rounded-[1.75rem] border border-[#3C482D]/10 bg-[#FFFDF6] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[#B9572D]"><ChartNoAxesColumnIncreasing className="h-4 w-4" /><p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">Oferta turística</p></div><h3 className="display-font mt-3 text-3xl tracking-[-0.05em]">Cadastur em cinco recortes</h3></div><span className="rounded-full bg-[#F5ECD8] px-3 py-2 text-[10px] font-extrabold text-[#566B37]">2025</span></div><ChartContainer config={supplyChartConfig} className="mt-5 h-[220px] w-full aspect-auto"><BarChart data={supplyData} layout="vertical" margin={{ left: 8, right: 18 }}><CartesianGrid horizontal={false} stroke="#E8DFC9" /><XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(value) => format.format(value)} /><YAxis type="category" dataKey="name" width={88} tickLine={false} axisLine={false} tick={{ fill: "#66705E", fontSize: 11 }} /><ChartTooltip cursor={{ fill: "#F5ECD8" }} content={<ChartTooltipContent hideLabel />} /><Bar dataKey="total" fill="var(--color-total)" radius={[0, 8, 8, 0]} /></BarChart></ChartContainer><p className="mt-4 text-xs leading-5 text-[#68705C]">Recorte de cinco categorias dentre 1.699 empreendimentos com Cadastur. {sourceAnchor(observatoryUrl, "Fonte: Observatório de Inteligência Turística do Piauí · Cadastur 2025")}.</p></article>
            <article className="min-h-[360px] rounded-[1.75rem] border border-[#3C482D]/10 bg-[#3C482D] p-5 text-white sm:p-7"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[#D9A640]"><TreePine className="h-4 w-4" /><p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">Escala ambiental</p></div><h3 className="display-font mt-3 text-3xl tracking-[-0.05em]">Áreas protegidas selecionadas</h3></div><span className="rounded-full bg-white/10 px-3 py-2 text-[10px] font-extrabold text-white/85">hectares</span></div><ChartContainer config={areaChartConfig} className="mt-5 h-[220px] w-full aspect-auto"><BarChart data={protectedAreaData} layout="vertical" margin={{ left: 8, right: 18 }}><CartesianGrid horizontal={false} stroke="rgba(255,255,255,.13)" /><XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,.55)", fontSize: 10 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} /><YAxis type="category" dataKey="name" width={115} tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,.78)", fontSize: 11 }} /><ChartTooltip cursor={{ fill: "rgba(255,255,255,.08)" }} content={<ChartTooltipContent hideLabel />} /><Bar dataKey="area" fill="var(--color-area)" radius={[0, 8, 8, 0]} /></BarChart></ChartContainer><p className="mt-4 text-xs leading-5 text-white/65">Áreas oficiais do Parque Nacional Serra das Confusões, APA Delta do Parnaíba e Parque Nacional de Sete Cidades. {sourceAnchor(confusoesUrl, "ICMBio")} · {sourceAnchor(deltaSourceUrl, "ICMBio")} · {sourceAnchor(seteCidadesUrl, "ICMBio")}.</p></article></div>
          <div className="mt-5 flex flex-col gap-4 rounded-[1.75rem] border border-[#B9572D]/20 bg-[#FFFDF6] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F5ECD8] text-[#B9572D]"><Landmark className="h-5 w-5" /></span><div><p className="font-extrabold">Serra da Capivara: 39.614 visitas registradas em 2024</p><p className="mt-1 text-sm leading-6 text-[#67705E]">Indicador de contexto de visitação em uma unidade de conservação; não é estimativa para 2026 nem comparação entre destinos.</p></div></div><a href={capivaraVisitUrl} target="_blank" rel="noopener noreferrer" className="tap inline-flex shrink-0 items-center gap-2 rounded-full bg-[#B9572D] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#cd6d45]">Ver fonte <ExternalLink className="h-4 w-4" /></a></div>
        </div></section>

        <section id="mapa" className="atlas-map-section scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end"><div><span className="stop-chip">Parada 03 · localize</span><h2 className="display-font mt-4 text-5xl leading-[0.92] tracking-[-0.055em]">Seu roteiro ganha território no mapa.</h2><p className="mt-5 max-w-md text-base leading-7 text-[#586049]">Os filtros da descoberta também reorganizam os marcadores. Escolha um polo, aproxime-se de uma parada e só então abra uma rota externa.</p><div className="mt-7"><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#566B37]">Destinos neste recorte</p><div className="mt-3 flex flex-wrap gap-2">{visiblePlaces.map((place, index) => <button key={place.id} onClick={() => setMapFocus(place.id)} className={`tap inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold ${activeMapId === place.id ? "border-[#B9572D] bg-[#B9572D] text-white" : "border-[#3C482D]/15 bg-[#FFFDF6] text-[#3C482D]"}`}><span className="grid h-4 w-4 place-items-center rounded-full bg-current/15 text-[9px]">{index + 1}</span>{place.title}</button>)}</div></div></div><PiauiMap places={visiblePlaces} activePlaceId={activeMapId} onSelect={handleMapSelect} /></div></div></section>

        <section id="como-funciona" className="bg-[#3C482D] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr]"><div><span className="stop-chip !bg-[#B9572D] !text-white before:!bg-white">Parada 04 · planeje</span><h2 className="display-font mt-4 text-5xl leading-[0.94] tracking-[-0.055em]">Menos catálogo. Mais percurso.</h2><p className="mt-5 max-w-md text-base leading-7 text-white/72">O protótipo apresenta uma curadoria inicial, dados verificáveis e ações que deixam a confirmação operacional para os canais responsáveis.</p></div><div className="grid gap-3 sm:grid-cols-3">{[{ n: "01", icon: Compass, title: "Encontre", text: "Escolha polo e tema antes de comparar as paradas." }, { n: "02", icon: Waves, title: "Contextualize", text: "Use dados e fontes para dimensionar o território." }, { n: "03", icon: Check, title: "Siga", text: "Monte um roteiro e confirme a visita antes de sair." }].map((item) => <div key={item.n} className="rounded-[1.5rem] border border-white/12 bg-white/7 p-5"><item.icon className="h-5 w-5 text-[#D9A640]" /><p className="mt-5 text-xs font-extrabold tracking-[0.15em] text-[#D9A640]">{item.n}</p><h3 className="mt-2 text-lg font-extrabold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{item.text}</p></div>)}</div></div></section>
      </main>

      {selected && <div onClick={event => { if (event.target === event.currentTarget) setSelected(null); }} className="fixed inset-0 z-50 flex items-end bg-[#26301f]/55 p-0 backdrop-blur-[2px] sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Detalhes de ${selected.title}`}><div className="w-full max-w-xl overflow-hidden rounded-t-[2rem] bg-[#FFFDF6] sm:rounded-[2rem]"><div className="flex items-center justify-between p-5 sm:p-6"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em]" style={{ color: selected.accent }}>{selected.region} · {selected.category}</p><h2 className="display-font mt-2 text-3xl tracking-[-0.05em]">{selected.title}</h2><p className="mt-1 text-sm font-bold text-[#70745F]">{selected.municipality}</p></div><button onClick={() => setSelected(null)} className="tap grid h-10 w-10 place-items-center rounded-full bg-[#E9DCC0]" aria-label="Fechar detalhes"><X className="h-5 w-5" /></button></div><div className="px-5 pb-6 sm:px-6 sm:pb-7">{selected.image && <img src={selected.image} alt="" className="mb-5 h-44 w-full rounded-[1.25rem] object-cover" />}<p className="text-base leading-7 text-[#586049]">{selected.detail}</p><p className="mt-4 text-xs leading-5 text-[#85846F]">Referência: {sourceAnchor(selected.sourceUrl, selected.sourceName)} · {selected.sourceYear}. Confirme regras, operação e condições de visita antes de sair.</p><div className="mt-6 grid gap-3 sm:grid-cols-4"><button onClick={() => showPlaceOnMap(selected)} className="tap inline-flex items-center justify-center gap-2 rounded-full bg-[#E9DCC0] px-4 py-3 text-sm font-extrabold text-[#3C482D]"><MapPinned className="h-4 w-4" /> Mapa</button><button onClick={() => toggleItinerary(selected)} className="tap inline-flex justify-center gap-2 rounded-full bg-[#3C482D] px-4 py-3 text-sm font-extrabold text-white">{itinerary.includes(selected.id) ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{itinerary.includes(selected.id) ? "Remover" : "Roteiro"}</button><a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer" className="tap inline-flex justify-center gap-2 rounded-full border border-[#3C482D]/15 px-4 py-3 text-sm font-extrabold">Fonte <ExternalLink className="h-4 w-4" /></a><a href={selected.route} target="_blank" rel="noopener noreferrer" className="tap inline-flex justify-center gap-2 rounded-full bg-[#B9572D] px-4 py-3 text-sm font-extrabold text-white">Rota <ExternalLink className="h-4 w-4" /></a></div></div></div></div>}
      {feedbackPlace && <div onClick={event => { if (event.target === event.currentTarget) setFeedbackPlace(null); }} className="fixed inset-0 z-[55] flex items-end bg-[#26301f]/55 p-0 backdrop-blur-[2px] sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Enviar feedback sobre ${feedbackPlace.title}`}><form onSubmit={event => { event.preventDefault(); toast.success(`Feedback sobre ${feedbackPlace.title} registrado para esta demonstração.`); setFeedbackPlace(null); }} className="w-full max-w-lg rounded-t-[2rem] bg-[#FFFDF6] p-5 sm:rounded-[2rem] sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#B9572D]">Feedback contextual</p><h2 className="display-font mt-2 text-3xl tracking-[-0.05em]">Sobre {feedbackPlace.title}</h2><p className="mt-2 text-sm leading-6 text-[#68705C]">Conte o que ajudaria a tornar esta parada mais clara para você.</p></div><button type="button" onClick={() => setFeedbackPlace(null)} className="tap grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E9DCC0]" aria-label="Fechar janela de feedback"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-4"><label className="block"><span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#566B37]">Tipo de feedback</span><select name="feedbackType" required defaultValue="" className="mt-2 h-11 w-full rounded-full border border-[#3C482D]/14 bg-[#F5ECD8] px-4 text-sm font-bold text-[#35402B] outline-none focus:border-[#B9572D] focus:ring-2 focus:ring-[#B9572D]/15"><option value="" disabled>Selecione uma opção</option><option value="clareza">Algo ficou pouco claro</option><option value="fonte">Quero conferir uma fonte</option><option value="acesso">Tenho uma dúvida sobre acesso</option><option value="ideia">Tenho uma sugestão</option></select></label><label className="block"><span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#566B37]">Sua mensagem</span><textarea name="feedbackMessage" required minLength={10} rows={4} placeholder="Escreva pelo menos 10 caracteres" className="mt-2 w-full resize-y rounded-[1.25rem] border border-[#3C482D]/14 bg-[#F5ECD8] px-4 py-3 text-sm leading-6 text-[#35402B] outline-none placeholder:text-[#929781] focus:border-[#B9572D] focus:ring-2 focus:ring-[#B9572D]/15" /></label><p className="text-xs leading-5 text-[#85846F]">Não informe nome, telefone, e-mail ou outros dados pessoais. Este envio é demonstrativo e não é armazenado.</p></div><div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => setFeedbackPlace(null)} className="tap rounded-full border border-[#3C482D]/15 px-4 py-2.5 text-sm font-extrabold text-[#566B37]">Cancelar</button><button type="submit" className="tap inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#CD6D45]"><MessageSquare className="h-4 w-4" /> Enviar feedback</button></div></form></div>}

      {plannerOpen && <div onClick={event => { if (event.target === event.currentTarget) setPlannerOpen(false); }} className="fixed inset-0 z-50 flex justify-end bg-[#26301f]/45 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label="Meu roteiro"><div className="flex h-full w-full max-w-md flex-col bg-[#FFFDF6] shadow-2xl"><div className="flex items-center justify-between border-b border-[#3C482D]/10 p-5"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#B9572D]">Meu roteiro</p><h2 className="display-font mt-1 text-3xl tracking-[-0.05em]">Meu Piauí, por etapas</h2></div><button onClick={() => setPlannerOpen(false)} className="tap grid h-10 w-10 place-items-center rounded-full bg-[#E9DCC0]" aria-label="Fechar roteiro"><X className="h-5 w-5" /></button></div><div className="flex-1 overflow-y-auto p-5"><div className="rounded-[1.5rem] bg-[#566B37] p-5 text-white"><p className="text-sm font-bold">{plan.length ? `${plan.length} parada${plan.length > 1 ? "s" : ""} escolhida${plan.length > 1 ? "s" : ""}` : "Seu roteiro está vazio"}</p><p className="mt-1 text-sm leading-6 text-white/72">Monte um ponto de partida. Distâncias, operação e melhor ordem devem ser confirmadas antes da viagem.</p></div>{plan.length ? <ol className="mt-6 space-y-3">{plan.map((place, index) => <li key={place.id} className="flex gap-3 rounded-[1.25rem] border border-[#3C482D]/10 bg-white p-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#B9572D] text-xs font-extrabold text-white">{index + 1}</span><div className="min-w-0 flex-1"><p className="font-extrabold">{place.title}</p><p className="mt-0.5 text-xs font-bold text-[#70745F]">{place.region} · {place.municipality}</p></div><button onClick={() => toggleItinerary(place)} className="tap grid h-8 w-8 place-items-center rounded-full bg-[#E9DCC0]" aria-label={`Remover ${place.title}`}><Minus className="h-4 w-4" /></button></li>)}</ol> : <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#3C482D]/18 p-8 text-center"><Compass className="mx-auto h-7 w-7 text-[#B9572D]" /><p className="mt-3 text-sm font-bold">Escolha uma primeira parada para começar.</p></div>}</div><div className="border-t border-[#3C482D]/10 p-5"><div className="flex gap-3"><button onClick={() => goTo("explorar")} className="tap flex-1 rounded-full bg-[#3C482D] px-4 py-3 text-sm font-extrabold text-white">Explorar</button><button onClick={clearItinerary} disabled={!plan.length} className="tap rounded-full border border-[#3C482D]/15 px-4 py-3 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-35">Limpar</button></div></div></div></div>}

      <footer className="border-t border-[#3C482D]/10 px-4 py-8 text-xs text-[#747860] sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row"><p>Bora Piauí · Protótipo navegável estadual.</p><p>Dados e referências: {sourceAnchor(observatoryUrl, "Observatório de Turismo")} · {sourceAnchor(ibgeUrl, "IBGE")} · ICMBio e UNESCO · consulta em 20 ago. 2026.</p></div></footer>
    </div>
  );
}
