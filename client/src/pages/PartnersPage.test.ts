import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const partnersPageSource = readFileSync(
  new URL("./PartnersPage.tsx", import.meta.url),
  "utf8"
);

describe("plano Mais visibilidade", () => {
  it("mantém a proposta editorial sem expor preço ou cobrança", () => {
    expect(partnersPageSource).not.toContain("R$ 49");
    expect(partnersPageSource).not.toContain("/mês");
    expect(partnersPageSource).toContain(
      "Benefícios e condições futuras serão definidos somente após a validação de uso do projeto."
    );
  });
});
