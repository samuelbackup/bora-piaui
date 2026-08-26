import { describe, expect, it } from "vitest";
import { type PilotCatalog, pilotCatalog } from "../../client/src/lib/mvpPilot";
import {
  assertCatalogIntegrity,
  buildCityRows,
  buildCuratedBusinessRows,
  buildCurationTopicRows,
  buildEditorialHighlightRows,
  buildItineraryRows,
  buildPlaceRows,
} from "./seed";

const resolveCityId = () => 1;

describe("seed do catálogo de cidades-piloto", () => {
  it("valida todas as cidades reais contra o schema de inserção", () => {
    const rows = buildCityRows();
    expect(rows.map(row => row.slug)).toEqual([
      "teresina",
      "cajueiro-da-praia",
      "sao-raimundo-nonato",
    ]);
    for (const row of rows) {
      expect(row.sourceUrl).toMatch(/^https:/);
    }
  });

  it("converte os locais preservando fonte, imagem e status editorial", () => {
    const rows = buildPlaceRows(resolveCityId);
    expect(rows).toHaveLength(11);
    const theatro = rows.find(
      row => row.externalId === "theatro-4-de-setembro"
    );
    expect(theatro).toMatchObject({
      slug: "theatro-4-de-setembro",
      kind: "attraction",
      operationalStatus: "verify",
      editorialStatus: "published",
      cityId: 1,
    });
    expect(theatro?.image?.credit).toContain("Wikimedia Commons");
    expect(theatro?.sourceName).toBe(
      "Mapa da Cultura do Piauí · Theatro 4 de Setembro"
    );
    expect(rows.every(row => row.sourceUrl.startsWith("https:"))).toBe(true);
  });

  it("converte negócios curados, roteiros, tópicos e destaques sem divergência de tipos", () => {
    expect(buildCuratedBusinessRows(resolveCityId)).toHaveLength(1);
    expect(buildItineraryRows(resolveCityId)).toHaveLength(3);
    expect(buildCurationTopicRows(resolveCityId)).toHaveLength(6);
    expect(buildEditorialHighlightRows(resolveCityId)).toHaveLength(6);
    expect(buildCuratedBusinessRows(resolveCityId)[0].externalId).toBe(
      "icmbio-atendimento-serra"
    );
  });

  it("confere integridade referencial do catálogo oficial", () => {
    expect(() => assertCatalogIntegrity()).not.toThrow();
  });

  it("detecta referências quebradas no catálogo", () => {
    const broken: PilotCatalog = {
      ...structuredClone(pilotCatalog),
      itineraries: [
        {
          slug: "quebrado",
          citySlug: "teresina",
          dayScope: "one-day" as const,
          title: "Roteiro quebrado",
          durationLabel: "Teste",
          summary: "Resumo suficientemente longo para validar.",
          confirmationNotice: "Aviso suficientemente longo para validar.",
          stopIds: ["local-inexistente"],
        },
      ],
    };
    expect(() => assertCatalogIntegrity(broken)).toThrow(/local-inexistente/);
  });
});
