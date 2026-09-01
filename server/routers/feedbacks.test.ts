import { describe, expect, it } from "vitest";
import { feedbackFields } from "./feedbacks";

const validFeedback = {
  category: "sugestao" as const,
  message: "texto técnico com contexto suficiente",
  destinationSlug: "encontro-dos-rios",
  destinationName: "Encontro dos Rios",
  rating: null,
};

describe("feedbackFields", () => {
  it("aceita categorias e contexto editorial válidos", () => {
    expect(feedbackFields.parse(validFeedback)).toMatchObject(validFeedback);
  });

  it("mantém somente os campos do contrato e não persiste e-mail enviado por engano", () => {
    const parsed = feedbackFields.parse({ ...validFeedback, email: "nao-coletar@example.com", name: "nao-coletar" });
    expect(parsed).not.toHaveProperty("email");
    expect(parsed).not.toHaveProperty("name");
  });

  it("rejeita mensagem curta, categoria desconhecida e slug inválido", () => {
    expect(() => feedbackFields.parse({ ...validFeedback, message: "curta" })).toThrow();
    expect(() => feedbackFields.parse({ ...validFeedback, category: "duvida" })).toThrow();
    expect(() => feedbackFields.parse({ ...validFeedback, destinationSlug: "Encontro dos Rios" })).toThrow();
  });
});
