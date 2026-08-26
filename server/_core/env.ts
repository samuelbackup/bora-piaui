import { randomBytes } from "crypto";

function resolveCookieSecret(): string {
  const secret = process.env.SESSION_JWT_SECRET ?? process.env.JWT_SECRET ?? "";
  if (secret.length > 0) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[env] SESSION_JWT_SECRET é obrigatório em produção. Defina um segredo forte antes de iniciar o servidor — recusar o boot evita sessões forjáveis."
    );
  }
  console.warn(
    "[env] SESSION_JWT_SECRET ausente: usando segredo efêmero aleatório (sessões serão invalidadas a cada reinício do servidor)."
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
