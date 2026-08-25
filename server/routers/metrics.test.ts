import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  getUsageMetrics: vi.fn(),
  recordUsageEvent: vi.fn(),
}));

vi.mock("../db", () => db);

import { metricsRouter } from "./metrics";

const validEvent = {
  eventName: "route_opened" as const,
  sessionId: "ae6dd405-2372-4c48-8b95-cda152691cb8",
  citySlug: "teresina",
  itemId: "theatro-4-de-setembro",
  source: "city_card",
};

describe("métricas de uso minimizadas", () => {
  beforeEach(() => vi.clearAllMocks());

  it("persiste somente o evento permitido com identificadores curtos", async () => {
    db.recordUsageEvent.mockResolvedValue({ success: true });
    const caller = metricsRouter.createCaller({} as never);

    await expect(caller.track(validEvent)).resolves.toEqual({ success: true });
    expect(db.recordUsageEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventName: "route_opened",
      citySlug: "teresina",
      itemId: "theatro-4-de-setembro",
      source: "city_card",
      createdAt: expect.any(Date),
    }));
  });

  it("rejeita texto livre e nomes de evento não permitidos", async () => {
    const caller = metricsRouter.createCaller({} as never);

    await expect(caller.track({ ...validEvent, source: "Rua com dados pessoais" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.track({ ...validEvent, eventName: "feedback" as never })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(db.recordUsageEvent).not.toHaveBeenCalled();
  });

  it("permite leitura agregada apenas para administradores", async () => {
    db.getUsageMetrics.mockResolvedValue({ totalEvents: 7, foodContextOpens: 2, routeOpens: 3, topCities: [], topItems: [] });
    const adminCaller = metricsRouter.createCaller({ user: { role: "admin" } } as never);
    const publicCaller = metricsRouter.createCaller({} as never);

    await expect(adminCaller.summary()).resolves.toMatchObject({ totalEvents: 7, routeOpens: 3 });
    await expect(publicCaller.summary()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
