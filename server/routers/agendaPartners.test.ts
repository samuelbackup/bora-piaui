import { afterEach, describe, expect, it, vi } from "vitest";
import { culturalEventFields, partnerSubmissionFields } from "./agendaPartners";

const validEvent = {
  slug: "mostra-cultural-teresina",
  title: "Mostra Cultural de Teresina",
  city: "Teresina",
  category: "Cultura",
  startsAt: "2026-09-12T18:00:00.000Z",
  endsAt: "2026-09-13T02:00:00.000Z",
  venue: "Centro de Convenções",
  summary: "Programação cultural com período, local e referência editorial suficientes para a etapa de curadoria.",
  sourceName: "Fonte organizadora",
  sourceUrl: "https://www.gov.br/",
  confirmationStatus: "confirmado" as const,
  published: true,
};

describe("camada editorial de agenda e parceiros", () => {
  it("aceita evento cultural confirmado com fonte rastreável", () => {
    expect(culturalEventFields.parse(validEvent)).toMatchObject(validEvent);
  });

  it("aceita programação de um dia sem data de término", () => {
    expect(culturalEventFields.parse({ ...validEvent, endsAt: null })).toMatchObject({ endsAt: null });
  });

  it("rejeita evento sem URL de fonte", () => {
    expect(() => culturalEventFields.parse({ ...validEvent, sourceUrl: "sem-fonte" })).toThrow();
  });

  it("rejeita fontes com esquemas perigosos em qualquer ambiente", () => {
    expect(() => culturalEventFields.parse({ ...validEvent, sourceUrl: "javascript:alert(1)" })).toThrow();
    expect(() => culturalEventFields.parse({ ...validEvent, sourceUrl: "data:text/html;base64,PGI+" })).toThrow();
  });

  it("aceita http apenas fora de produção", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => culturalEventFields.parse({ ...validEvent, sourceUrl: "http://www.gov.br/" })).toThrow();

    vi.stubEnv("NODE_ENV", "development");
    expect(culturalEventFields.parse({ ...validEvent, sourceUrl: "http://www.gov.br/" }).sourceUrl).toBe("http://www.gov.br/");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("aceita proposta de parceiro e mantém o plano escolhido", () => {
    const proposal = partnerSubmissionFields.parse({
      businessName: "Ateliê Serra Viva",
      city: "São Raimundo Nonato",
      category: "Artesanato",
      phone: "(89) 99999-9999",
      address: "Rua da Pedra, 100",
      openingHours: "Seg–Sáb, 9h–18h",
      description: "Ateliê voltado a peças artesanais autorais que dialogam com técnicas locais e roteiros culturais do território.",
      plan: "destaque",
    });
    expect(proposal.plan).toBe("destaque");
  });

  it("rejeita proposta curta sem contexto suficiente para revisão", () => {
    expect(() => partnerSubmissionFields.parse({
      businessName: "Loja",
      city: "Teresina",
      category: "Artesanato",
      phone: "999999999",
      address: "Rua A, 1",
      description: "Pouco texto",
      plan: "gratuito",
    })).toThrow();
  });
});
