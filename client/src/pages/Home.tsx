import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  Compass,
  ExternalLink,
  MapPinned,
  Menu,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { TeresinaMap } from "@/components/TeresinaMap";

/* Cerrado e Rios: barro para ação, verde de buriti para orientação e mapa como parte central da descoberta. */
const heroImage = "/manus-storage/bora-piaui-route-sol-hero_14d6511e.jpg";
const riverImage = "/manus-storage/bora-piaui-encontro-das-aguas_774a8581.jpg";
const potteryImage = "/manus-storage/bora-piaui-potter-detail_033e5962.jpg";
const markImage = "/manus-storage/bora-piaui-sun-river-mark_032a7fc1.png";
const sourceVisitBrasil = "https://visitbrasil.com/en/location/teresina/";

type Place = {
  id: string;
  title: string;
  category: "Natureza" | "Cultura" | "Gastronomia" | "Vista";
  district: string;
  text: string;
  detail: string;
  route: string;
  mapQuery: string;
  image?: string;
  accent: string;
};

const places: Place[] = [
  {
    id: "rios",
    title: "Encontro dos Rios",
    category: "Natureza",
    district: "Poty Velho",
    text: "Onde Poti e Parnaíba seguem juntos.",
    detail:
      "Um ponto de partida para observar os rios e aproximar natureza, artesanato e território em uma só parada.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Parque%20Ambiental%20Encontro%20dos%20Rios%2C%20Teresina%2C%20PI",
    mapQuery: "Parque Ambiental Encontro dos Rios",
    image: riverImage,
    accent: "#2E6C76",
  },
  {
    id: "ponte",
    title: "Ponte Estaiada",
    category: "Vista",
    district: "Rio Poti",
    text: "Uma pausa alta para olhar a cidade.",
    detail:
      "O complexo da Ponte Estaiada é um símbolo contemporâneo de Teresina e concentra uma vista ampla do Rio Poti e da cidade.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Mirante%20da%20Ponte%20Estaiada%2C%20Teresina%2C%20PI",
    mapQuery: "Mirante da Ponte Estaiada",
    accent: "#B9572D",
  },
  {
    id: "museu",
    title: "Museu do Piauí",
    category: "Cultura",
    district: "Centro",
    text: "Histórias do estado em uma parada central.",
    detail:
      "Um recorte cultural para quem quer começar a visita entendendo mais do Piauí antes de seguir pela cidade.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Museu%20do%20Piaui%2C%20Teresina%2C%20PI",
    mapQuery: "Museu do Piaui Casa de Odilon Nunes",
    accent: "#566B37",
  },
  {
    id: "poty",
    title: "Polo Cerâmico do Poty Velho",
    category: "Cultura",
    district: "Poty Velho",
    text: "Argila, gesto e memória ribeirinha.",
    detail:
      "Um lugar para encontrar a cerâmica como expressão de uma prática artesanal ligada à vida às margens dos rios.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Polo%20Ceramico%20do%20Poty%20Velho%2C%20Teresina%2C%20PI",
    mapQuery: "Polo Ceramico do Poty Velho",
    image: potteryImage,
    accent: "#A86D32",
  },
  {
    id: "mercado",
    title: "Mercado Central",
    category: "Gastronomia",
    district: "Centro",
    text: "Sabores, ingredientes e movimento no centro.",
    detail:
      "Uma parada gastronômica para observar o ritmo do comércio local e procurar ingredientes, petiscos e preparos que fazem parte da cidade.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Mercado%20Central%20de%20Teresina%2C%20Teresina%2C%20PI",
    mapQuery: "Mercado Central de Teresina",
    accent: "#D9A640",
  },
];

const categories = ["Todos", "Natureza", "Cultura", "Gastronomia", "Vista"] as const;

export default function Home() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [itinerary, setItinerary] = useState<string[]>(["museu", "ponte"]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [mapFocus, setMapFocus] = useState<string | null>("rios");
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const visiblePlaces = useMemo(
    () =>
      places.filter(
        (place) =>
          (category === "Todos" || place.category === category) &&
          `${place.title} ${place.category} ${place.district}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [category, query],
  );
  const activeMapId = visiblePlaces.some((place) => place.id === mapFocus)
    ? mapFocus
    : visiblePlaces[0]?.id ?? null;
  const plan = itinerary
    .map((id) => places.find((place) => place.id === id))
    .filter((place): place is Place => Boolean(place));

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }

  function toggleItinerary(place: Place) {
    setItinerary((current) =>
      current.includes(place.id) ? current.filter((id) => id !== place.id) : [...current, place.id],
    );
    toast.success(
      itinerary.includes(place.id)
        ? `${place.title} removido do roteiro.`
        : `${place.title} entrou no roteiro.`,
    );
  }

  function clearItinerary() {
    setItinerary([]);
    toast.message("Roteiro limpo.");
  }

  function showPlaceOnMap(place: Place) {
    setMapFocus(place.id);
    goTo("mapa");
  }

  function applyCategory(nextCategory: (typeof categories)[number]) {
    setCategory(nextCategory);
    setQuery("");
    const firstMatch = nextCategory === "Todos" ? places[0] : places.find((place) => place.category === nextCategory);
    if (firstMatch) setMapFocus(firstMatch.id);
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
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-[#B9572D] shadow-[0_6px_0_rgba(185,87,45,.16)]">
              <img src={markImage} alt="Marca Bora Piauí" className="h-9 w-9 object-contain" />
            </span>
            <span className="display-font text-[1.5rem] leading-none tracking-[-0.07em]">
              bora <span className="text-[#B9572D]">piauí</span>
            </span>
          </button>
          <nav className="hidden items-center gap-7 text-sm font-bold md:flex">
            <button onClick={() => goTo("explorar")} className="tap hover:text-[#B9572D]">Explorar</button>
            <button onClick={() => goTo("mapa")} className="tap hover:text-[#B9572D]">Mapa</button>
            <button onClick={() => goTo("como-funciona")} className="tap hover:text-[#B9572D]">Como funciona</button>
            <a href={sourceVisitBrasil} target="_blank" rel="noreferrer" className="tap hover:text-[#B9572D]">Sobre Teresina</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setPlannerOpen(true)} className="tap inline-flex h-10 items-center gap-2 rounded-full bg-[#3C482D] px-4 text-sm font-extrabold text-white">
              <Bookmark className="h-4 w-4" /> <span className="hidden sm:inline">Meu roteiro</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/18 px-1 text-[10px]">{plan.length}</span>
            </button>
            <button onClick={() => setMenuOpen((value) => !value)} className="tap grid h-10 w-10 place-items-center rounded-full border border-[#3C482D]/15 md:hidden" aria-label="Abrir menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-[#3C482D]/10 bg-[#F5ECD8] px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <button onClick={() => goTo("explorar")} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4]">Explorar Teresina</button>
              <button onClick={() => goTo("mapa")} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4]">Mapa da cidade</button>
              <button onClick={() => setPlannerOpen(true)} className="rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4]">Meu roteiro</button>
            </div>
          </nav>
        )}
      </header>

      <main id="inicio">
        <section className="relative overflow-hidden bg-[#3C482D] px-4 pb-10 pt-6 text-white sm:px-6 sm:pb-14 lg:px-8 lg:pt-8">
          <div className="mx-auto grid max-w-7xl items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 py-7 lg:pb-12 lg:pt-16">
              <div className="sun-chip inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em]">
                <Sparkles className="h-3.5 w-3.5" /> Piauí por perto · Teresina
              </div>
              <h1 className="display-font mt-7 max-w-xl text-5xl leading-[0.92] tracking-[-0.065em] sm:text-6xl lg:text-7xl">Teresina começa no encontro.</h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/78 sm:text-lg">Descubra lugares, veja cada parada no mapa e monte uma rota que caiba no seu tempo.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => goTo("mapa")} className="tap inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#cd6d45]">
                  Abrir mapa <MapPinned className="h-4 w-4" />
                </button>
                <button onClick={() => goTo("explorar")} className="tap inline-flex items-center gap-2 rounded-full border border-white/28 bg-white/8 px-5 py-3 text-sm font-extrabold text-white hover:bg-white/14">
                  Escolher paradas <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative min-h-[340px] overflow-hidden rounded-[2.25rem] border border-white/18 bg-[#556B37] sm:min-h-[430px]">
              <img src={heroImage} alt="Ilustração editorial de Teresina entre rios" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2E3222]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-white/65">Comece pelo território</p>
                  <p className="mt-1 text-base font-bold">Poti, Parnaíba e o coração urbano</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[#FFFDF6] text-[#B9572D]"><MapPinned className="h-5 w-5" /></span>
              </div>
            </div>
          </div>
          <div className="route-line absolute bottom-0 left-0 h-[3px] w-full" />
        </section>

        <section id="explorar" className="scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="stop-chip">Parada 01 · escolha</span>
                <h2 className="display-font mt-4 max-w-2xl text-4xl leading-none tracking-[-0.05em] sm:text-5xl">Escolha um lugar. Veja onde ele está.</h2>
              </div>
              <button onClick={() => goTo("mapa")} className="tap inline-flex items-center gap-2 self-start rounded-full bg-[#B9572D] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#cd6d45]">
                <MapPinned className="h-4 w-4" /> Abrir mapa
              </button>
            </div>

            <div className="mt-9 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button key={item} onClick={() => applyCategory(item)} className={`tap rounded-full px-4 py-2.5 text-sm font-extrabold ${category === item ? "bg-[#B9572D] text-white" : "bg-[#E9DCC0] text-[#465039] hover:bg-[#DECDA9]"}`}>
                    {item}
                  </button>
                ))}
              </div>
              <label className="flex h-11 items-center gap-2 rounded-full border border-[#3C482D]/15 bg-[#FFFDF6] px-4 text-[#6B7057] md:w-72">
                <Search className="h-4 w-4" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por lugar ou tipo" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#9A9B84]" />
              </label>
            </div>

            <div className="discovery-route mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {visiblePlaces.map((place, index) => (
                <article key={place.id} className={`route-card place-card flex min-h-[315px] flex-col overflow-hidden rounded-[1.75rem] border border-[#3C482D]/12 bg-[#FFFDF6] shadow-[0_12px_32px_rgba(59,70,42,.06)] ${index === 0 ? "md:col-span-2 xl:row-span-2 xl:min-h-[640px]" : index === 3 ? "xl:col-span-2" : ""}`}>
                  <div className={`relative overflow-hidden ${index === 0 ? "h-44 xl:h-72" : "h-32"}`} style={{ backgroundColor: `${place.accent}18` }}>
                    {place.image ? (
                      <img src={place.image} alt={`Representação de ${place.title}`} className="place-image h-full w-full object-cover" />
                    ) : (
                      <div className="map-tile"><span>RIO POTI · PARADA {index + 1}</span></div>
                    )}
                    <span className="absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[#B9572D] text-xs font-extrabold text-white shadow-sm">0{index + 1}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#B9572D]">Marcador {String(index + 1).padStart(2, "0")} · {place.category} · {place.district}</p>
                    <h3 className="display-font mt-2 text-3xl leading-[0.95] tracking-[-0.045em]">{place.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#66705E]">{place.text}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                      <button onClick={() => showPlaceOnMap(place)} className="tap inline-flex items-center gap-1.5 rounded-full bg-[#B9572D] px-3 py-2 text-xs font-extrabold text-white hover:bg-[#cd6d45]">
                        <MapPinned className="h-3.5 w-3.5" /> Ver no mapa
                      </button>
                      <button onClick={() => setSelected(place)} className="tap rounded-full border border-[#3C482D]/15 px-3 py-2 text-xs font-extrabold">Detalhes</button>
                    </div>
                    <span className="route-connector" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
            {visiblePlaces.length === 0 && (
              <div className="mt-8 rounded-[1.5rem] border border-dashed border-[#3C482D]/20 p-10 text-center">
                <SlidersHorizontal className="mx-auto h-7 w-7 text-[#B9572D]" />
                <p className="mt-3 font-bold">Nenhuma parada encontrada.</p>
                <button onClick={() => { setCategory("Todos"); setQuery(""); }} className="mt-4 text-sm font-extrabold text-[#566B37]">Limpar filtros</button>
              </div>
            )}
          </div>
        </section>

        <section id="mapa" className="scroll-mt-20 bg-[#E9DCC0] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-end">
              <div>
                <span className="stop-chip !bg-[#566B37] !text-white before:!bg-[#D9A640]">Parada 02 · localize</span>
                <h2 className="display-font mt-4 text-5xl leading-[0.92] tracking-[-0.055em] text-[#303722]">Seu roteiro começa no mapa.</h2>
                <p className="mt-5 max-w-md text-base leading-7 text-[#586049]">A rota acompanha as escolhas: filtre, veja os marcadores mudarem e aproxime-se de uma parada antes de abrir os detalhes.</p>
                <div className="mt-7">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#566B37]">Filtrar pontos no mapa</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map((item) => (
                      <button key={item} onClick={() => applyCategory(item)} className={`tap rounded-full px-3 py-2 text-xs font-extrabold ${category === item ? "bg-[#B9572D] text-white" : "border border-[#3C482D]/12 bg-[#FFFDF6] text-[#3C482D]"}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {visiblePlaces.map((place, index) => (
                    <button key={place.id} onClick={() => { setMapFocus(place.id); }} className={`tap inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold ${mapFocus === place.id ? "border-[#B9572D] bg-[#B9572D] text-white" : "border-[#3C482D]/15 bg-[#FFFDF6] text-[#3C482D]"}`}>
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-current/15 text-[9px]">{index + 1}</span>
                      {place.title}
                    </button>
                  ))}
                </div>
              </div>
              <TeresinaMap places={visiblePlaces} activePlaceId={activeMapId} onSelect={handleMapSelect} />
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-[#3C482D] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr]">
            <div>
              <span className="stop-chip !bg-[#B9572D] !text-white before:!bg-white">Parada 03 · siga</span>
              <h2 className="display-font mt-4 text-5xl leading-[0.94] tracking-[-0.055em]">Menos lista. Mais território.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-white/72">Comece pelo mapa, escolha um ponto que combine com seu tempo e só então abra uma rota. É uma experiência de descoberta, não um catálogo infinito.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { n: "01", title: "Encontre", text: "Busque uma pausa de natureza, cultura ou vista." },
                { n: "02", title: "Localize", text: "Veja o ponto na cidade antes de decidir." },
                { n: "03", title: "Siga", text: "Adicione ao roteiro ou abra sua rota no Maps." },
              ].map((item) => (
                <div key={item.n} className="rounded-[1.5rem] border border-white/12 bg-white/7 p-5">
                  <p className="text-xs font-extrabold tracking-[0.15em] text-[#D9A640]">{item.n}</p>
                  <h3 className="mt-8 text-lg font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end bg-[#26301f]/55 p-0 backdrop-blur-[2px] sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={`Detalhes de ${selected.title}`}>
          <div className="w-full max-w-xl overflow-hidden rounded-t-[2rem] bg-[#FFFDF6] sm:rounded-[2rem]">
            <div className="flex items-center justify-between p-5 sm:p-6">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em]" style={{ color: selected.accent }}>{selected.category} · {selected.district}</p>
                <h2 className="display-font mt-2 text-3xl tracking-[-0.05em]">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="tap grid h-10 w-10 place-items-center rounded-full bg-[#E9DCC0]" aria-label="Fechar detalhes"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-5 pb-6 sm:px-6 sm:pb-7">
              {selected.image && <img src={selected.image} alt="" className="mb-5 h-44 w-full rounded-[1.25rem] object-cover" />}
              <p className="text-base leading-7 text-[#586049]">{selected.detail}</p>
              <p className="mt-4 text-xs leading-5 text-[#85846F]">Conteúdo de referência para o protótipo. Confirme condições de visita antes de sair.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <button onClick={() => showPlaceOnMap(selected)} className="tap inline-flex items-center justify-center gap-2 rounded-full bg-[#E9DCC0] px-4 py-3 text-sm font-extrabold text-[#3C482D]"><MapPinned className="h-4 w-4" /> No mapa</button>
                <button onClick={() => toggleItinerary(selected)} className="tap inline-flex justify-center gap-2 rounded-full bg-[#3C482D] px-4 py-3 text-sm font-extrabold text-white">{itinerary.includes(selected.id) ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{itinerary.includes(selected.id) ? "Remover" : "Roteiro"}</button>
                <a href={selected.route} target="_blank" rel="noopener noreferrer" className="tap inline-flex justify-center gap-2 rounded-full bg-[#B9572D] px-4 py-3 text-sm font-extrabold text-white">Abrir rota <ExternalLink className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </div>
      )}

      {plannerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#26301f]/45 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label="Meu roteiro">
          <div className="flex h-full w-full max-w-md flex-col bg-[#FFFDF6] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3C482D]/10 p-5">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#B9572D]">Meu roteiro</p><h2 className="display-font mt-1 text-3xl tracking-[-0.05em]">Uma tarde em Teresina</h2></div>
              <button onClick={() => setPlannerOpen(false)} className="tap grid h-10 w-10 place-items-center rounded-full bg-[#E9DCC0]" aria-label="Fechar roteiro"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="rounded-[1.5rem] bg-[#566B37] p-5 text-white"><p className="text-sm font-bold">{plan.length ? `${plan.length} parada${plan.length > 1 ? "s" : ""} escolhida${plan.length > 1 ? "s" : ""}` : "Seu roteiro está vazio"}</p><p className="mt-1 text-sm leading-6 text-white/72">Adicione lugares enquanto explora. Você pode remover qualquer um aqui.</p></div>
              {plan.length ? <ol className="mt-6 space-y-3">{plan.map((place, index) => <li key={place.id} className="flex gap-3 rounded-[1.25rem] border border-[#3C482D]/10 bg-white p-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#B9572D] text-xs font-extrabold text-white">{index + 1}</span><div className="min-w-0 flex-1"><p className="font-extrabold">{place.title}</p><p className="mt-0.5 text-xs font-bold text-[#70745F]">{place.category} · {place.district}</p></div><button onClick={() => toggleItinerary(place)} className="tap grid h-8 w-8 place-items-center rounded-full bg-[#E9DCC0]" aria-label={`Remover ${place.title}`}><Minus className="h-4 w-4" /></button></li>)}</ol> : <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#3C482D]/18 p-8 text-center"><Compass className="mx-auto h-7 w-7 text-[#B9572D]" /><p className="mt-3 text-sm font-bold">Escolha uma primeira parada para começar.</p></div>}
            </div>
            <div className="border-t border-[#3C482D]/10 p-5"><div className="flex gap-3"><button onClick={() => goTo("explorar")} className="tap flex-1 rounded-full bg-[#3C482D] px-4 py-3 text-sm font-extrabold text-white">Explorar</button><button onClick={clearItinerary} disabled={!plan.length} className="tap rounded-full border border-[#3C482D]/15 px-4 py-3 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-35">Limpar</button></div></div>
          </div>
        </div>
      )}

      <footer className="border-t border-[#3C482D]/10 px-4 py-8 text-xs text-[#747860] sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row"><p>Bora Piauí · Protótipo navegável de Teresina.</p><p>Referência de conteúdo: <a href={sourceVisitBrasil} target="_blank" rel="noreferrer" className="font-extrabold text-[#566B37] underline underline-offset-2">Visit Brasil</a> · consulta em 20 ago. 2026.</p></div></footer>
    </div>
  );
}
