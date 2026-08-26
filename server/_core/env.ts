import { randomBytes } from "crypto";

function resolveCookieSecret(): string {
  const secret = process.env.JWT_SECRET ?? "";
  if (secret.length > 0) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[env] JWT_SECRET é obrigatório em produção. Defina um segredo forte antes de iniciar o servidor — recusar o boot evita sessões forjáveis."
    );
  }
  console.warn(
    "[env] JWT_SECRET ausente: usando segredo efêmero aleatório (sessões serão invalidadas a cada reinício do servidor)."
  );
  return randomBytes(32).toString("hex");
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: resolveCookieSecret(),
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

const MIN_PRODUCTION_SECRET_LENGTH = 32;

export function validateEnv(): void {
  const secret = process.env.JWT_SECRET ?? "";
  if (!secret) {
    throw new Error("[env] JWT_SECRET ausente ou vazio. Configure a variável de ambiente antes de iniciar o servidor.");
  }
  if (process.env.NODE_ENV === "production" && secret.length < MIN_PRODUCTION_SECRET_LENGTH) {
    throw new Error(`[env] JWT_SECRET deve ter pelo menos ${MIN_PRODUCTION_SECRET_LENGTH} caracteres em produção.`);
  }
}
