import { describe, expect, it } from "vitest";
import { ADMIN_FEEDBACKS_ROUTE, filterFeedbacks, type Feedback } from "./AdminFeedbacks";

const filterCandidates: Feedback[] = [
  { id: 1, category: "elogio", message: "alpha", rating: null, destinationSlug: "encontro-dos-rios", destinationName: "Encontro dos Rios", isRead: false, createdAt: "2026-08-29T12:00:00.000Z", updatedAt: "2026-08-29T12:00:00.000Z" },
  { id: 2, category: "sugestao", message: "beta", rating: null, destinationSlug: "delta-do-parnaiba", destinationName: "Delta do Parnaíba", isRead: true, createdAt: "2026-08-28T12:00:00.000Z", updatedAt: "2026-08-28T12:00:00.000Z" },
  { id: 3, category: "problema", message: "gamma", rating: null, destinationSlug: null, destinationName: null, isRead: false, createdAt: "2026-08-27T12:00:00.000Z", updatedAt: "2026-08-27T12:00:00.000Z" },
];

describe("AdminFeedbacks", () => {
  it("expõe a rota administrativa compartilhada", () => {
    expect(ADMIN_FEEDBACKS_ROUTE).toBe("/admin/feedbacks");
  });

  it("representa somente os campos persistidos do feedback, sem nome ou e-mail", () => {
    const candidate = filterCandidates[0];
    expect(candidate).toMatchObject({ category: "elogio", message: "alpha", isRead: false });
    expect("name" in candidate).toBe(false);
    expect("email" in candidate).toBe(false);
    expect("status" in candidate).toBe(false);
  });

  it("aplica busca, categoria e status de forma combinada", () => {
    expect(filterFeedbacks(filterCandidates, "delta", "todos", "todos")).toHaveLength(1);
    expect(filterFeedbacks(filterCandidates, "", "sugestao", "todos")).toHaveLength(1);
    expect(filterFeedbacks(filterCandidates, "", "todos", "nao_lido")).toHaveLength(2);
    expect(filterFeedbacks(filterCandidates, "", "todos", "lido")).toHaveLength(1);
    expect(filterFeedbacks(filterCandidates, "termos ausentes", "todos", "todos")).toHaveLength(0);
  });
});
