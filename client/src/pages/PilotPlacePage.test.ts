import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(new URL("./PilotPlacePage.tsx", import.meta.url), "utf8");

describe("feedback contextual dos pontos turísticos", () => {
  it("renderiza a janela na parte inferior do detalhe de cada ponto", () => {
    expect(pageSource).toContain("function PlaceFeedback({ placeTitle, placeSlug }: { placeTitle: string; placeSlug: string })");
    expect(pageSource).toContain('<PlaceFeedback placeTitle={item.title} placeSlug={item.slug} />');
    expect(pageSource).toContain('aria-labelledby="place-feedback-title"');
  });

  it("oferece envio persistente sem solicitar dados pessoais", () => {
    expect(pageSource).toContain('id="place-feedback-message"');
    expect(pageSource).toContain('name="message"');
    expect(pageSource).toContain('required minLength={10}');
    expect(pageSource).toContain("Não inclua nome, e-mail ou outros dados pessoais.");
    expect(pageSource).not.toContain('name="email"');
    expect(pageSource).toContain('role="status" aria-live="polite"');
    expect(pageSource).toContain("trpc.feedbacks.submit.useMutation");
    expect(pageSource).toContain("destinationSlug: placeSlug");
  });
});
