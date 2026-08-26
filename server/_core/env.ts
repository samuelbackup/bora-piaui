export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
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
