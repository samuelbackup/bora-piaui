import { describe, expect, it } from "vitest";
import { getPilotCategories, getPilotCity, getPilotCurationTopics, getPilotCuratedBusinesses, getPilotEditorialHighlights, getPilotFoodOptions, getPilotItems, getPilotNearbyItems, loadPilotCatalog } from "./mvpPilot";

describe("catálogo do MVP de front-end", () => {
  it("mantém três cidades-piloto com identificadores estáveis", () => {
    expect(getPilotCity("teresina")?.name).toBe("Teresina");
    expect(getPilotCity("cajueiro-da-praia")?.name).toBe("Cajueiro da Praia");
    expect(getPilotCity("sao-raimundo-nonato")?.name).toBe("São Raimundo Nonato");
  });

  it("fornece os três destinos e slugs que alimentam a navegação contextual", async () => {
    const catalog = await loadPilotCatalog();

    expect(catalog.cities.map((city) => city.slug)).toEqual([
      "teresina",
      "cajueiro-da-praia",
      "sao-raimundo-nonato",
    ]);
  });

  it("oferece Cultura e História para as três leituras editoriais com fontes verificáveis", () => {
    const expectedCultureSources = {
      teresina: "Presidência da República · G20 Brasil · Teresina - PI",
      "cajueiro-da-praia": "Prefeitura de Cajueiro da Praia · História e atrações",
      "sao-raimundo-nonato": "UNESCO · Parque Nacional Serra da Capivara",
    };

    for (const [citySlug, cultureSource] of Object.entries(expectedCultureSources)) {
      const highlights = getPilotEditorialHighlights(citySlug);
      expect(highlights.map((entry) => entry.title)).toEqual(["Cultura", "História"]);
      expect(highlights.every((entry) => entry.source.url.startsWith("https://"))).toBe(true);
      expect(highlights.find((entry) => entry.title === "Cultura")?.source.name).toBe(cultureSource);
    }

    const saoRaimundoHistory = getPilotEditorialHighlights("sao-raimundo-nonato").find((entry) => entry.title === "História");
    expect(saoRaimundoHistory?.source.name).toBe("Prefeitura de São Raimundo Nonato · Histórico da cidade");
    expect(saoRaimundoHistory?.source.url).toContain("saoraimundononato.pi.gov.br");
  });

  it("não inventa negócios quando ainda não há registros validados", () => {
    expect(getPilotItems("teresina", "business")).toEqual([]);
    expect(getPilotFoodOptions("teresina", "theatro-4-de-setembro")).toEqual([]);
  });

  it("amplia Teresina com cinco atrativos institucionais, rotas e fontes verificáveis", () => {
    const teresinaItems = getPilotItems("teresina", "attraction");
    const addedItems = teresinaItems.filter((item) => [
      "Complexo Turístico Ponte Estaiada",
      "Theatro 4 de Setembro",
      "Museu do Piauí – Casa de Odilon Nunes",
      "Parque Potycabana",
      "Central de Artesanato Mestre Dezinho",
    ].includes(item.title));

    expect(addedItems).toHaveLength(5);
    expect(addedItems.every((item) => item.operationalStatus === "verify")).toBe(true);
    expect(addedItems.every((item) => item.routeUrl?.startsWith("https://www.google.com/maps/dir/"))).toBe(true);
    expect(addedItems.every((item) => item.source.url.startsWith("https://"))).toBe(true);
  });

  it("expõe categorias a partir dos itens publicados da cidade", () => {
    expect(getPilotCategories("sao-raimundo-nonato")).toEqual(["Memória e arqueologia", "Patrimônio"]);
  });

  it("expõe um adaptador assíncrono local e o contato institucional confirmado", async () => {
    const catalog = await loadPilotCatalog();
    const serra = catalog.items.find((item) => item.id === "serra-da-capivara");

    expect(serra?.contactUrl).toBe("https://www.gov.br/icmbio/pt-br/canais_atendimento");
  });

  it("mantém relações editoriais de proximidade com fonte para a âncora visitada", () => {
    const nearby = getPilotNearbyItems("encontro-dos-rios");

    expect(nearby).toHaveLength(1);
    expect(nearby[0]?.item.title).toBe("Polo Cerâmico do Poti Velho");
    expect(nearby[0]?.relation.source.url).toContain("semdec.pmt.pi.gov.br");
  });

  it("expõe relações próximas publicadas em todas as cidades-piloto", () => {
    expect(getPilotNearbyItems("barra-grande")[0]?.item.title).toBe("Cajueiro-rei do Piauí");
    expect(getPilotNearbyItems("serra-da-capivara")[0]?.item.title).toBe("Museu do Homem Americano");
  });

  it("mantém gastronomia e serviços como curadoria transparente sem inventar negócios", () => {
    expect(getPilotCurationTopics("cajueiro-da-praia")).toHaveLength(2);
    expect(getPilotItems("cajueiro-da-praia", "business")).toEqual([]);
  });

  it("expõe somente serviços curados com contato e fonte publicados", () => {
    expect(getPilotCuratedBusinesses("sao-raimundo-nonato", "restaurant")).toEqual([]);
    const services = getPilotCuratedBusinesses("sao-raimundo-nonato", "service");

    expect(services).toHaveLength(1);
    expect(services[0]?.title).toBe("Canais de atendimento do ICMBio");
    expect(services[0]?.contactUrl).toBe("https://www.gov.br/icmbio/pt-br/canais_atendimento");
    expect(services[0]?.source.url).toContain("gov.br/icmbio");
  });
});
