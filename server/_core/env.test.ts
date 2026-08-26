import { afterEach, describe, expect, it, vi } from "vitest";
import { validateEnv } from "./env";

describe("validateEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("falha quando JWT_SECRET está ausente ou vazio", () => {
    vi.stubEnv("JWT_SECRET", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(() => validateEnv()).toThrow(/JWT_SECRET/);
  });

  it("aceita segredo forte em produção", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("JWT_SECRET", "s".repeat(32));
    expect(() => validateEnv()).not.toThrow();
  });

  it("exige comprimento mínimo de segredo em produção", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("JWT_SECRET", "segredo-curto");
    expect(() => validateEnv()).toThrow(/pelo menos 32/);
  });

  it("permite segredo curto fora de produção", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("JWT_SECRET", "dev-secret");
    expect(() => validateEnv()).not.toThrow();
  });
});
