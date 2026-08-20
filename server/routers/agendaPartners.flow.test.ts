import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  createCulturalEvent: vi.fn(),
  createPartnerSubmission: vi.fn(),
  getCulturalEventById: vi.fn(),
  getPartnerSubmissionById: vi.fn(),
  listAllCulturalEvents: vi.fn(),
  listPartnerSubmissions: vi.fn(),
  listPublishedCulturalEvents: vi.fn(),
  updateCulturalEvent: vi.fn(),
  updatePartnerSubmission: vi.fn(),
}));

vi.mock("../db", () => db);

import { agendaRouter, partnersRouter } from "./agendaPartners";

const eventInput = {
  slug: "mostra-cultural-teresina",
  title: "Mostra Cultural de Teresina",
  city: "Teresina",
  category: "Cultura",
  startsAt: "2026-09-12T18:00:00.000Z",
  endsAt: null,
  venue: "Centro de Convenções",
  summary: "Programação cultural confirmada, com período, local e referência registrados para a curadoria editorial.",
  sourceName: "Fonte organizadora",
  sourceUrl: "https://www.gov.br/",
  confirmationStatus: "confirmado" as const,
  published: false,
};

const partnerInput = {
  businessName: "Ateliê Serra Viva",
  city: "São Raimundo Nonato",
  category: "Artesanato",
  phone: "(89) 99999-9999",
  address: "Rua da Pedra, 100",
  openingHours: "Seg–Sáb, 9h–18h",
  description: "Ateliê voltado a peças artesanais autorais que dialogam com técnicas locais e roteiros culturais do território.",
  plan: "destaque" as const,
};

describe("fluxo demonstrativo persistido de agenda e parceiros", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cria evento e persiste sua publicação editorial", async () => {
    const storedEvent = { id: 12, ...eventInput, startsAt: new Date(eventInput.startsAt), endsAt: null };
    db.createCulturalEvent.mockResolvedValue(storedEvent);
    db.getCulturalEventById.mockResolvedValue(storedEvent);
    db.updateCulturalEvent.mockResolvedValue({ ...storedEvent, published: true });
    const caller = agendaRouter.createCaller({} as never);

    await expect(caller.demoCreate(eventInput)).resolves.toMatchObject({ id: 12, title: eventInput.title });
    await expect(caller.demoUpdate({ id: 12, published: true })).resolves.toMatchObject({ published: true });
    expect(db.updateCulturalEvent).toHaveBeenCalledWith(12, expect.objectContaining({ published: true, confirmationStatus: "confirmado" }));
  });

  it("registra proposta pública como pendente e persiste sua revisão", async () => {
    const storedProposal = { id: 44, ...partnerInput, openingHours: partnerInput.openingHours, editorialStatus: "pendente" as const, editorialNotes: null };
    db.createPartnerSubmission.mockResolvedValue(storedProposal);
    db.getPartnerSubmissionById.mockResolvedValue(storedProposal);
    db.updatePartnerSubmission.mockResolvedValue({ ...storedProposal, editorialStatus: "em_revisao" });
    const caller = partnersRouter.createCaller({} as never);

    await expect(caller.submit(partnerInput)).resolves.toMatchObject({ id: 44, editorialStatus: "pendente" });
    await expect(caller.demoUpdateEditorialStatus({ id: 44, editorialStatus: "em_revisao", editorialNotes: null })).resolves.toMatchObject({ editorialStatus: "em_revisao" });
    expect(db.createPartnerSubmission).toHaveBeenCalledWith(expect.objectContaining({ editorialStatus: "pendente", editorialNotes: null }));
    expect(db.updatePartnerSubmission).toHaveBeenCalledWith(44, { editorialStatus: "em_revisao", editorialNotes: null });
  });
});
