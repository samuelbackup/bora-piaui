import { describe, expect, it } from "vitest";
import { getPilotCategories, getPilotCity, getPilotItems, loadPilotCatalog } from "./mvpPilot";

describe("catálogo do MVP de front-end", () => {
  it("mantém três cidades-piloto com identificadores estáveis", () => {
    expect(getPilotCity("teresina")?.name).toBe("Teresina");
    expect(getPilotCity("cajueiro-da-praia")?.name).toBe("Cajueiro da Praia");
    expect(getPilotCity("sao-raimundo-nonato")?.name).toBe("São Raimundo Nonato");
  });

  it("não inventa negócios quando ainda não há registros validados", () => {
    expect(getPilotItems("teresina", "business")).toEqual([]);
  });

  it("expõe categorias a partir dos itens publicados da cidade", () => {
    expect(getPilotCategories("sao-raimundo-nonato")).toEqual(["Patrimônio"]);
  });

  it("expõe um adaptador assíncrono local e o contato institucional confirmado", async () => {
    const catalog = await loadPilotCatalog();
    const serra = catalog.items.find((item) => item.id === "serra-da-capivara");

    expect(serra?.contactUrl).toBe("https://www.gov.br/icmbio/pt-br/canais_atendimento");
  });
});
