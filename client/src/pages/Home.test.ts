import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("home do Polo Origens", () => {
  it("comunica apenas o recorte territorial aprovado", () => {
    expect(homeSource).toContain("Polo Origens");
    expect(homeSource).toContain("São Raimundo Nonato");
    expect(homeSource).toContain("Coronel José Dias");
    expect(homeSource).not.toContain("Um estado inteiro de caminhos");
    expect(homeSource).not.toContain("três cidades-piloto");
    expect(homeSource).not.toContain("Nove âncoras");
  });

  it("não expõe menus, monetização ou painel editorial na experiência pública", () => {
    ["Patrimônios", "Sabores", "Agenda cultural", "Dados oficiais", "Seja parceiro", "Painel demonstrativo", "R$ 49"].forEach(label => {
      expect(homeSource).not.toContain(label);
    });
    expect(homeSource).toContain("Em breve");
  });

  it("evita mídia quebrada e mantém fontes institucionais acessíveis", () => {
    expect(homeSource).not.toContain("<img");
    expect(homeSource).not.toContain("NO IMAGE AVAILABLE");
    expect(homeSource).toContain("whc.unesco.org");
    expect(homeSource).toContain("fumdham.org.br");
  });

  it("preserva o menu compacto acessível e a alternância de tema", () => {
    expect(homeSource).toContain('aria-controls="home-navigation-menu"');
    expect(homeSource).toContain("aria-expanded={menuOpen}");
    expect(homeSource).toContain('role="switch"');
    expect(homeSource).toContain('aria-checked={theme === "dark"}');
    expect(homeSource).toContain("toggleTheme?.()");
  });
});
