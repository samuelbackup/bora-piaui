import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getAvailablePoles, getPolePreview } from "./Home";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

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

  it("concentra a navegação em um menu acessível também no desktop", () => {
    expect(homeSource).toContain('aria-controls="home-navigation-menu"');
    expect(homeSource).toContain("aria-expanded={menuOpen}");
    expect(homeSource).toContain('aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}');
    expect(homeSource).toContain("lg:grid-cols-3");
    expect(homeSource).not.toContain('hidden items-center gap-5 text-xs font-bold lg:flex');
  });

  it("mantém as rotas públicas disponíveis dentro do menu recolhido", () => {
    ["Explorar destinos", "Cidades-piloto", "Patrimônios", "Sabores", "Agenda cultural", "Dados oficiais", "Mapa do estado", "Como funciona", "Seja parceiro", "Painel demonstrativo"].forEach((label) => {
      expect(homeSource).toContain(label);
    });
  });

  it("mantém o acesso ao feedback ao lado do roteiro", () => {
    expect(homeSource).toContain('href="/feedback"');
    expect(homeSource).toContain('aria-label="Enviar feedback"');
    expect(homeSource).toContain("Feedback");
    expect(homeSource.indexOf("Meu roteiro")).toBeLessThan(homeSource.indexOf('href="/feedback"'));
  });

  it("oferece feedback contextual em cada cartão de destino", () => {
    expect(homeSource).toContain("openPlaceFeedback(place)");
    expect(homeSource).toContain("Enviar feedback sobre ${place.title}");
    expect(homeSource).toContain("Feedback contextual");
    expect(homeSource).toContain("Sobre {feedbackPlace.title}");
    expect(homeSource).toContain('name="feedbackType"');
    expect(homeSource).toContain('name="feedbackMessage"');
    expect(homeSource).toContain("minLength={10}");
    expect(homeSource).toContain("O envio é armazenado sem identificação pessoal.");
    expect(homeSource).toContain("trpc.feedbacks.submit.useMutation");
    expect(homeSource).toContain("destinationSlug: feedbackPlace.id");
  });

  it("oferece uma alternância persistente de modo escuro no menu compacto", () => {
    expect(homeSource).toContain('role="switch"');
    expect(homeSource).toContain('aria-checked={theme === "dark"}');
    expect(homeSource).toContain('"Ativar modo escuro"');
    expect(homeSource).toContain("toggleTheme?.()");
  });
});
