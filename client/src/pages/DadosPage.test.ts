import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const dadosPageSource = readFileSync(
  new URL("./DadosPage.tsx", import.meta.url),
  "utf8"
);

describe("responsividade da página Dados", () => {
  it("define uma coluna explicitamente limitada antes do grid de gráficos virar duas colunas", () => {
    expect(dadosPageSource).toContain("grid-cols-1 gap-6 lg:grid-cols-2");
  });

  it("permite que os cartões e seus gráficos encolham dentro do viewport móvel", () => {
    expect(dadosPageSource.match(/min-w-0 rounded-\[2rem\]/g)).toHaveLength(2);
    expect(dadosPageSource.match(/h-\[270px\] min-w-0 w-full/g)).toHaveLength(
      2
    );
  });
});
