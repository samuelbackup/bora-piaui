import { describe, expect, it } from "vitest";
import { destinationFields } from "./destinations";

const validDestination = {
  slug: "rota-da-caatinga",
  title: "Rota da Caatinga",
  polo: "Nascentes",
  category: "Natureza",
  municipality: "Caracol",
  summary: "Uma síntese editorial suficiente para orientar a descoberta inicial do destino.",
  description: "Uma descrição editorial suficientemente longa para representar o destino, suas referências territoriais e os cuidados de planejamento necessários para a visita.",
  mapQuery: "Caracol, Piauí",
  routeUrl: "https://www.google.com/maps/dir/?api=1&destination=Caracol%2CPI",
  sourceName: "Fonte institucional",
  sourceUrl: "https://www.gov.br/",
  sourceYear: "consulta 2026",
  operationalStatus: "verificar" as const,
  published: false,
};

describe("destinationFields", () => {
  it("aceita uma ficha editorial com informações operacionais pendentes", () => {
    expect(destinationFields.parse(validDestination)).toMatchObject(validDestination);
  });

  it("rejeita slug com caracteres fora do padrão público", () => {
    expect(() => destinationFields.parse({ ...validDestination, slug: "Rota da Caatinga" })).toThrow();
  });

  it("rejeita URLs operacionais inválidas", () => {
    expect(() => destinationFields.parse({ ...validDestination, routeUrl: "rota-local" })).toThrow();
  });
});
