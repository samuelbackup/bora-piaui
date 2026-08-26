import { COOKIE_NAME } from "@shared/const";
import { invalidateUserSessions } from "../db";
import { getSessionCookieOptions } from "./cookies";
import { publicProcedure } from "./trpc";

type LogoutContext = {
  req: Parameters<typeof getSessionCookieOptions>[0];
  res: { clearCookie: (name: string, options?: Record<string, unknown>) => unknown };
  user: { openId: string } | null;
};

export const logoutProcedure = publicProcedure.mutation(async ({ ctx }: { ctx: LogoutContext }) => {
  if (ctx.user) {
    await invalidateUserSessions(ctx.user.openId);
  }
  const cookieOptions = getSessionCookieOptions(ctx.req);
  ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
  return { success: true } as const;
});
