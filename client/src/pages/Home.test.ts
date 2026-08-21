import { describe, expect, it } from "vitest";
import { getAvailablePoles } from "./Home";

describe("acessos territoriais da descoberta", () => {
  const catalog = [
    { region: "Polo Teresina", category: "Cidade", title: "Encontro dos Rios", municipality: "Teresina" },
    { region: "Costa do Delta", category: "Litoral", title: "Delta do Parnaíba", municipality: "Ilha Grande" },
    { region: "Costa do Delta", category: "Litoral", title: "Barra Grande", municipality: "Cajueiro da Praia" },
  ] as const;

  it("exibe polos sem duplicar o seletor geral e informa suas contagens", () => {
    expect(getAvailablePoles([...catalog], "Todos", "")).toEqual([
      { region: "Polo Teresina", total: 1 },
      { region: "Costa do Delta", total: 2 },
    ]);
  });

  it("mantém somente os polos coerentes com o interesse e a busca", () => {
    expect(getAvailablePoles([...catalog], "Litoral", "Barra")).toEqual([
      { region: "Costa do Delta", total: 1 },
    ]);
  });
});
