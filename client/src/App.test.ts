import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appSource = readFileSync(new URL("./App.tsx", import.meta.url), "utf8");

describe("rotas públicas limitadas", () => {
  it("encaminha áreas fora do Polo Origens para a tela de indisponibilidade", () => {
    ["/patrimonios", "/sabores", "/dados", "/agenda", "/parceiros", "/cidades/:slug", "/admin/editorial"].forEach(path => {
      expect(appSource).toContain(`<Route path="${path}" component={ComingSoonPage} />`);
    });
  });

  it("não importa páginas legadas como rotas públicas ativas", () => {
    ["AdminEditorial", "AgendaPage", "DadosPage", "PartnersPage", "PatrimoniosPage", "SaboresPage"].forEach(page => {
      expect(appSource).not.toContain(`import ${page}`);
    });
  });
});
