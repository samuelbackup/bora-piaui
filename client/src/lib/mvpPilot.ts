export type PilotItemKind = "attraction" | "business";
export type PilotItemStatus = "published" | "pending";

export type SourceReference = {
  name: string;
  url: string;
  verifiedAt: string;
  responsible?: string;
};

export type PilotCity = {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  accent: string;
  source: SourceReference;
};

export type PilotItem = {
  id: string;
  slug: string;
  citySlug: string;
  kind: PilotItemKind;
  title: string;
  category: string;
  summary: string;
  image?: { url: string; alt: string; credit?: string };
  routeUrl?: string;
  contactUrl?: string;
  externalUrl?: string;
  mapQuery: string;
  accent: string;
  operationalStatus: "confirmed" | "verify" | "unavailable";
  source: SourceReference;
  status: PilotItemStatus;
};

export type PilotItinerary = {
  slug: string;
  citySlug: string;
  dayScope: "one-day";
  title: string;
  durationLabel: string;
  summary: string;
  confirmationNotice: string;
  stopIds: string[];
};

export type PilotCatalog = {
  cities: PilotCity[];
  items: PilotItem[];
  itineraries: PilotItinerary[];
};

const teresinaSource: SourceReference = {
  name: "Visit Brasil · Teresina",
  url: "https://visitbrasil.com/en/location/teresina/",
  verifiedAt: "Consulta editorial 2026",
};

const deltaSource: SourceReference = {
  name: "ICMBio · APA Delta do Parnaíba",
  url: "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/marinho/lista-de-ucs/apa-delta-do-parnaiba/informacoes-sobre-visitacao-apa-delta-do-parnaiba",
  verifiedAt: "Consulta editorial 2026",
};

const capivaraSource: SourceReference = {
  name: "UNESCO · Parque Nacional Serra da Capivara",
  url: "https://whc.unesco.org/en/list/606/",
  verifiedAt: "Referência de visitação 2024",
};

export const pilotCities: PilotCity[] = [
  {
    slug: "teresina",
    name: "Teresina",
    eyebrow: "Capital e porta de entrada",
    summary: "Uma cidade de rios, encontros e deslocamentos que conectam o visitante aos demais percursos do estado.",
    accent: "#2E6C76",
    source: teresinaSource,
  },
  {
    slug: "cajueiro-da-praia",
    name: "Cajueiro da Praia",
    eyebrow: "Costa do Delta",
    summary: "Mar, mangue e experiências que dependem das condições de maré e da confirmação local.",
    accent: "#D9A640",
    source: deltaSource,
  },
  {
    slug: "sao-raimundo-nonato",
    name: "São Raimundo Nonato",
    eyebrow: "Origens e arqueologia",
    summary: "Uma base para conhecer a paisagem arqueológica e os sítios da Serra da Capivara com planejamento prévio.",
    accent: "#B9572D",
    source: capivaraSource,
  },
];

export const pilotItems: PilotItem[] = [
  {
    id: "encontro-dos-rios",
    slug: "encontro-dos-rios",
    citySlug: "teresina",
    kind: "attraction",
    title: "Encontro dos Rios",
    category: "Cidade e paisagem",
    summary: "Uma porta de entrada urbana no encontro entre os rios Poti e Parnaíba.",
    image: {
      url: "/manus-storage/encontro-dos-rios-mapacultura_0b698542.jpg",
      alt: "Vista do Encontro dos Rios em Teresina",
      credit: "Imagem editorial institucional",
    },
    routeUrl: "https://www.google.com/maps/dir/?api=1&destination=Parque%20Ambiental%20Encontro%20dos%20Rios%2C%20Teresina%2C%20PI",
    externalUrl: teresinaSource.url,
    mapQuery: "Parque Ambiental Encontro dos Rios, Teresina",
    accent: "#2E6C76",
    operationalStatus: "verify",
    source: teresinaSource,
    status: "published",
  },
  {
    id: "barra-grande",
    slug: "barra-grande",
    citySlug: "cajueiro-da-praia",
    kind: "attraction",
    title: "Barra Grande",
    category: "Litoral",
    summary: "Mar, mangue e percursos guiados pelo ritmo da maré no litoral piauiense.",
    routeUrl: "https://www.google.com/maps/dir/?api=1&destination=Barra%20Grande%2C%20Cajueiro%20da%20Praia%2C%20PI",
    externalUrl: deltaSource.url,
    mapQuery: "Barra Grande, Cajueiro da Praia",
    accent: "#D9A640",
    operationalStatus: "verify",
    source: deltaSource,
    status: "published",
  },
  {
    id: "serra-da-capivara",
    slug: "serra-da-capivara",
    citySlug: "sao-raimundo-nonato",
    kind: "attraction",
    title: "Parque Nacional Serra da Capivara",
    category: "Patrimônio",
    summary: "Arqueologia, paisagem e um Patrimônio Mundial no sudeste do Piauí.",
    routeUrl: "https://www.google.com/maps/dir/?api=1&destination=Parque%20Nacional%20Serra%20da%20Capivara%2C%20Sao%20Raimundo%20Nonato%2C%20PI",
    contactUrl: "https://www.gov.br/icmbio/pt-br/canais_atendimento",
    externalUrl: capivaraSource.url,
    mapQuery: "Parque Nacional Serra da Capivara, São Raimundo Nonato",
    accent: "#B9572D",
    operationalStatus: "verify",
    source: capivaraSource,
    status: "published",
  },
];

export const pilotItineraries: PilotItinerary[] = [
  {
    slug: "teresina-ponto-de-partida",
    citySlug: "teresina",
    dayScope: "one-day",
    title: "Teresina como ponto de partida",
    durationLabel: "Operação a confirmar",
    summary: "Um roteiro inicial para começar pelo Encontro dos Rios e decidir os próximos deslocamentos com dados atualizados.",
    confirmationNotice: "As próximas paradas, horários e condições precisam ser confirmados antes da saída.",
    stopIds: ["encontro-dos-rios"],
  },
  {
    slug: "barra-grande-com-confirmacao",
    citySlug: "cajueiro-da-praia",
    dayScope: "one-day",
    title: "Barra Grande com confirmação de maré",
    durationLabel: "Operação a confirmar",
    summary: "Um ponto de partida para planejar a costa, sempre respeitando maré, condução e avisos locais.",
    confirmationNotice: "A operação de passeios e os horários variam. Confirme antes de organizar o deslocamento.",
    stopIds: ["barra-grande"],
  },
  {
    slug: "serra-da-capivara-com-planejamento",
    citySlug: "sao-raimundo-nonato",
    dayScope: "one-day",
    title: "Serra da Capivara com planejamento",
    durationLabel: "Operação a confirmar",
    summary: "Uma estrutura inicial para organizar a visita sem presumir disponibilidade de circuitos ou serviços.",
    confirmationNotice: "Consulte as regras de visitação, condução e operação do parque antes de fechar o roteiro.",
    stopIds: ["serra-da-capivara"],
  },
];

export const pilotCatalog: PilotCatalog = {
  cities: pilotCities,
  items: pilotItems,
  itineraries: pilotItineraries,
};

export async function loadPilotCatalog(options: { delayMs?: number } = {}): Promise<PilotCatalog> {
  const delayMs = options.delayMs ?? 0;
  await new Promise<void>((resolve) => globalThis.setTimeout(resolve, delayMs));
  return pilotCatalog;
}

export function getPilotCity(slug: string, catalog: PilotCatalog = pilotCatalog) {
  return catalog.cities.find((city) => city.slug === slug) ?? null;
}

export function getPilotItems(citySlug: string, kind: PilotItemKind | "all" = "all", category = "all", catalog: PilotCatalog = pilotCatalog) {
  return catalog.items.filter((item) => item.citySlug === citySlug
    && (kind === "all" || item.kind === kind)
    && (category === "all" || item.category === category));
}

export function getPilotItinerary(citySlug: string, catalog: PilotCatalog = pilotCatalog) {
  return catalog.itineraries.find((itinerary) => itinerary.citySlug === citySlug) ?? null;
}

export function getPilotItem(id: string, catalog: PilotCatalog = pilotCatalog) {
  return catalog.items.find((item) => item.id === id) ?? null;
}

export function getPilotCategories(citySlug: string, kind: PilotItemKind | "all" = "all", catalog: PilotCatalog = pilotCatalog) {
  return Array.from(new Set(getPilotItems(citySlug, kind, "all", catalog).map((item) => item.category))).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
