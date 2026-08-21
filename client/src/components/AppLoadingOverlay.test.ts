import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const overlaySource = readFileSync(new URL("./AppLoadingOverlay.tsx", import.meta.url), "utf8");

describe("animação inicial", () => {
  it("não bloqueia a navegação e identifica a camada como decorativa", () => {
    expect(overlaySource).toContain('aria-hidden="true"');
    expect(overlaySource).toContain('data-testid="app-loading-overlay"');
  });

  it("remove a camada imediatamente quando a pessoa prefere reduzir movimento", () => {
    expect(overlaySource).toContain('prefers-reduced-motion: reduce');
    expect(overlaySource).toContain("setVisible(false)");
  });
});
