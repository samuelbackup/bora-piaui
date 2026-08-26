import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  listCities: vi.fn(),
  getCityBySlug: vi.fn(),
  listCityContent: vi.fn(),
  getItineraryBySlug: vi.fn(),
  getItineraryByCitySlug: vi.fn(),
  listItineraries: vi.fn(),
  getPlaceBySlugAndCity: vi.fn(),
}));

vi.mock("../db", () => db);

import { citiesRouter, cityPlacesRouter, itinerariesRouter } from "./pilotContent";

const cityRow = {
  id: 1,
  slug: "teresina",
  name: "Teresina",
  eyebrow: "Capital e porta de entrada",
  summary: "Uma cidade de rios, encontros e deslocamentos.",
  accent: "#2E6C76",
  sourceName: "Visit Brasil · Teresina",
  sourceUrl: "https://visitbrasil.com/en/location/teresina/",
  sourceVerifiedAt: "Consulta editorial 2026",
  sourceResponsible: null,
  published: true,
};

describe("routers de leitura do domínio cidades-piloto", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cities.list expõe somente cidades publicadas", async () => {
    db.listCities.mockResolvedValue([cityRow]);
    const caller = citiesRouter.createCaller({} as never);
    await expect(caller.list()).resolves.toHaveLength(1);
    expect(db.listCities).toHaveBeenCalledOnce();
  });

  it("cities.getBySlug retorna a cidade encontrada", async () => {
    db.getCityBySlug.mockResolvedValue(cityRow);
    const caller = citiesRouter.createCaller({} as never);
    await expect(caller.getBySlug({ slug: "teresina" })).resolves.toMatchObject({ slug: "teresina", name: "Teresina" });
  });

  it("cities.getBySlug responde NOT_FOUND para slug fora do acervo", async () => {
    db.getCityBySlug.mockResolvedValue(null);
    const caller = citiesRouter.createCaller({} as never);
    await expect(caller.getBySlug({ slug: "cidade-fantasma" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("cityPlaces.listByCity devolve o payload completo de conteúdo", async () => {
    const payload = { places: [], curationTopics: [], editorialHighlights: [], curatedBusinesses: [], proximityRelations: [] };
    db.listCityContent.mockResolvedValue(payload);
    const caller = cityPlacesRouter.createCaller({} as never);
    await expect(caller.listByCity({ citySlug: "teresina" })).resolves.toBe(payload);
    expect(db.listCityContent).toHaveBeenCalledWith("teresina");
  });

  it("itineraries.getBySlug junta roteiro, cidade e paradas ordenadas", async () => {
    const result = { itinerary: { id: 7, slug: "teresina-ponto-de-partida", citySlug: "teresina" }, city: cityRow, stops: [{ externalId: "encontro-dos-rios" }] };
    db.getItineraryBySlug.mockResolvedValue(result);
    const caller = itinerariesRouter.createCaller({} as never);
    await expect(caller.getBySlug({ slug: "teresina-ponto-de-partida" })).resolves.toMatchObject({
      itinerary: { slug: "teresina-ponto-de-partida" },
      stops: [{ externalId: "encontro-dos-rios" }],
    });
  });

  it("itineraries sinaliza NOT_FOUND na ausência e getByCity aceita cidade sem roteiro", async () => {
    db.getItineraryBySlug.mockResolvedValue(null);
    db.getItineraryByCitySlug.mockResolvedValue(null);
    const caller = itinerariesRouter.createCaller({} as never);
    await expect(caller.getBySlug({ slug: "roteiro-inexistente" })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(caller.getByCity({ citySlug: "cajueiro-da-praia" })).resolves.toBeNull();
  });

  it("rejeita slugs que violam os limites de entrada", async () => {
    const caller = citiesRouter.createCaller({} as never);
    await expect(caller.getBySlug({ slug: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("itineraries.list devolve todos os roteiros de um dia", async () => {
    db.listItineraries.mockResolvedValue([{ id: 7, slug: "teresina-ponto-de-partida", cityId: 1 }]);
    const caller = itinerariesRouter.createCaller({} as never);
    await expect(caller.list()).resolves.toHaveLength(1);
  });

  it("cityPlaces.getByCityAndSlug junta local e cidade publicados", async () => {
    const result = { place: { externalId: "theatro-4-de-setembro", editorialStatus: "published" }, city: cityRow };
    db.getPlaceBySlugAndCity.mockResolvedValue(result);
    const caller = cityPlacesRouter.createCaller({} as never);
    await expect(caller.getByCityAndSlug({ citySlug: "teresina", itemSlug: "theatro-4-de-setembro" })).resolves.toMatchObject({
      place: { externalId: "theatro-4-de-setembro" },
      city: { slug: "teresina" },
    });
    expect(db.getPlaceBySlugAndCity).toHaveBeenCalledWith("teresina", "theatro-4-de-setembro");
  });

  it("cityPlaces.getByCityAndSlug responde NOT_FOUND fora do acervo publicado", async () => {
    db.getPlaceBySlugAndCity.mockResolvedValue(null);
    const caller = cityPlacesRouter.createCaller({} as never);
    await expect(caller.getByCityAndSlug({ citySlug: "teresina", itemSlug: "local-fantasma" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
