import { describe, expect, it } from "vitest";
import { filterGallery } from "./SaboresPage";

describe("filtro regional de sabores", () => {
  it("mostra somente a Bomba no recorte de Teresina", () => {
    expect(filterGallery("Teresina").map((item) => item.title)).toEqual(["Bomba"]);
  });

  it("mantém os dois recortes do interior e todos os itens sem filtro", () => {
    expect(filterGallery("Interior e sertões")).toHaveLength(2);
    expect(filterGallery("Todos")).toHaveLength(4);
  });
});
