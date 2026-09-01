import { logoutProcedure } from "./_core/logoutProcedure";
import { loginProcedure } from "./_core/loginProcedure";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { agendaRouter, partnersRouter } from "./routers/agendaPartners";
import { destinationsRouter } from "./routers/destinations";
import { metricsRouter } from "./routers/metrics";
import { feedbacksRouter } from "./routers/feedbacks";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: loginProcedure,
    logout: logoutProcedure,
  }),
  destinations: destinationsRouter,
  agenda: agendaRouter,
  partners: partnersRouter,
  metrics: metricsRouter,
  feedbacks: feedbacksRouter,
});

export type AppRouter = typeof appRouter;
