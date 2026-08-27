import { describe, expect, it } from "vitest";
import { filterGallery, gallery, stories } from "./SaboresPage";

describe("filtro regional de sabores", () => {
  it("mostra somente a Bomba no recorte de Teresina", () => {
    expect(filterGallery("Teresina").map((item) => item.title)).toEqual(["Bomba"]);
  });

  it("mantém somente a Paçoca de carne de sol no recorte do interior e três itens no total", () => {
    expect(filterGallery("Interior e sertões").map((item) => item.title)).toEqual(["Paçoca de carne de sol"]);
    expect(filterGallery("Todos")).toHaveLength(3);
  });

  it("mantém as fontes verificadas e deixa Maria Isabel fora da galeria", () => {
    const cajuinaStory = stories.find((item) => item.title === "Cajuína");
    const cajuinaGallery = gallery.find((item) => item.title === "Cajuína");
    const mariaIsabel = gallery.find((item) => item.title === "Maria Isabel");
    const pacoca = gallery.find((item) => item.title === "Paçoca de carne de sol");

    expect(cajuinaStory?.url).toContain("gov.br/inpi/");
    expect(cajuinaStory?.source).toContain("INPI");
    expect(cajuinaGallery?.url).toBe(cajuinaStory?.url);
    expect(cajuinaGallery?.kind).not.toContain("Iphan");
    expect(mariaIsabel).toBeUndefined();
    expect(pacoca).toMatchObject({ source: "Rede Clube · Receitas do Piauí", url: "https://redeglobo.globo.com/pi/redeclube/receitas-do-piaui/noticia/descubra-o-segredo-da-tradicional-receita-de-pacoca-com-carne-de-sol.ghtml" });
  });
});
