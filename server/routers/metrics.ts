import { z } from "zod";
import { getUsageMetrics, recordUsageEvent } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

export const usageEventNames = [
  "city_viewed",
  "place_viewed",
  "food_context_opened",
  "map_search_opened",
  "route_opened",
  "source_opened",
  "itinerary_opened",
] as const;

const safeIdentifier = z.string().trim().min(1).max(120).regex(/^[a-z0-9_-]+$/, "Use somente identificadores curtos.");

export const usageEventInput = z.object({
  eventName: z.enum(usageEventNames),
  sessionId: z.string().uuid(),
  citySlug: safeIdentifier.max(80).optional(),
  itemId: safeIdentifier.optional(),
  anchorItemId: safeIdentifier.optional(),
  source: z.string().trim().min(1).max(48).regex(/^[a-z0-9_-]+$/, "Use somente uma origem curta.").optional(),
});

export const metricsRouter = router({
  track: publicProcedure.input(usageEventInput).mutation(async ({ input }) => {
    await recordUsageEvent({ ...input, createdAt: new Date() });
    return { success: true } as const;
  }),
  summary: adminProcedure.query(() => getUsageMetrics()),
});
