import { describe, expect, it } from "vitest";
import { getPilotCategories, getPilotCity, getPilotCurationTopics, getPilotCuratedBusinesses, getPilotItems, getPilotNearbyItems, loadPilotCatalog } from "./mvpPilot";

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

  it("não inventa negócios quando ainda não há registros validados", () => {
    expect(getPilotItems("teresina", "business")).toEqual([]);
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
