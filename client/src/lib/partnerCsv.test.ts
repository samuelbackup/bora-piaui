import { describe, expect, it } from "vitest";
import { buildPartnerProposalsCsv, partnerProposalsCsvFilename, type PartnerProposalCsvRecord } from "./partnerCsv";

const proposal: PartnerProposalCsvRecord = {
  businessName: "Ateliê Caju & Sol",
  city: "Teresina",
  category: "Artesanato",
  plan: "destaque",
  editorialStatus: "em_revisao",
  openingHours: "Seg–Sex; 9h–18h",
  createdAt: "2026-08-20T12:00:00.000Z",
};

describe("buildPartnerProposalsCsv", () => {
  it("cria CSV em formato de planilha brasileira com cabeçalhos em português", () => {
    const csv = buildPartnerProposalsCsv([proposal]);

    expect(csv.startsWith("\uFEFFNome do negócio;Cidade;Categoria;Plano;Status editorial;Horário informado;Data de envio\r\n")).toBe(true);
    expect(csv).toContain("Ateliê Caju & Sol;Teresina;Artesanato;destaque;em_revisao");
    expect(csv).toContain('"Seg–Sex; 9h–18h"');
    expect(csv).toContain("20/08/2026");
  });

  it("escapa aspas, ponto e vírgula e quebras de linha", () => {
    const csv = buildPartnerProposalsCsv([{ ...proposal, businessName: 'Casa "Raiz"; Piauí\nCentro' }]);

    expect(csv).toContain('"Casa ""Raiz""; Piauí\nCentro"');
  });

  it("mantém dados pessoais fora da exportação demonstrativa", () => {
    const privateRecord = {
      ...proposal,
      phone: "+55 86 99999-0000",
      address: "Rua das Águas, 123",
      description: "Descrição livre e pessoal da proposta.",
    };
    const csv = buildPartnerProposalsCsv([privateRecord]);

    expect(csv).not.toContain(privateRecord.phone);
    expect(csv).not.toContain(privateRecord.address);
    expect(csv).not.toContain(privateRecord.description);
  });

  it("retorna apenas os cabeçalhos quando não há propostas", () => {
    expect(buildPartnerProposalsCsv([])).toBe("\uFEFFNome do negócio;Cidade;Categoria;Plano;Status editorial;Horário informado;Data de envio\r\n");
  });
});

describe("partnerProposalsCsvFilename", () => {
  it("inclui a data na identificação do arquivo", () => {
    expect(partnerProposalsCsvFilename(new Date("2026-08-20T12:00:00.000Z"))).toBe("propostas-parceiros-bora-piaui-2026-08-20.csv");
  });
});
