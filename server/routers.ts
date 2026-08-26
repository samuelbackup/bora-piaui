import { logoutProcedure } from "./_core/logoutProcedure";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { agendaRouter, partnersRouter } from "./routers/agendaPartners";
import { destinationsRouter } from "./routers/destinations";
import { metricsRouter } from "./routers/metrics";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: logoutProcedure,
  }),
  destinations: destinationsRouter,
  agenda: agendaRouter,
  partners: partnersRouter,
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
