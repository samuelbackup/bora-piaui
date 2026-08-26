const deltaImage = "/manus-storage/bora-piaui-delta-editorial_93dc13d8.jpg";
const caatingaImage =
  "/manus-storage/bora-piaui-caatinga-editorial_d17c3e5a.jpg";
const encontroDosRiosImage =
  "/manus-storage/encontro-dos-rios-mapacultura_0b698542.jpg";
export const observatoryUrl =
  "https://observatorioturismo.pi.gov.br/turismo_numeros/";
export const deltaSourceUrl =
  "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/marinho/lista-de-ucs/apa-delta-do-parnaiba/informacoes-sobre-visitacao-apa-delta-do-parnaiba";
export const seteCidadesUrl =
  "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/caatinga/lista-de-ucs/parna-de-sete-cidades";
export const confusoesUrl =
  "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/caatinga/lista-de-ucs/parna-da-serra-das-confusoes";
const capivaraUrl = "https://whc.unesco.org/en/list/606/";
const pedroiiUrl =
  "http://pedroii.pi.gov.br/noticias/festival-de-inverno/pedro-ii-promove-ecoturismo-com-trilhas-cachoeiras-e-acao-ambiental-durante-o-festival-de-inverno-311";
const oeirasUrl = "https://oeiras.pi.gov.br/oeiras";
const teresinaUrl = "https://visitbrasil.com/en/location/teresina/";

export type Category =
  | "Natureza"
  | "Patrimônio"
  | "Litoral"
  | "Cultura"
  | "Cidade";
export type Region =
  | "Polo Teresina"
  | "Aventura e Mistério"
  | "Costa do Delta"
  | "Águas"
  | "Nascentes"
  | "Origens"
  | "Histórico Cultural";

export type Place = {
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

export const pilotPlaces: Place[] = [
  {
    id: "delta-do-parnaiba",
    title: "Delta do Parnaíba",
    category: "Litoral",
    region: "Costa do Delta",
    municipality: "Ilha Grande",
    text: "Canais, mangues e dunas onde o rio chega ao Atlântico.",
    detail:
      "A APA Delta do Parnaíba percorre todo o litoral piauiense. O ICMBio destaca os canais, manguezais e os passeios com saída pelo Porto dos Tatus como referências de visitação no território.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Porto%20dos%20Tatus%2C%20Ilha%20Grande%2C%20PI",
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
    detail:
      "No município de Cajueiro da Praia, o ICMBio descreve experiências de observação de fauna em estuários e passeios que dependem das condições de maré. Confirme condução e horários antes de sair.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Barra%20Grande%2C%20Cajueiro%20da%20Praia%2C%20PI",
    mapQuery: "Barra Grande, Cajueiro da Praia",
    sourceName: "ICMBio · APA Delta do Parnaíba",
    sourceUrl: deltaSourceUrl,
    sourceYear: "consulta 2026",
    accent: "#D9A640",
  },
  {
    id: "parque-nacional-sete-cidades",
    title: "Parque Nacional de Sete Cidades",
    category: "Natureza",
    region: "Aventura e Mistério",
    municipality: "Piracuruca e Brasileira",
    text: "Formações rochosas em uma unidade de conservação de Caatinga.",
    detail:
      "Criado em 1961, o Parque Nacional de Sete Cidades protege 6.303,64 hectares de Caatinga. Este ponto representa o recorte de paisagem e aventura no norte do estado.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Parque%20Nacional%20de%20Sete%20Cidades%2C%20PI",
    mapQuery: "Parque Nacional de Sete Cidades, Piracuruca",
    sourceName: "ICMBio · Parque Nacional de Sete Cidades",
    sourceUrl: seteCidadesUrl,
    sourceYear: "consulta 2026",
    accent: "#566B37",
  },
  {
    id: "serra-dos-matoes",
    title: "Serra dos Matões",
    category: "Natureza",
    region: "Aventura e Mistério",
    municipality: "Pedro II",
    text: "Trilhas e cachoeiras em um recorte serrano do Piauí.",
    detail:
      "A Prefeitura de Pedro II incluiu trilha e visita à Cachoeira do Salto Liso em uma ação de ecoturismo durante o Festival de Inverno de 2025. Programações e condições variam; consulte o canal local.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Serra%20dos%20Matoes%2C%20Pedro%20II%2C%20PI",
    mapQuery: "Serra dos Matões, Pedro II",
    sourceName: "Prefeitura de Pedro II",
    sourceUrl: pedroiiUrl,
    sourceYear: "2025",
    accent: "#6B8B5A",
  },
  {
    id: "cachoeira-do-urubu",
    title: "Cachoeira do Urubu",
    category: "Natureza",
    region: "Águas",
    municipality: "Esperantina",
    text: "Uma parada de rio no recorte do Polo das Águas.",
    detail:
      "A experiência de água entra no protótipo como referência de deslocamento entre municípios do Polo das Águas. O planejamento da visita precisa ser confirmado com a gestão local e canais oficiais.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Cachoeira%20do%20Urubu%2C%20Esperantina%2C%20PI",
    mapQuery: "Cachoeira do Urubu, Esperantina",
    sourceName: "Observatório de Inteligência Turística do Piauí",
    sourceUrl: observatoryUrl,
    sourceYear: "consulta 2026",
    accent: "#3F7E8C",
  },
  {
    id: "serra-das-confusoes",
    title: "Parque Nacional da Serra das Confusões",
    category: "Natureza",
    region: "Nascentes",
    municipality: "Caracol",
    text: "Grande extensão de Caatinga no sul do estado.",
    detail:
      "Em Caracol, o Parque Nacional da Serra das Confusões é uma unidade de conservação de Caatinga com 823.854,54 hectares. A visita requer planejamento atento às regras e à operação local.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Parque%20Nacional%20da%20Serra%20das%20Confusoes%2C%20Caracol%2C%20PI",
    mapQuery: "Parque Nacional da Serra das Confusões, Caracol",
    sourceName: "ICMBio · Serra das Confusões",
    sourceUrl: confusoesUrl,
    sourceYear: "consulta 2026",
    image: caatingaImage,
    accent: "#3C482D",
  },
  {
    id: "serra-da-capivara",
    title: "Parque Nacional Serra da Capivara",
    category: "Patrimônio",
    region: "Origens",
    municipality: "São Raimundo Nonato",
    text: "Arqueologia, paisagem e um Patrimônio Mundial no sudeste do Piauí.",
    detail:
      "Reconhecido pela UNESCO como Patrimônio Mundial, o parque reúne centenas de sítios arqueológicos. O Plano de Uso Público do ICMBio registra 39.614 visitas em 2024; use esse dado como contexto, não como previsão de visitação.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Parque%20Nacional%20Serra%20da%20Capivara%2C%20Sao%20Raimundo%20Nonato%2C%20PI",
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
    detail:
      "Oeiras organiza o recorte histórico-cultural do atlas. Em vez de presumir programação ou serviços, o protótipo direciona a confirmação da visita aos canais institucionais do município.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Centro%20Historico%20de%20Oeiras%2C%20Oeiras%2C%20PI",
    mapQuery: "Centro Histórico de Oeiras, Oeiras",
    sourceName: "Prefeitura Municipal de Oeiras",
    sourceUrl: oeirasUrl,
    sourceYear: "consulta 2026",
    accent: "#A86D32",
  },
  {
    id: "encontro-dos-rios",
    title: "Encontro dos Rios",
    category: "Cidade",
    region: "Polo Teresina",
    municipality: "Teresina",
    text: "Uma porta de entrada urbana entre o Poti e o Parnaíba.",
    detail:
      "O encontro dos rios mantém Teresina como ponto de partida do atlas: um recorte urbano para conectar a capital aos demais percursos do estado.",
    route:
      "https://www.google.com/maps/dir/?api=1&destination=Parque%20Ambiental%20Encontro%20dos%20Rios%2C%20Teresina%2C%20PI",
    mapQuery: "Parque Ambiental Encontro dos Rios, Teresina",
    sourceName: "Visit Brasil · Teresina",
    sourceUrl: teresinaUrl,
    sourceYear: "consulta 2026",
    image: encontroDosRiosImage,
    accent: "#2E6C76",
  },
];
