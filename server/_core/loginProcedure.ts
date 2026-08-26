import { z } from "zod";
import { COOKIE_NAME, SESSION_TTL_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getUserByEmail, invalidateUserSessions } from "../db";
import { verifyPassword } from "./passwords";
import { enforceRateLimit } from "./rateLimit";
import { sdk } from "./sdk";
import { getSessionCookieOptions } from "./cookies";
import { publicProcedure } from "./trpc";

type LoginContext = {
  req: Parameters<typeof getSessionCookieOptions>[0];
  res: {
    clearCookie: (name: string, options?: Record<string, unknown>) => unknown;
    cookie: (name: string, value: string, options?: Record<string, unknown>) => unknown;
  };
  user: { openId: string } | null;
};

export const loginInput = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres.").max(200),
});

export async function performLogin(ctx: LoginContext, input: z.infer<typeof loginInput>) {
  enforceRateLimit(ctx.req, "auth.login", { max: 10, windowMs: 15 * 60_000 });

  const user = await getUserByEmail(input.email);

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "E-mail ou senha incorretos." });
  }

  if (user.sessionsInvalidatedAt) {
    await invalidateUserSessions(user.openId);
  }

  const sessionToken = await sdk.createSessionToken(user.openId, {
    name: user.name ?? "",
  });

  const cookieOptions = getSessionCookieOptions(ctx.req);
  ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: SESSION_TTL_MS });

  return {
    id: user.id,
    openId: user.openId,
    name: user.name,
    email: user.email,
    role: user.role,
  } as const;
}

export const loginProcedure = publicProcedure
  .input(loginInput)
  .mutation(async ({ ctx, input }: { ctx: LoginContext; input: z.infer<typeof loginInput> }) =>
    performLogin(ctx, input)
  );
