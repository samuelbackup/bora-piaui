import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { agendaRouter, partnersRouter } from "./routers/agendaPartners";
import { destinationsRouter } from "./routers/destinations";
import { metricsRouter } from "./routers/metrics";
import { citiesRouter, cityPlacesRouter, itinerariesRouter } from "./routers/pilotContent";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  destinations: destinationsRouter,
  agenda: agendaRouter,
  partners: partnersRouter,
  metrics: metricsRouter,
  cities: citiesRouter,
  cityPlaces: cityPlacesRouter,
  itineraries: itinerariesRouter,
});

export type AppRouter = typeof appRouter;
