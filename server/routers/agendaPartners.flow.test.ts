import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  createCulturalEvent: vi.fn(),
  createPartnerSubmission: vi.fn(),
  getCulturalEventById: vi.fn(),
  getPartnerSubmissionById: vi.fn(),
  listAllCulturalEvents: vi.fn(),
  listPartnerSubmissions: vi.fn(),
  listPublishedCulturalEvents: vi.fn(),
  removeCulturalEvent: vi.fn(),
  updateCulturalEvent: vi.fn(),
  updatePartnerSubmission: vi.fn(),
}));

vi.mock("../db", () => db);

import { agendaRouter, partnersRouter } from "./agendaPartners";

const anonymousContext = { user: null } as never;
const memberContext = { user: { role: "user" } } as never;
const adminContext = { user: { role: "admin" } } as never;

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

describe("fluxo editorial administrativo de agenda e parceiros", () => {
  beforeEach(() => vi.clearAllMocks());

  it("nega ao visitante e ao usuário comum toda escrita e leitura editorial interna", async () => {
    const anonymousAgenda = agendaRouter.createCaller(anonymousContext);
    const memberAgenda = agendaRouter.createCaller(memberContext);
    const anonymousPartners = partnersRouter.createCaller(anonymousContext);
    const memberPartners = partnersRouter.createCaller(memberContext);

    await expect(anonymousAgenda.demoList()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(memberAgenda.demoCreate(eventInput)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(anonymousAgenda.demoUpdate({ id: 12, published: true })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(memberAgenda.demoDelete({ id: 12 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(anonymousPartners.demoList()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(memberPartners.demoUpdateEditorialStatus({ id: 44, editorialStatus: "em_revisao", editorialNotes: null })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("permite que administrador crie evento e persista sua publicação editorial", async () => {
    const storedEvent = { id: 12, ...eventInput, startsAt: new Date(eventInput.startsAt), endsAt: null };
    db.createCulturalEvent.mockResolvedValue(storedEvent);
    db.getCulturalEventById.mockResolvedValue(storedEvent);
    db.updateCulturalEvent.mockResolvedValue({ ...storedEvent, published: true });
    const caller = agendaRouter.createCaller(adminContext);

    await expect(caller.create(eventInput)).resolves.toMatchObject({ id: 12, title: eventInput.title });
    await expect(caller.update({ id: 12, published: true })).resolves.toMatchObject({ published: true });
    expect(db.updateCulturalEvent).toHaveBeenCalledWith(12, expect.objectContaining({ published: true, confirmationStatus: "confirmado" }));
  });

  it("preserva período de vários dias e rejeita término anterior ao início", async () => {
    const storedEvent = { id: 13, ...eventInput, startsAt: new Date(eventInput.startsAt), endsAt: new Date("2026-09-14T18:00:00.000Z") };
    db.createCulturalEvent.mockResolvedValue(storedEvent);
    const caller = agendaRouter.createCaller(adminContext);

    await expect(caller.create({ ...eventInput, endsAt: "2026-09-14T18:00:00.000Z" })).resolves.toMatchObject({ id: 13 });
    await expect(caller.create({ ...eventInput, endsAt: "2026-09-11T18:00:00.000Z" })).rejects.toMatchObject({ message: "A data de término precisa ser posterior à data de início." });
  });

  it("remove evento persistido e informa quando o registro não existe", async () => {
    const storedEvent = { id: 12, ...eventInput, startsAt: new Date(eventInput.startsAt), endsAt: null };
    db.removeCulturalEvent.mockResolvedValue(storedEvent);
    const caller = agendaRouter.createCaller(adminContext);

    await expect(caller.delete({ id: 12 })).resolves.toMatchObject({ id: 12, title: eventInput.title });
    expect(db.removeCulturalEvent).toHaveBeenCalledWith(12);

    db.removeCulturalEvent.mockResolvedValue(null);
    await expect(caller.delete({ id: 999 })).rejects.toMatchObject({ message: "Evento não encontrado." });
  });

  it("registra proposta pública como pendente e persiste sua revisão", async () => {
    const storedProposal = { id: 44, ...partnerInput, openingHours: partnerInput.openingHours, editorialStatus: "pendente" as const, editorialNotes: null };
    db.createPartnerSubmission.mockResolvedValue(storedProposal);
    db.getPartnerSubmissionById.mockResolvedValue(storedProposal);
    db.updatePartnerSubmission.mockResolvedValue({ ...storedProposal, editorialStatus: "em_revisao" });
    const caller = partnersRouter.createCaller(adminContext);

    await expect(caller.submit(partnerInput)).resolves.toMatchObject({ id: 44, editorialStatus: "pendente" });
    await expect(caller.updateEditorialStatus({ id: 44, editorialStatus: "em_revisao", editorialNotes: null })).resolves.toMatchObject({ editorialStatus: "em_revisao" });
    expect(db.createPartnerSubmission).toHaveBeenCalledWith(expect.objectContaining({ editorialStatus: "pendente", editorialNotes: null }));
    expect(db.updatePartnerSubmission).toHaveBeenCalledWith(44, { editorialStatus: "em_revisao", editorialNotes: null });
  });
});
