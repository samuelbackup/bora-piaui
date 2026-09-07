import { describe, expect, it } from "vitest";
import { immaterial, material } from "./PatrimoniosPage";

describe("imagens dos patrimônios materiais", () => {
  it("mantém uma imagem licenciada, crédito e fonte para cada cartão", () => {
    expect(material).toHaveLength(4);

    material.forEach((item) => {
      expect(item.image.url).toMatch(/^\/manus-storage\//);
      expect(item.image.alt.length).toBeGreaterThan(20);
      expect(item.image.credit).toContain("Wikimedia Commons");
      expect(item.image.license).toMatch(/^CC BY/);
      expect(item.image.licenseUrl).toContain("creativecommons.org");
      expect(item.image.sourceUrl).toContain("commons.wikimedia.org");
    });
  });
});

describe("Cajuína em patrimônios imateriais", () => {
  it("preserva a referência atual do Iphan, independente da curadoria de Sabores", () => {
    expect(immaterial.find((item) => item.title.startsWith("Cajuína"))).toMatchObject({
      source: "Iphan · Patrimônio Imaterial",
      url: "https://www.gov.br/iphan/pt-br/superintendencias/piaui/patrimonio-imaterial",
    });
  });
});
