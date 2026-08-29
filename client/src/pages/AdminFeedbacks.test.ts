import { describe, expect, it } from "vitest";
import { ADMIN_FEEDBACKS_ROUTE, filterFeedbacks, mockFeedbacks } from "./AdminFeedbacks";

describe("AdminFeedbacks mock data", () => {
  it("expõe a rota administrativa compartilhada", () => {
    expect(ADMIN_FEEDBACKS_ROUTE).toBe("/admin/feedbacks");
  });

  it("mantém oito registros sintéticos variados para testar a interface", () => {
    expect(mockFeedbacks).toHaveLength(8);
    expect(new Set(mockFeedbacks.map((item) => item.category))).toEqual(new Set(["elogio", "sugestao", "problema"]));
    expect(new Set(mockFeedbacks.map((item) => item.status))).toEqual(new Set(["lido", "nao_lido"]));
    expect(mockFeedbacks.every((item) => item.message.includes("não é feedback de usuário"))).toBe(true);
    expect(mockFeedbacks.every((item) => item.rating === null)).toBe(true);
  });

  it("inclui os campos necessários para a triagem por busca", () => {
    expect(mockFeedbacks.every((item) => item.name && item.email && item.message && item.sentAt)).toBe(true);
    expect(mockFeedbacks.some((item) => item.message.toLowerCase().includes("modal"))).toBe(true);
    expect(mockFeedbacks.some((item) => item.place === "Encontro dos Rios")).toBe(true);
  });

  it("aplica busca, categoria e status de forma combinada", () => {
    expect(filterFeedbacks(mockFeedbacks, "mensagem longa", "todos", "todos")).toHaveLength(1);
    expect(filterFeedbacks(mockFeedbacks, "", "sugestao", "todos")).toHaveLength(3);
    expect(filterFeedbacks(mockFeedbacks, "", "todos", "nao_lido")).toHaveLength(4);
    expect(filterFeedbacks(mockFeedbacks, "termos ausentes", "todos", "todos")).toHaveLength(0);
  });
});
