import { afterEach, describe, expect, it, vi } from "vitest";

const originalNodeEnv = process.env.NODE_ENV;
const originalJwtSecret = process.env.JWT_SECRET;
const originalSessionSecret = process.env.SESSION_JWT_SECRET;

async function loadEnvWith(values: {
  nodeEnv: string;
  jwtSecret?: string;
  sessionSecret?: string;
}) {
  vi.resetModules();
  process.env.NODE_ENV = values.nodeEnv;
  if (values.jwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = values.jwtSecret;
  if (values.sessionSecret === undefined) delete process.env.SESSION_JWT_SECRET;
  else process.env.SESSION_JWT_SECRET = values.sessionSecret;
  return import("./env");
}

afterEach(() => {
  vi.resetModules();
  process.env.NODE_ENV = originalNodeEnv;
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
  if (originalSessionSecret === undefined) delete process.env.SESSION_JWT_SECRET;
  else process.env.SESSION_JWT_SECRET = originalSessionSecret;
});

describe("segredo de sessão", () => {
  it("prioriza SESSION_JWT_SECRET sobre o segredo fornecido pela plataforma", async () => {
    const { ENV } = await loadEnvWith({
      nodeEnv: "production",
      jwtSecret: "segredo-da-plataforma",
      sessionSecret: "segredo-proprio-forte",
    });

    expect(ENV.cookieSecret).toBe("segredo-proprio-forte");
  });

  it("recusa inicialização em produção quando nenhum segredo foi configurado", async () => {
    await expect(loadEnvWith({ nodeEnv: "production" })).rejects.toThrow(
      "SESSION_JWT_SECRET é obrigatório em produção"
    );
  });
});
