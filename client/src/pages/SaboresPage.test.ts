import { describe, expect, it } from "vitest";
import { filterGallery, gallery, stories } from "./SaboresPage";

describe("filtro regional de sabores", () => {
  it("mostra somente a Bomba no recorte de Teresina", () => {
    expect(filterGallery("Teresina").map((item) => item.title)).toEqual(["Bomba"]);
  });

  it("restaura Maria Isabel no recorte do interior e mantém quatro itens no total", () => {
    expect(filterGallery("Interior e sertões").map((item) => item.title)).toEqual(["Maria Isabel", "Paçoca de carne de sol"]);
    expect(filterGallery("Todos")).toHaveLength(4);
  });

  it("mantém fontes verificadas e exibe Maria Isabel com contexto limitado ao preparo publicado", () => {
    const cajuinaStory = stories.find((item) => item.title === "Cajuína");
    const cajuinaGallery = gallery.find((item) => item.title === "Cajuína");
    const mariaIsabel = gallery.find((item) => item.title === "Maria Isabel");
    const pacoca = gallery.find((item) => item.title === "Paçoca de carne de sol");

    expect(cajuinaStory?.url).toContain("gov.br/inpi/");
    expect(cajuinaStory?.source).toContain("INPI");
    expect(cajuinaGallery?.url).toBe(cajuinaStory?.url);
    expect(cajuinaGallery?.kind).not.toContain("Iphan");
    expect(mariaIsabel).toMatchObject({
      kind: "Leitura de preparo",
      source: "g1 Piauí · reportagem e receita",
      url: "https://g1.globo.com/pi/piaui/noticia/2024/01/11/maria-isabel-prato-tipico-do-piaui-e-declarado-patrimonio-cultural.ghtml",
    });
    expect(mariaIsabel?.description).toContain("arroz cozido");
    expect(mariaIsabel?.description).toContain("não atribui origem exclusiva");
    expect(pacoca).toMatchObject({ source: "Rede Clube · Receitas do Piauí", url: "https://redeglobo.globo.com/pi/redeclube/receitas-do-piaui/noticia/descubra-o-segredo-da-tradicional-receita-de-pacoca-com-carne-de-sol.ghtml" });
  });
});
