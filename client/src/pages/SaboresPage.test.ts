import { describe, expect, it } from "vitest";
import { filterGallery, gallery, stories } from "./SaboresPage";

describe("filtro regional de sabores", () => {
  it("mostra somente a Bomba no recorte de Teresina", () => {
    expect(filterGallery("Teresina").map((item) => item.title)).toEqual(["Bomba"]);
  });

  it("mantém os dois recortes do interior e todos os itens sem filtro", () => {
    expect(filterGallery("Interior e sertões")).toHaveLength(2);
    expect(filterGallery("Todos")).toHaveLength(4);
  });

  it("mantém fontes públicas distintas para Cajuína, Maria Isabel e Paçoca de carne de sol", () => {
    const cajuinaStory = stories.find((item) => item.title === "Cajuína");
    const cajuinaGallery = gallery.find((item) => item.title === "Cajuína");
    const mariaIsabel = gallery.find((item) => item.title === "Maria Isabel");
    const pacoca = gallery.find((item) => item.title === "Paçoca de carne de sol");

    expect(cajuinaStory?.url).toContain("gov.br/inpi/");
    expect(cajuinaStory?.source).toContain("INPI");
    expect(cajuinaGallery?.url).toBe(cajuinaStory?.url);
    expect(cajuinaGallery?.kind).not.toContain("Iphan");
    expect(mariaIsabel).toMatchObject({ source: "Alepi · Lei nº 8.279/2024", url: "https://sapl.al.pi.leg.br/norma/5996" });
    expect(pacoca).toMatchObject({ source: "Rede Clube · Receitas do Piauí", url: "https://redeglobo.globo.com/pi/redeclube/receitas-do-piaui/noticia/descubra-o-segredo-da-tradicional-receita-de-pacoca-com-carne-de-sol.ghtml" });
  });
});
