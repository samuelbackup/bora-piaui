import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const partnersPageSource = readFileSync(new URL("./PartnersPage.tsx", import.meta.url), "utf8");

describe("plano Mais visibilidade", () => {
  it("apresenta uma precificação mensal de referência sem habilitar cobrança", () => {
    expect(partnersPageSource).toContain("R$ 49");
    expect(partnersPageSource).toContain("/mês");
    expect(partnersPageSource).toContain("Valor de referência para o MVP; não há cobrança neste protótipo.");
  });
});
