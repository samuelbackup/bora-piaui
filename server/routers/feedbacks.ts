import { z } from "zod";
import { createFeedback, getFeedbackById, listFeedbacks, markFeedbackRead } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { enforceRateLimit } from "../_core/rateLimit";

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const feedbackFields = z.object({
  category: z.enum(["elogio", "sugestao", "problema"]),
  message: z.string().trim().min(10, "Escreva pelo menos 10 caracteres.").max(3000),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  destinationSlug: z.string().trim().max(120).regex(/^[a-z0-9-]+$/, "Identificador de destino inválido.").nullable().optional(),
  destinationName: optionalText(180),
});

export const feedbacksRouter = router({
  submit: publicProcedure.input(feedbackFields).mutation(async ({ input, ctx }) => {
    enforceRateLimit(ctx.req, "feedbacks.submit", { max: 5, windowMs: 10 * 60_000 });
    const feedback = await createFeedback({
      category: input.category,
      message: input.message,
      rating: input.rating ?? null,
      destinationSlug: input.destinationSlug ?? null,
      destinationName: input.destinationName ?? null,
      isRead: false,
    });
    if (!feedback) throw new Error("Não foi possível registrar o feedback.");
    return { success: true, id: feedback.id } as const;
  }),
  adminList: adminProcedure.query(() => listFeedbacks()),
  markRead: adminProcedure
    .input(z.object({ id: z.number().int().positive(), isRead: z.boolean() }))
    .mutation(async ({ input }) => {
      const current = await getFeedbackById(input.id);
      if (!current) throw new Error("Feedback não encontrado.");
      return markFeedbackRead(input.id, input.isRead);
    }),
});

export type FeedbackInput = z.infer<typeof feedbackFields>;
