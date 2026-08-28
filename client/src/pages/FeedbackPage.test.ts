import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const feedbackSource = readFileSync(new URL("./FeedbackPage.tsx", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");

 describe("fluxo público de feedback", () => {
  it("registra a rota pública e oferece um formulário acessível", () => {
    expect(appSource).toContain('<Route path="/feedback" component={FeedbackPage} />');
    expect(feedbackSource).toContain('aria-live="polite"');
    expect(feedbackSource).toContain('htmlFor="feedback-type"');
    expect(feedbackSource).toContain('htmlFor="feedback-message"');
  });

  it("exige uma categoria e uma mensagem sem coletar dados pessoais", () => {
    expect(feedbackSource).toContain('name="feedbackType" required');
    expect(feedbackSource).toContain('name="message" required minLength={10}');
    expect(feedbackSource).toContain("Não pedimos nome, e-mail ou outros dados pessoais");
    expect(feedbackSource).not.toContain('name="email"');
  });
});
