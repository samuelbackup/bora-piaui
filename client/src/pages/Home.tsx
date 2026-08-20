/* Cerrado e Rios — Atlas de Percursos: atlas editorial, filtros territoriais e dados públicos; barro queimado é a única cor de ação. */
import { useMemo, useState } from "react";
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
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  TreePine,
  Waves,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PiauiMap } from "@/components/PiauiMap";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const heroImage = "/manus-storage/bora-piaui-atlas-hero_eff0e2e7.jpg";
const deltaImage = "/manus-storage/bora-piaui-delta-editorial_93dc13d8.jpg";
const caatingaImage = "/manus-storage/bora-piaui-caatinga-editorial_d17c3e5a.jpg";
const markImage = "/manus-storage/bora-piaui-sun-river-mark_032a7fc1.png";
const observatoryUrl = "https://observatorioturismo.pi.gov.br/turismo_numeros/";
const ibgeUrl = "https://www.ibge.gov.br/cidades-e-estados/pi.html";
const deltaSourceUrl = "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/marinho/lista-de-ucs/apa-delta-do-parnaiba/informacoes-sobre-visitacao-apa-delta-do-parnaiba";
const seteCidadesUrl = "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/caatinga/lista-de-ucs/parna-de-sete-cidades";
const confusoesUrl = "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/caatinga/lista-de-ucs/parna-da-serra-das-confusoes";
const capivaraUrl = "https://whc.unesco.org/en/list/606/";
const capivaraVisitUrl = "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/caatinga/lista-de-ucs/parna-da-serra-da-capivara/arquivos/p5_pup_serracapivara_final_vf_junho_2026__4_.pdf";
const pedroiiUrl = "http://pedroii.pi.gov.br/noticias/festival-de-inverno/pedro-ii-promove-ecoturismo-com-trilhas-cachoeiras-e-acao-ambiental-durante-o-festival-de-inverno-311";
const oeirasUrl = "https://oeiras.pi.gov.br/oeiras";
const teresinaUrl = "https://visitbrasil.com/en/location/teresina/";

type Category = "Natureza" | "Patrimônio" | "Litoral" | "Cultura" | "Cidade";
type Region = "Polo Teresina" | "Aventura e Mistério" | "Costa do Delta" | "Águas" | "Nascentes" | "Origens" | "Histórico Cultural";

type Place = {
  id: string;
  title: string;
  category: Category;
  region: Region;
  municipality: string;
  text: string;
  detail: string;
  route: string;
  mapQuery: string;
  sourceName: string;
  sourceUrl: string;
  sourceYear: string;
  image?: string;
  accent: string;
};

const places: Place[] = [
  {
    id: "delta",
    title: "Delta do Parnaíba",
    category: "Litoral",
    region: "Costa do Delta",
    municipality: "Ilha Grande",
    text: "Canais, mangues e dunas onde o rio chega ao Atlântico.",
    detail: "A APA Delta do Parnaíba percorre todo o litoral piauiense. O ICMBio destaca os canais, manguezais e os passeios com saída pelo Porto dos Tatus como referências de visitação no território.",
    route: "https://www.google.com/maps/dir/?api=1&destination=Porto%20dos%20Tatus%2C%20Ilha%20Grande%2C%20PI",
    mapQuery: "Porto dos Tatus, Ilha Grande",
    sourceName: "ICMBio · APA Delta do Parnaíba",
    sourceUrl: deltaSourceUrl,
    sourceYear: "consulta 2026",
    image: deltaImage,
    accent: "#2E6C76",
  },
  {
    id: "barra-grande",
    title: "Barra Grande",
    category: "Litoral",
    region: "Costa do Delta",
    municipality: "Cajueiro da Praia",
    text: "Mar, mangue e percursos guiados pelo ritmo da maré.",
    detail: "No município de Cajueiro da Praia, o ICMBio descreve experiências de observação de fauna em estuários e passeios que dependem das condições de maré. Confirme condução e horários antes de sair.",
    route: "https://www.google.com/maps/dir/?api=1&destination=Barra%20Grande%2C%20Cajueiro%20da%20Praia%2C%20PI",
    mapQuery: "Barra Grande, Cajueiro da Praia",
    sourceName: "ICMBio · APA Delta do Parnaíba",
    sourceUrl: deltaSourceUrl,
    sourceYear: "consulta 2026",
    accent: "#D9A640",
  },
  {
    id: "sete-cidades",
    title: "Parque Nacional de Sete Cidades",
    category: "Natureza",
    region: "Aventura e Mistério",
    municipality: "Piracuruca e Brasileira",
    text: "Formações rochosas em uma unidade de conservação de Caatinga.",
    detail: "Criado em 1961, o Parque Nacional de Sete Cidades protege 6.303,64 hectares de Caatinga. Este ponto representa o recorte de paisagem e aventura no norte do estado.",
    route: "https://www.google.com/maps/dir/?api=1&destination=Parque%20Nacional%20de%20Sete%20Cidades%2C%20PI",
    mapQuery: "Parque Nacional de Sete Cidades, Piracuruca",
    sourceName: "ICMBio · Parque Nacional de Sete Cidades",
    sourceUrl: seteCidadesUrl,
    sourceYear: "consulta 2026",
    accent: "#566B37",
  },
  {
    id: "pedro-ii",
    title: "Serra dos Matões",
    category: "Natureza",
    region: "Aventura e Mistério",
    municipality: "Pedro II",
    text: "Trilhas e cachoeiras em um recorte serrano do Piauí.",
    detail: "A Prefeitura de Pedro II incluiu trilha e visita à Cachoeira do Salto Liso em uma ação de ecoturismo durante o Festival de Inverno de 2025. Programações e condições variam; consulte o canal local.",
    route: "https://www.google.com/maps/dir/?api=1&destination=Serra%20dos%20Matoes%2C%20Pedro%20II%2C%20PI",
    mapQuery: "Serra dos Matões, Pedro II",
    sourceName: "Prefeitura de Pedro II",
    sourceUrl: pedroiiUrl,
    sourceYear: "2025",
    accent: "#6B8B5A",
  },
  {
    id: "urubu",
    title: "Cachoeira do Urubu",
    category: "Natureza",
    region: "Águas",
    municipality: "Esperantina",
    text: "Uma parada de rio no recorte do Polo das Águas.",
    detail: "A experiência de água entra no protótipo como referência de deslocamento entre municípios do Polo das Águas. O planejamento da visita precisa ser confirmado com a gestão local e canais oficiais.",
    route: "https://www.google.com/maps/dir/?api=1&destination=Cachoeira%20do%20Urubu%2C%20Esperantina%2C%20PI",
    mapQuery: "Cachoeira do Urubu, Esperantina",
    sourceName: "Observatório de Inteligência Turística do Piauí",
    sourceUrl: observatoryUrl,
    sourceYear: "consulta 2026",
    accent: "#3F7E8C",
  },
  {
    id: "confusoes",
    title: "Parque Nacional da Serra das Confusões",
    category: "Natureza",
    region: "Nascentes",
    municipality: "Caracol",
    text: "Grande extensão de Caatinga no sul do estado.",
    detail: "Em Caracol, o Parque Nacional da Serra das Confusões é uma unidade de conservação de Caatinga com 823.854,54 hectares. A visita requer planejamento atento às regras e à operação local.",
    route: "https://www.google.com/maps/dir/?api=1&destination=Parque%20Nacional%20da%20Serra%20das%20Confusoes%2C%20Caracol%2C%20PI",
    mapQuery: "Parque Nacional da Serra das Confusões, Caracol",
    sourceName: "ICMBio · Serra das Confusões",
    sourceUrl: confusoesUrl,
    sourceYear: "consulta 2026",
    image: caatingaImage,
    accent: "#3C482D",
  },
  {
    id: "capivara",
    title: "Parque Nacional Serra da Capivara",
    category: "Patrimônio",
    region: "Origens",
    municipality: "São Raimundo Nonato",
    text: "Arqueologia, paisagem e um Patrimônio Mundial no sudeste do Piauí.",
    detail: "Reconhecido pela UNESCO como Patrimônio Mundial, o parque reúne centenas de sítios arqueológicos. O Plano de Uso Público do ICMBio registra 39.614 visitas em 2024; use esse dado como contexto, não como previsão de visitação.",
    route: "https://www.google.com/maps/dir/?api=1&destination=Parque%20Nacional%20Serra%20da%20Capivara%2C%20Sao%20Raimundo%20Nonato%2C%20PI",
    mapQuery: "Parque Nacional Serra da Capivara, São Raimundo Nonato",
    sourceName: "UNESCO e ICMBio",
    sourceUrl: capivaraUrl,
    sourceYear: "visitação 2024",
    accent: "#B9572D",
  },
  {
    id: "oeiras",
    title: "Oeiras",
    category: "Cultura",
    region: "Histórico Cultural",
    municipality: "Oeiras",
    text: "Uma parada para percorrer a memória histórica do Piauí.",
    detail: "Oeiras organiza o recorte histórico-cultural do atlas. Em vez de presumir programação ou serviços, o protótipo direciona a confirmação da visita aos canais institucionais do município.",
    route: "https://www.google.com/maps/dir/?api=1&destination=Centro%20Historico%20de%20Oeiras%2C%20Oeiras%2C%20PI",
    mapQuery: "Centro Histórico de Oeiras, Oeiras",
    sourceName: "Prefeitura Municipal de Oeiras",
    sourceUrl: oeirasUrl,
    sourceYear: "consulta 2026",
    accent: "#A86D32",
  },
  {
    id: "teresina",
    title: "Encontro dos Rios",
    category: "Cidade",
    region: "Polo Teresina",
    municipality: "Teresina",
    text: "Uma porta de entrada urbana entre o Poti e o Parnaíba.",
    detail: "O encontro dos rios mantém Teresina como ponto de partida do atlas: um recorte urbano para conectar a capital aos demais percursos do estado.",
    route: "https://www.google.com/maps/dir/?api=1&destination=Parque%20Ambiental%20Encontro%20dos%20Rios%2C%20Teresina%2C%20PI",
    mapQuery: "Parque Ambiental Encontro dos Rios, Teresina",
    sourceName: "Visit Brasil · Teresina",
    sourceUrl: teresinaUrl,
    sourceYear: "consulta 2026",
    accent: "#2E6C76",
  },
];

const categories = ["Todos", "Natureza", "Patrimônio", "Litoral", "Cultura", "Cidade"] as const;
const regions = ["Todos", "Polo Teresina", "Aventura e Mistério", "Costa do Delta", "Águas", "Nascentes", "Origens", "Histórico Cultural"] as const;
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
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const [region, setRegion] = useState<(typeof regions)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [itinerary, setItinerary] = useState<string[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [mapFocus, setMapFocus] = useState<string | null>("delta");
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const visiblePlaces = useMemo(
    () => places.filter((place) => (category === "Todos" || place.category === category) && (region === "Todos" || place.region === region) && `${place.title} ${place.category} ${place.region} ${place.municipality}`.toLowerCase().includes(query.toLowerCase())),
    [category, query, region],
  );
  const activeMapId = visiblePlaces.some((place) => place.id === mapFocus) ? mapFocus : visiblePlaces[0]?.id ?? null;
  const plan = itinerary.map((id) => places.find((place) => place.id === id)).filter((place): place is Place => Boolean(place));

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }

  function applyCategory(nextCategory: (typeof categories)[number]) {
    setCategory(nextCategory);
    setQuery("");
    const firstMatch = places.find((place) => (nextCategory === "Todos" || place.category === nextCategory) && (region === "Todos" || place.region === region));
    if (firstMatch) setMapFocus(firstMatch.id);
  }

  function applyRegion(nextRegion: (typeof regions)[number]) {
    setRegion(nextRegion);
    setQuery("");
    const firstMatch = places.find((place) => (nextRegion === "Todos" || place.region === nextRegion) && (category === "Todos" || place.category === category));
    if (firstMatch) setMapFocus(firstMatch.id);
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
    const place = places.find((item) => item.id === placeId);
    if (!place) return;
    setMapFocus(placeId);
    setSelected(place);
  }

  return (
    <div className="min-h-screen bg-[#F5ECD8] text-[#2E3222]">
      <header className="sticky top-0 z-40 border-b border-[#3C482D]/10 bg-[#F5ECD8]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => goTo("inicio")} className="tap flex items-center gap-3" aria-label="Ir ao início">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-[#B9572D] shadow-[0_6px_0_rgba(185,87,45,.16)]"><img src={markImage} alt="Marca Bora Piauí" className="h-9 w-9 object-contain" /></span>
            <span className="display-font text-[1.5rem] leading-none tracking-[-0.07em]">bora <span className="text-[#B9572D]">piauí</span></span>
          </button>
          <nav className="hidden items-center gap-7 text-sm font-bold md:flex">
            <button onClick={() => goTo("explorar")} className="tap hover:text-[#B9572D]">Explorar</button>
            <button onClick={() => goTo("dados")} className="tap hover:text-[#B9572D]">Dados</button>
            <button onClick={() => goTo("mapa")} className="tap hover:text-[#B9572D]">Mapa</button>
            <button onClick={() => goTo("como-funciona")} className="tap hover:text-[#B9572D]">Como funciona</button>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setPlannerOpen(true)} className="tap inline-flex h-10 items-center gap-2 rounded-full bg-[#3C482D] px-4 text-sm font-extrabold text-white"><Bookmark className="h-4 w-4" /><span className="hidden sm:inline">Meu roteiro</span><span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/18 px-1 text-[10px]">{plan.length}</span></button>
            <button onClick={() => setMenuOpen((value) => !value)} className="tap grid h-10 w-10 place-items-center rounded-full border border-[#3C482D]/15 md:hidden" aria-label="Abrir menu">{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-[#3C482D]/10 bg-[#F5ECD8] px-5 py-4 md:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1"><button onClick={() => goTo("explorar")} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4]">Explorar destinos</button><button onClick={() => goTo("dados")} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4]">Dados oficiais</button><button onClick={() => goTo("mapa")} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4]">Mapa do estado</button><button onClick={() => setPlannerOpen(true)} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4]">Meu roteiro</button></div></nav>}
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

        <section id="explorar" className="scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><span className="stop-chip">Parada 01 · escolha o território</span><h2 className="display-font mt-4 max-w-3xl text-4xl leading-none tracking-[-0.05em] sm:text-5xl">Comece pelo polo. Siga pelo que faz sentido para você.</h2></div><button onClick={() => goTo("mapa")} className="tap inline-flex items-center gap-2 self-start rounded-full bg-[#B9572D] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#cd6d45]"><MapPinned className="h-4 w-4" /> Abrir mapa estadual</button></div>
            <div className="mt-9 rounded-[1.75rem] border border-[#3C482D]/10 bg-[#FFFDF6] p-4 sm:p-5"><div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#566B37]"><Compass className="h-4 w-4" /> Polos do Observatório de Turismo</div><div className="mt-3 flex flex-wrap gap-2">{regions.map((item) => <button key={item} onClick={() => applyRegion(item)} className={`tap rounded-full px-3 py-2 text-xs font-extrabold ${region === item ? "bg-[#3C482D] text-white" : "bg-[#E9DCC0] text-[#465039] hover:bg-[#DECDA9]"}`}>{item}</button>)}</div></div>
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => applyCategory(item)} className={`tap rounded-full px-4 py-2.5 text-sm font-extrabold ${category === item ? "bg-[#B9572D] text-white" : "bg-[#E9DCC0] text-[#465039] hover:bg-[#DECDA9]"}`}>{item}</button>)}</div><label className="flex h-11 items-center gap-2 rounded-full border border-[#3C482D]/15 bg-[#FFFDF6] px-4 text-[#6B7057] md:w-72"><Search className="h-4 w-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar destino ou município" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#9A9B84]" /></label></div>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#6A715D]"><Info className="h-4 w-4 shrink-0 text-[#B9572D]" /><span>Seleção de destinos prioritários do protótipo, organizada pelos polos do Observatório. Não representa ranking de visitação.</span></div>
            <div className="atlas-rail mt-5" aria-label="Percurso entre polos turísticos">
              {(regions.slice(1) as Region[]).map((item) => {
                const total = visiblePlaces.filter((place) => place.region === item).length;
                if (!total) return null;
                return <button key={item} type="button" data-active={region === item} onClick={() => applyRegion(item)} className="atlas-node tap"><span className="atlas-node-label">{item.replace("Polo ", "")}</span><span className="atlas-node-count">{total} {total === 1 ? "âncora" : "âncoras"} neste recorte</span></button>;
              })}
            </div>
            <div className="discovery-route mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{visiblePlaces.map((place, index) => <article key={place.id} className={`route-card place-card flex min-h-[315px] flex-col overflow-hidden rounded-[1.75rem] border border-[#3C482D]/12 bg-[#FFFDF6] shadow-[0_12px_32px_rgba(59,70,42,.06)] ${index === 0 ? "md:col-span-2 xl:row-span-2 xl:min-h-[640px]" : index === 4 ? "xl:col-span-2" : ""}`}><div className={`relative overflow-hidden ${index === 0 ? "h-44 xl:h-72" : "h-32"}`} style={{ backgroundColor: `${place.accent}18` }}>{place.image ? <img src={place.image} alt={`Ilustração editorial para ${place.title}`} className="place-image h-full w-full object-cover" /> : <div className="map-tile"><span>{place.region.toUpperCase()} · PARADA {index + 1}</span></div>}<span className="absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[#B9572D] text-xs font-extrabold text-white shadow-sm">{String(index + 1).padStart(2, "0")}</span></div><div className="flex flex-1 flex-col p-5"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B9572D]">{place.region} · {place.category}</p><h3 className="display-font mt-2 text-3xl leading-[0.95] tracking-[-0.045em]">{place.title}</h3><p className="mt-1 text-xs font-bold text-[#70745F]">{place.municipality}</p><p className="mt-3 text-sm leading-6 text-[#66705E]">{place.text}</p><div className="mt-auto flex flex-wrap gap-2 pt-5"><button onClick={() => showPlaceOnMap(place)} className="tap inline-flex items-center gap-1.5 rounded-full bg-[#B9572D] px-3 py-2 text-xs font-extrabold text-white hover:bg-[#cd6d45]"><MapPinned className="h-3.5 w-3.5" /> Ver no mapa</button><button onClick={() => setSelected(place)} className="tap rounded-full border border-[#3C482D]/15 px-3 py-2 text-xs font-extrabold">Detalhes</button></div><span className="route-connector" aria-hidden="true" /></div></article>)}</div>
            {visiblePlaces.length === 0 && <div className="mt-8 rounded-[1.5rem] border border-dashed border-[#3C482D]/20 p-10 text-center"><SlidersHorizontal className="mx-auto h-7 w-7 text-[#B9572D]" /><p className="mt-3 font-bold">Nenhum destino encontrado nesse recorte.</p><button onClick={() => { setCategory("Todos"); setRegion("Todos"); setQuery(""); }} className="mt-4 text-sm font-extrabold text-[#566B37]">Limpar filtros</button></div>}
          </div>
        </section>

        <section id="dados" className="atlas-data scroll-mt-20 bg-[#E9DCC0] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end"><div><span className="stop-chip !bg-[#566B37] !text-white before:!bg-[#D9A640]">Parada 02 · contexto</span><h2 className="display-font mt-4 text-5xl leading-[0.92] tracking-[-0.055em] text-[#303722]">Antes de abrir a rota, veja a escala.</h2><p className="mt-5 max-w-md text-base leading-7 text-[#586049]">O Piauí ocupa 251.755,499 km² e tem população estimada em 3.384.547 pessoas. A escala territorial ajuda a escolher percursos realistas.</p><p className="mt-4 text-xs leading-5 text-[#68705C]">{sourceAnchor(ibgeUrl, "Fonte: IBGE · Piauí")} · área territorial e estimativa populacional, 2025.</p></div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-[1.5rem] bg-[#3C482D] p-5 text-white"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#D9A640]">Território</p><p className="display-font mt-5 text-4xl tracking-[-0.06em]">251,8 mil</p><p className="mt-1 text-sm text-white/70">km² · IBGE 2025</p></div><div className="rounded-[1.5rem] bg-[#FFFDF6] p-5"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B9572D]">População</p><p className="display-font mt-5 text-4xl tracking-[-0.06em]">3,38 mi</p><p className="mt-1 text-sm text-[#68705C]">estimativa · IBGE 2025</p></div><div className="rounded-[1.5rem] bg-[#D9A640] p-5 text-[#303722]"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">Oferta formal</p><p className="display-font mt-5 text-4xl tracking-[-0.06em]">1.699</p><p className="mt-1 text-sm text-[#303722]/70">Cadastur · 2025</p></div></div></div>
          <div className="mt-9 grid gap-5 lg:grid-cols-2"><article className="min-h-[360px] rounded-[1.75rem] border border-[#3C482D]/10 bg-[#FFFDF6] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[#B9572D]"><ChartNoAxesColumnIncreasing className="h-4 w-4" /><p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">Oferta turística</p></div><h3 className="display-font mt-3 text-3xl tracking-[-0.05em]">Cadastur em cinco recortes</h3></div><span className="rounded-full bg-[#F5ECD8] px-3 py-2 text-[10px] font-extrabold text-[#566B37]">2025</span></div><ChartContainer config={supplyChartConfig} className="mt-5 h-[220px] w-full aspect-auto"><BarChart data={supplyData} layout="vertical" margin={{ left: 8, right: 18 }}><CartesianGrid horizontal={false} stroke="#E8DFC9" /><XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(value) => format.format(value)} /><YAxis type="category" dataKey="name" width={88} tickLine={false} axisLine={false} tick={{ fill: "#66705E", fontSize: 11 }} /><ChartTooltip cursor={{ fill: "#F5ECD8" }} content={<ChartTooltipContent hideLabel />} /><Bar dataKey="total" fill="var(--color-total)" radius={[0, 8, 8, 0]} /></BarChart></ChartContainer><p className="mt-4 text-xs leading-5 text-[#68705C]">Recorte de cinco categorias dentre 1.699 empreendimentos com Cadastur. {sourceAnchor(observatoryUrl, "Fonte: Observatório de Inteligência Turística do Piauí · Cadastur 2025")}.</p></article>
            <article className="min-h-[360px] rounded-[1.75rem] border border-[#3C482D]/10 bg-[#3C482D] p-5 text-white sm:p-7"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[#D9A640]"><TreePine className="h-4 w-4" /><p className="text-[10px] font-extrabold uppercase tracking-[0.14em]">Escala ambiental</p></div><h3 className="display-font mt-3 text-3xl tracking-[-0.05em]">Áreas protegidas selecionadas</h3></div><span className="rounded-full bg-white/10 px-3 py-2 text-[10px] font-extrabold text-white/85">hectares</span></div><ChartContainer config={areaChartConfig} className="mt-5 h-[220px] w-full aspect-auto"><BarChart data={protectedAreaData} layout="vertical" margin={{ left: 8, right: 18 }}><CartesianGrid horizontal={false} stroke="rgba(255,255,255,.13)" /><XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,.55)", fontSize: 10 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} /><YAxis type="category" dataKey="name" width={115} tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,.78)", fontSize: 11 }} /><ChartTooltip cursor={{ fill: "rgba(255,255,255,.08)" }} content={<ChartTooltipContent hideLabel />} /><Bar dataKey="area" fill="var(--color-area)" radius={[0, 8, 8, 0]} /></BarChart></ChartContainer><p className="mt-4 text-xs leading-5 text-white/65">Áreas oficiais do Parque Nacional Serra das Confusões, APA Delta do Parnaíba e Parque Nacional de Sete Cidades. {sourceAnchor(confusoesUrl, "ICMBio")} · {sourceAnchor(deltaSourceUrl, "ICMBio")} · {sourceAnchor(seteCidadesUrl, "ICMBio")}.</p></article></div>
          <div className="mt-5 flex flex-col gap-4 rounded-[1.75rem] border border-[#B9572D]/20 bg-[#FFFDF6] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F5ECD8] text-[#B9572D]"><Landmark className="h-5 w-5" /></span><div><p className="font-extrabold">Serra da Capivara: 39.614 visitas registradas em 2024</p><p className="mt-1 text-sm leading-6 text-[#67705E]">Indicador de contexto de visitação em uma unidade de conservação; não é estimativa para 2026 nem comparação entre destinos.</p></div></div><a href={capivaraVisitUrl} target="_blank" rel="noopener noreferrer" className="tap inline-flex shrink-0 items-center gap-2 rounded-full bg-[#B9572D] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#cd6d45]">Ver fonte <ExternalLink className="h-4 w-4" /></a></div>
        </div></section>

        <section id="mapa" className="atlas-map-section scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end"><div><span className="stop-chip">Parada 03 · localize</span><h2 className="display-font mt-4 text-5xl leading-[0.92] tracking-[-0.055em]">Seu roteiro ganha território no mapa.</h2><p className="mt-5 max-w-md text-base leading-7 text-[#586049]">Os filtros da descoberta também reorganizam os marcadores. Escolha um polo, aproxime-se de uma parada e só então abra uma rota externa.</p><div className="mt-7"><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#566B37]">Destinos neste recorte</p><div className="mt-3 flex flex-wrap gap-2">{visiblePlaces.map((place, index) => <button key={place.id} onClick={() => setMapFocus(place.id)} className={`tap inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold ${activeMapId === place.id ? "border-[#B9572D] bg-[#B9572D] text-white" : "border-[#3C482D]/15 bg-[#FFFDF6] text-[#3C482D]"}`}><span className="grid h-4 w-4 place-items-center rounded-full bg-current/15 text-[9px]">{index + 1}</span>{place.title}</button>)}</div></div></div><PiauiMap places={visiblePlaces} activePlaceId={activeMapId} onSelect={handleMapSelect} /></div></div></section>

        <section id="como-funciona" className="bg-[#3C482D] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr]"><div><span className="stop-chip !bg-[#B9572D] !text-white before:!bg-white">Parada 04 · planeje</span><h2 className="display-font mt-4 text-5xl leading-[0.94] tracking-[-0.055em]">Menos catálogo. Mais percurso.</h2><p className="mt-5 max-w-md text-base leading-7 text-white/72">O protótipo apresenta uma curadoria inicial, dados verificáveis e ações que deixam a confirmação operacional para os canais responsáveis.</p></div><div className="grid gap-3 sm:grid-cols-3">{[{ n: "01", icon: Compass, title: "Encontre", text: "Escolha polo e tema antes de comparar as paradas." }, { n: "02", icon: Waves, title: "Contextualize", text: "Use dados e fontes para dimensionar o território." }, { n: "03", icon: Check, title: "Siga", text: "Monte um roteiro e confirme a visita antes de sair." }].map((item) => <div key={item.n} className="rounded-[1.5rem] border border-white/12 bg-white/7 p-5"><item.icon className="h-5 w-5 text-[#D9A640]" /><p className="mt-5 text-xs font-extrabold tracking-[0.15em] text-[#D9A640]">{item.n}</p><h3 className="mt-2 text-lg font-extrabold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{item.text}</p></div>)}</div></div></section>
      </main>

      {selected && <div className="fixed inset-0 z-50 flex items-end bg-[#26301f]/55 p-0 backdrop-blur-[2px] sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Detalhes de ${selected.title}`}><div className="w-full max-w-xl overflow-hidden rounded-t-[2rem] bg-[#FFFDF6] sm:rounded-[2rem]"><div className="flex items-center justify-between p-5 sm:p-6"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em]" style={{ color: selected.accent }}>{selected.region} · {selected.category}</p><h2 className="display-font mt-2 text-3xl tracking-[-0.05em]">{selected.title}</h2><p className="mt-1 text-sm font-bold text-[#70745F]">{selected.municipality}</p></div><button onClick={() => setSelected(null)} className="tap grid h-10 w-10 place-items-center rounded-full bg-[#E9DCC0]" aria-label="Fechar detalhes"><X className="h-5 w-5" /></button></div><div className="px-5 pb-6 sm:px-6 sm:pb-7">{selected.image && <img src={selected.image} alt="" className="mb-5 h-44 w-full rounded-[1.25rem] object-cover" />}<p className="text-base leading-7 text-[#586049]">{selected.detail}</p><p className="mt-4 text-xs leading-5 text-[#85846F]">Referência: {sourceAnchor(selected.sourceUrl, selected.sourceName)} · {selected.sourceYear}. Confirme regras, operação e condições de visita antes de sair.</p><div className="mt-6 grid gap-3 sm:grid-cols-4"><button onClick={() => showPlaceOnMap(selected)} className="tap inline-flex items-center justify-center gap-2 rounded-full bg-[#E9DCC0] px-4 py-3 text-sm font-extrabold text-[#3C482D]"><MapPinned className="h-4 w-4" /> Mapa</button><button onClick={() => toggleItinerary(selected)} className="tap inline-flex justify-center gap-2 rounded-full bg-[#3C482D] px-4 py-3 text-sm font-extrabold text-white">{itinerary.includes(selected.id) ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{itinerary.includes(selected.id) ? "Remover" : "Roteiro"}</button><a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer" className="tap inline-flex justify-center gap-2 rounded-full border border-[#3C482D]/15 px-4 py-3 text-sm font-extrabold">Fonte <ExternalLink className="h-4 w-4" /></a><a href={selected.route} target="_blank" rel="noopener noreferrer" className="tap inline-flex justify-center gap-2 rounded-full bg-[#B9572D] px-4 py-3 text-sm font-extrabold text-white">Rota <ExternalLink className="h-4 w-4" /></a></div></div></div></div>}

      {plannerOpen && <div className="fixed inset-0 z-50 flex justify-end bg-[#26301f]/45 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label="Meu roteiro"><div className="flex h-full w-full max-w-md flex-col bg-[#FFFDF6] shadow-2xl"><div className="flex items-center justify-between border-b border-[#3C482D]/10 p-5"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#B9572D]">Meu roteiro</p><h2 className="display-font mt-1 text-3xl tracking-[-0.05em]">Meu Piauí, por etapas</h2></div><button onClick={() => setPlannerOpen(false)} className="tap grid h-10 w-10 place-items-center rounded-full bg-[#E9DCC0]" aria-label="Fechar roteiro"><X className="h-5 w-5" /></button></div><div className="flex-1 overflow-y-auto p-5"><div className="rounded-[1.5rem] bg-[#566B37] p-5 text-white"><p className="text-sm font-bold">{plan.length ? `${plan.length} parada${plan.length > 1 ? "s" : ""} escolhida${plan.length > 1 ? "s" : ""}` : "Seu roteiro está vazio"}</p><p className="mt-1 text-sm leading-6 text-white/72">Monte um ponto de partida. Distâncias, operação e melhor ordem devem ser confirmadas antes da viagem.</p></div>{plan.length ? <ol className="mt-6 space-y-3">{plan.map((place, index) => <li key={place.id} className="flex gap-3 rounded-[1.25rem] border border-[#3C482D]/10 bg-white p-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#B9572D] text-xs font-extrabold text-white">{index + 1}</span><div className="min-w-0 flex-1"><p className="font-extrabold">{place.title}</p><p className="mt-0.5 text-xs font-bold text-[#70745F]">{place.region} · {place.municipality}</p></div><button onClick={() => toggleItinerary(place)} className="tap grid h-8 w-8 place-items-center rounded-full bg-[#E9DCC0]" aria-label={`Remover ${place.title}`}><Minus className="h-4 w-4" /></button></li>)}</ol> : <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#3C482D]/18 p-8 text-center"><Compass className="mx-auto h-7 w-7 text-[#B9572D]" /><p className="mt-3 text-sm font-bold">Escolha uma primeira parada para começar.</p></div>}</div><div className="border-t border-[#3C482D]/10 p-5"><div className="flex gap-3"><button onClick={() => goTo("explorar")} className="tap flex-1 rounded-full bg-[#3C482D] px-4 py-3 text-sm font-extrabold text-white">Explorar</button><button onClick={clearItinerary} disabled={!plan.length} className="tap rounded-full border border-[#3C482D]/15 px-4 py-3 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-35">Limpar</button></div></div></div></div>}

      <footer className="border-t border-[#3C482D]/10 px-4 py-8 text-xs text-[#747860] sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row"><p>Bora Piauí · Protótipo navegável estadual.</p><p>Dados e referências: {sourceAnchor(observatoryUrl, "Observatório de Turismo")} · {sourceAnchor(ibgeUrl, "IBGE")} · ICMBio e UNESCO · consulta em 20 ago. 2026.</p></div></footer>
    </div>
  );
}
