import { describe, expect, it } from "vitest";
import { canInitializeMap } from "./Map";

const container = {} as HTMLDivElement;

describe("canInitializeMap", () => {
  it("permite a montagem somente quando o componente e o contêiner estão disponíveis", () => {
    expect(
      canInitializeMap({ isMounted: true, hasMap: false, container })
    ).toBe(true);
  });

  it("impede a montagem após a desmontagem enquanto o script carrega", () => {
    expect(
      canInitializeMap({ isMounted: false, hasMap: false, container })
    ).toBe(false);
  });

  it("impede uma segunda inicialização ou uma montagem sem contêiner", () => {
    expect(
      canInitializeMap({ isMounted: true, hasMap: true, container })
    ).toBe(false);
    expect(
      canInitializeMap({ isMounted: true, hasMap: false, container: null })
    ).toBe(false);
  });
});
