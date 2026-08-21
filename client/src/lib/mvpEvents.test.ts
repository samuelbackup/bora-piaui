import { describe, expect, it } from "vitest";
import { createMvpEvent, mvpEventNames } from "./mvpEvents";

describe("eventos locais do MVP", () => {
  it("mantém a taxonomia acordada sem dados pessoais obrigatórios", () => {
    expect(mvpEventNames).toContain("view_item");
    expect(mvpEventNames).toContain("open_route");
    expect(mvpEventNames).toContain("ui_error");
  });

  it("cria eventos serializáveis para a futura integração", () => {
    const event = createMvpEvent("open_route", { item: "encontro-dos-rios", source: "city" });
    expect(event.name).toBe("open_route");
    expect(event.context).toEqual({ item: "encontro-dos-rios", source: "city" });
    expect(Number.isNaN(Date.parse(event.occurredAt))).toBe(false);
  });
});
