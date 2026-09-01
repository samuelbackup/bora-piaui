import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  createFeedback: vi.fn(),
  getFeedbackById: vi.fn(),
  listFeedbacks: vi.fn(),
  markFeedbackRead: vi.fn(),
}));

vi.mock("../db", () => dbMocks);

import { feedbacksRouter } from "./feedbacks";

const makeContext = (user: { role: "admin" | "user" } | null, ip: string) => ({
  req: {
    headers: { "x-forwarded-for": ip },
    socket: { remoteAddress: ip },
  },
  res: {},
  user,
});

describe("procedures de feedbacks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submete feedback contextual sem PII e encaminha os campos persistíveis ao helper", async () => {
    dbMocks.createFeedback.mockResolvedValue({ id: 41 });
    const caller = feedbacksRouter.createCaller(makeContext(null, "198.51.100.41"));

    await expect(caller.submit({
      category: "sugestao",
      message: "Seria útil explicar melhor a relação com o entorno.",
      destinationSlug: "encontro-dos-rios",
      destinationName: "Encontro dos Rios",
    })).resolves.toEqual({ success: true, id: 41 });

    expect(dbMocks.createFeedback).toHaveBeenCalledWith({
      category: "sugestao",
      message: "Seria útil explicar melhor a relação com o entorno.",
      rating: null,
      destinationSlug: "encontro-dos-rios",
      destinationName: "Encontro dos Rios",
      isRead: false,
    });
  });

  it("bloqueia listagem e marcação para usuários anônimos e não administradores", async () => {
    const anonymousCaller = feedbacksRouter.createCaller(makeContext(null, "198.51.100.42"));
    const userCaller = feedbacksRouter.createCaller(makeContext({ role: "user" }, "198.51.100.43"));

    await expect(anonymousCaller.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(userCaller.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(userCaller.markRead({ id: 1, isRead: true })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(dbMocks.listFeedbacks).not.toHaveBeenCalled();
    expect(dbMocks.markFeedbackRead).not.toHaveBeenCalled();
  });

  it("lista e atualiza o status somente no contexto admin", async () => {
    const rows = [{ id: 41, category: "sugestao", message: "Mensagem persistida", isRead: false }];
    dbMocks.listFeedbacks.mockResolvedValue(rows);
    dbMocks.getFeedbackById.mockResolvedValue(rows[0]);
    dbMocks.markFeedbackRead.mockResolvedValue({ ...rows[0], isRead: true });
    const caller = feedbacksRouter.createCaller(makeContext({ role: "admin" }, "198.51.100.44"));

    await expect(caller.adminList()).resolves.toEqual(rows);
    await expect(caller.markRead({ id: 41, isRead: true })).resolves.toEqual({ ...rows[0], isRead: true });
    expect(dbMocks.getFeedbackById).toHaveBeenCalledWith(41);
    expect(dbMocks.markFeedbackRead).toHaveBeenCalledWith(41, true);
  });
});
