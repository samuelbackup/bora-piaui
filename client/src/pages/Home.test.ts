import { describe, expect, it } from "vitest";
import { getAvailablePoles, getPolePreview } from "./Home";

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

  it("prepara uma prévia visual coerente com o polo, o interesse e a busca", () => {
    const previewCatalog = [
      { ...catalog[0], id: "encontro-dos-rios", text: "Porta de entrada urbana.", image: "/encontro.jpg", accent: "#2E6C76" },
      { ...catalog[1], id: "delta-do-parnaiba", text: "Canais e mangues.", image: "/delta.jpg", accent: "#2E6C76" },
      { ...catalog[2], id: "barra-grande", text: "Mar e mangue.", image: undefined, accent: "#D9A640" },
    ];

    expect(getPolePreview(previewCatalog, "Costa do Delta", "Litoral", "Barra")?.id).toBe("barra-grande");
    expect(getPolePreview(previewCatalog, "Polo Teresina", "Todos", "")?.title).toBe("Encontro dos Rios");
    expect(getPolePreview(previewCatalog, null, "Todos", "")).toBeNull();
  });
});
