import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createCulturalEvent,
  createPartnerSubmission,
  getCulturalEventById,
  getPartnerSubmissionById,
  listAllCulturalEvents,
  listPartnerSubmissions,
  listPublishedCulturalEvents,
  removeCulturalEvent,
  updateCulturalEvent,
  updatePartnerSubmission,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { enforceRateLimit } from "../_core/rateLimit";
import { externalUrl } from "../_core/url";

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

function isDuplicateEntryError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "ER_DUP_ENTRY";
}

export const culturalEventFields = z.object({
  slug: z.string().trim().min(3).max(140).regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens."),
  title: z.string().trim().min(4).max(220),
  city: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(100),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().nullable().optional(),
  venue: z.string().trim().min(3).max(220),
  summary: z.string().trim().min(20).max(1500),
  sourceName: z.string().trim().min(3).max(255),
  sourceUrl: externalUrl(1024),
  confirmationStatus: z.enum(["confirmado", "verificar", "cancelado"]),
  published: z.boolean(),
});

export const partnerSubmissionFields = z.object({
  businessName: z.string().trim().min(3).max(180),
  city: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(40),
  address: z.string().trim().min(5).max(255),
  openingHours: optionalText(255),
  description: z.string().trim().min(30).max(3000),
  plan: z.enum(["gratuito", "destaque"]),
});

function normalizeCulturalEvent(input: z.infer<typeof culturalEventFields>) {
  const startsAt = new Date(input.startsAt);
  const endsAt = input.endsAt ? new Date(input.endsAt) : null;
  if (endsAt && endsAt.getTime() < startsAt.getTime()) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "A data de término precisa ser posterior à data de início." });
  }
  return { ...input, startsAt, endsAt };
}

export const agendaRouter = router({
  list: publicProcedure.query(() => listPublishedCulturalEvents()),
  adminList: adminProcedure.query(() => listAllCulturalEvents()),
  create: adminProcedure.input(culturalEventFields).mutation(async ({ input }) => {
    let event;
    try {
      event = await createCulturalEvent(normalizeCulturalEvent(input));
    } catch (error) {
      if (isDuplicateEntryError(error)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Já existe um evento com esse identificador (slug). Ajuste o título para gerar outro." });
      }
      throw error;
    }
    if (!event) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível criar o evento." });
    return event;
  }),
  update: adminProcedure.input(culturalEventFields.partial().extend({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    const { id, ...changes } = input;
    const current = await getCulturalEventById(id);
    if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "Evento não encontrado." });
    const complete = culturalEventFields.parse({
      ...current,
      ...changes,
      startsAt: changes.startsAt ?? current.startsAt.toISOString(),
      endsAt: changes.endsAt ?? current.endsAt?.toISOString() ?? null,
    });
    return updateCulturalEvent(id, normalizeCulturalEvent(complete));
  }),
  delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    const event = await removeCulturalEvent(input.id);
    if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Evento não encontrado." });
    return event;
  }),
});

export const partnersRouter = router({
  submit: publicProcedure.input(partnerSubmissionFields).mutation(async ({ input, ctx }) => {
    enforceRateLimit(ctx.req, "partners.submit", { max: 5, windowMs: 10 * 60_000 });
    const submission = await createPartnerSubmission({
      ...input,
      openingHours: input.openingHours ?? null,
      editorialStatus: "pendente",
      editorialNotes: null,
    });
    if (!submission) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível registrar sua proposta." });
    return submission;
  }),
  adminList: adminProcedure.query(() => listPartnerSubmissions()),
  updateEditorialStatus: adminProcedure.input(z.object({
    id: z.number().int().positive(),
    editorialStatus: z.enum(["pendente", "em_revisao", "aprovado", "recusado"]),
    editorialNotes: optionalText(1500),
  })).mutation(async ({ input }) => {
    const current = await getPartnerSubmissionById(input.id);
    if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "Proposta não encontrada." });
    return updatePartnerSubmission(input.id, {
      editorialStatus: input.editorialStatus,
      editorialNotes: input.editorialNotes ?? null,
    });
  }),
});
