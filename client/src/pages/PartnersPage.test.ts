import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const partnersPageSource = readFileSync(new URL("./PartnersPage.tsx", import.meta.url), "utf8");

describe("página de parceiros em pausa", () => {
  it("não apresenta preço, pagamento ou formulário de proposta", () => {
    expect(partnersPageSource).not.toContain("R$ 49");
    expect(partnersPageSource).not.toContain("/mês");
    expect(partnersPageSource).not.toContain("trpc");
    expect(partnersPageSource).toContain("ComingSoonPage");
  });
});
