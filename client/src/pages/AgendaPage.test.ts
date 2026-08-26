import { describe, expect, it } from "vitest";
import { filterAgendaEvents } from "./AgendaPage";

const events = [
  {
    id: 1,
    title: "Mostra",
    city: "Teresina",
    category: "Cultura",
    startsAt: new Date("2026-09-12T12:00:00"),
    endsAt: null,
    venue: "Centro",
    summary: "Resumo de evento cultural confirmado.",
    sourceName: "Fonte",
    sourceUrl: "https://example.org",
  },
  {
    id: 2,
    title: "Feira",
    city: "Parnaíba",
    category: "Gastronomia",
    startsAt: new Date("2026-10-10T12:00:00"),
    endsAt: null,
    venue: "Porto",
    summary: "Resumo de feira gastronômica confirmada.",
    sourceName: "Fonte",
    sourceUrl: "https://example.org",
  },
];

describe("filtros da agenda cultural", () => {
  it("mantém todos os eventos quando não há filtro", () => {
    expect(filterAgendaEvents(events, "Todos", "Todos", "Todos")).toHaveLength(
      2
    );
  });

  it("combina cidade, categoria e mês", () => {
    expect(
      filterAgendaEvents(events, "Teresina", "Cultura", "2026-09").map(
        event => event.title
      )
    ).toEqual(["Mostra"]);
    expect(
      filterAgendaEvents(events, "Teresina", "Gastronomia", "Todos")
    ).toHaveLength(0);
  });
});
