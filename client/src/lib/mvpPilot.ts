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

export type PilotProximityRelation = {
  id: string;
  anchorItemId: string;
  relatedItemId: string;
  category: string;
  editorialReason: string;
  source: SourceReference;
};

export type PilotCurationTopic = {
  id: string;
  citySlug: string;
  category: "gastronomy" | "service";
  title: string;
  description: string;
  status: "curating";
};

export type PilotCatalog = {
  cities: PilotCity[];
  items: PilotItem[];
  itineraries: PilotItinerary[];
  proximityRelations: PilotProximityRelation[];
  curationTopics: PilotCurationTopic[];
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

const potiVelhoSource: SourceReference = {
  name: "SEMDEC Teresina · Polo Cerâmico do Poti Velho",
  url: "https://semdec.pmt.pi.gov.br/secretario-municipal-de-turismo-visita-polo-ceramico-de-teresina/",
  verifiedAt: "Publicação institucional: 2023",
};

const cajueiroMunicipalSource: SourceReference = {
  name: "Prefeitura de Cajueiro da Praia · História e atrações",
  url: "https://cajueirodapraia.pi.gov.br/cidade",
  verifiedAt: "Consulta editorial 2026",
};

const fumdhamMuseumSource: SourceReference = {
  name: "FUMDHAM · Museu do Homem Americano",
  url: "https://fumdham.org.br/cpt_home/museu-do-homem-americano/",
  verifiedAt: "Consulta editorial 2026",
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
    id: "polo-ceramico-poti-velho",
    slug: "polo-ceramico-poti-velho",
    citySlug: "teresina",
    kind: "attraction",
    title: "Polo Cerâmico do Poti Velho",
    category: "História e artesanato",
    summary: "Um percurso de cerâmica e memória local, conectado às tradições do bairro Poti Velho.",
    routeUrl: "https://www.google.com/maps/dir/?api=1&destination=Polo%20Ceramico%20do%20Poti%20Velho%2C%20Teresina%2C%20PI",
    externalUrl: potiVelhoSource.url,
    mapQuery: "Polo Cerâmico do Poti Velho, Teresina",
    accent: "#2E6C76",
    operationalStatus: "verify",
    source: potiVelhoSource,
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
  {
    id: "cajueiro-rei",
    slug: "cajueiro-rei",
    citySlug: "cajueiro-da-praia",
    kind: "attraction",
    title: "Cajueiro-rei do Piauí",
    category: "Natureza e memória",
    summary: "Uma atração do município que amplia a descoberta do litoral para além da praia de Barra Grande.",
    routeUrl: "https://www.google.com/maps/dir/?api=1&destination=Cajueiro%20Rei%20do%20Piau%C3%AD%2C%20Cajueiro%20da%20Praia%2C%20PI",
    externalUrl: cajueiroMunicipalSource.url,
    mapQuery: "Cajueiro Rei do Piauí, Cajueiro da Praia",
    accent: "#D9A640",
    operationalStatus: "verify",
    source: cajueiroMunicipalSource,
    status: "published",
  },
  {
    id: "museu-homem-americano",
    slug: "museu-do-homem-americano",
    citySlug: "sao-raimundo-nonato",
    kind: "attraction",
    title: "Museu do Homem Americano",
    category: "Memória e arqueologia",
    summary: "Espaço da FUMDHAM dedicado a divulgar o patrimônio cultural e pesquisas realizadas na região da Serra da Capivara.",
    routeUrl: "https://www.google.com/maps/dir/?api=1&destination=Museu%20do%20Homem%20Americano%2C%20S%C3%A3o%20Raimundo%20Nonato%2C%20PI",
    externalUrl: fumdhamMuseumSource.url,
    mapQuery: "Museu do Homem Americano, São Raimundo Nonato",
    accent: "#B9572D",
    operationalStatus: "verify",
    source: fumdhamMuseumSource,
    status: "published",
  },
];

export const pilotProximityRelations: PilotProximityRelation[] = [
  {
    id: "encontro-dos-rios-poti-velho",
    anchorItemId: "encontro-dos-rios",
    relatedItemId: "polo-ceramico-poti-velho",
    category: "História e artesanato",
    editorialReason: "Uma continuidade territorial para conhecer a cerâmica, as tradições do Poti Velho e as narrativas ligadas ao encontro dos rios.",
    source: potiVelhoSource,
  },
  {
    id: "barra-grande-cajueiro-rei",
    anchorItemId: "barra-grande",
    relatedItemId: "cajueiro-rei",
    category: "Natureza e memória",
    editorialReason: "Uma continuidade territorial para conhecer uma atração municipal que amplia o recorte de litoral de Barra Grande.",
    source: cajueiroMunicipalSource,
  },
  {
    id: "serra-capivara-museu-homem-americano",
    anchorItemId: "serra-da-capivara",
    relatedItemId: "museu-homem-americano",
    category: "Memória e arqueologia",
    editorialReason: "Um complemento editorial para contextualizar o patrimônio cultural e as pesquisas da região da Serra da Capivara.",
    source: fumdhamMuseumSource,
  },
];

export const pilotCurationTopics: PilotCurationTopic[] = [
  {
    id: "teresina-gastronomia",
    citySlug: "teresina",
    category: "gastronomy",
    title: "Gastronomia perto do percurso em curadoria",
    description: "Restaurantes e pontos de alimentação só serão indicados após fonte, canal público e confirmação editorial.",
    status: "curating",
  },
  {
    id: "teresina-servicos",
    citySlug: "teresina",
    category: "service",
    title: "Serviços de visita em curadoria",
    description: "Informações de apoio ao visitante serão incluídas quando houver canal oficial e condição operacional confirmada.",
    status: "curating",
  },
  {
    id: "cajueiro-gastronomia",
    citySlug: "cajueiro-da-praia",
    category: "gastronomy",
    title: "Gastronomia de Barra Grande em curadoria",
    description: "A interface não nomeia restaurantes ou condições de atendimento sem publicação editorial e canal confirmado.",
    status: "curating",
  },
  {
    id: "cajueiro-servicos",
    citySlug: "cajueiro-da-praia",
    category: "service",
    title: "Serviços de litoral em curadoria",
    description: "Passeios, apoio e demais serviços serão exibidos somente após confirmação de operação e fonte pública.",
    status: "curating",
  },
  {
    id: "serra-gastronomia",
    citySlug: "sao-raimundo-nonato",
    category: "gastronomy",
    title: "Gastronomia da região em curadoria",
    description: "A descoberta não indica estabelecimentos sem fonte, contato publicado e confirmação editorial.",
    status: "curating",
  },
  {
    id: "serra-servicos",
    citySlug: "sao-raimundo-nonato",
    category: "service",
    title: "Serviços de visita em curadoria",
    description: "Condução, transporte e apoio à visita dependem de informações públicas atualizadas e confirmação operacional.",
    status: "curating",
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
  proximityRelations: pilotProximityRelations,
  curationTopics: pilotCurationTopics,
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

export function getPilotNearbyItems(anchorItemId: string, catalog: PilotCatalog = pilotCatalog) {
  return catalog.proximityRelations
    .filter((relation) => relation.anchorItemId === anchorItemId)
    .map((relation) => ({ relation, item: getPilotItem(relation.relatedItemId, catalog) }))
    .filter((entry): entry is { relation: PilotProximityRelation; item: PilotItem } => entry.item !== null && entry.item.status === "published");
}

export function getPilotCurationTopics(citySlug: string, catalog: PilotCatalog = pilotCatalog) {
  return catalog.curationTopics.filter((topic) => topic.citySlug === citySlug);
}

export function getPilotCategories(citySlug: string, kind: PilotItemKind | "all" = "all", catalog: PilotCatalog = pilotCatalog) {
  return Array.from(new Set(getPilotItems(citySlug, kind, "all", catalog).map((item) => item.category))).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
