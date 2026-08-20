import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  addDestinationImage,
  createDestination,
  getDestinationById,
  getDestinationBySlug,
  listAllDestinations,
  listPublishedDestinations,
  removeDestinationImage,
  updateDestination,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();

export const destinationFields = z.object({
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens."),
  title: z.string().trim().min(3).max(180),
  polo: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(80),
  municipality: z.string().trim().min(2).max(120),
  summary: z.string().trim().min(10).max(600),
  description: z.string().trim().min(30).max(5000),
  mapQuery: z.string().trim().min(3).max(255),
  routeUrl: z.string().url().max(1024),
  sourceName: z.string().trim().min(3).max(255),
  sourceUrl: z.string().url().max(1024),
  sourceYear: z.string().trim().min(4).max(48),
  operationalStatus: z.enum(["confirmado", "verificar", "indisponivel"]),
  hours: optionalText(1000),
  pricing: optionalText(1000),
  accessInfo: optionalText(2000),
  contactInfo: optionalText(1000),
  visitNotes: optionalText(2000),
  operationalSource: optionalText(255),
  operationalSourceUrl: z.string().url().max(1024).nullable().optional(),
  lastVerifiedAt: z.string().datetime().nullable().optional(),
  published: z.boolean(),
});

function normalizeDestination(input: z.infer<typeof destinationFields>) {
  return {
    ...input,
    lastVerifiedAt: input.lastVerifiedAt ? new Date(input.lastVerifiedAt) : null,
    hours: input.hours ?? null,
    pricing: input.pricing ?? null,
    accessInfo: input.accessInfo ?? null,
    contactInfo: input.contactInfo ?? null,
    visitNotes: input.visitNotes ?? null,
    operationalSource: input.operationalSource ?? null,
    operationalSourceUrl: input.operationalSourceUrl ?? null,
  };
}

function decodeImage(dataUrl: string) {
  const match = /^data:(image\/(?:png|jpe?g|webp));base64,([a-zA-Z0-9+/=\s]+)$/.exec(dataUrl);
  if (!match) throw new TRPCError({ code: "BAD_REQUEST", message: "Envie um arquivo PNG, JPEG ou WebP válido." });
  const data = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (!data.length || data.length > 8 * 1024 * 1024) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "A imagem deve ter no máximo 8 MB." });
  }
  return { contentType: match[1], data };
}

export const destinationsRouter = router({
  list: publicProcedure.query(() => listPublishedDestinations()),
  bySlug: publicProcedure.input(z.object({ slug: z.string().min(3).max(120) })).query(({ input }) => getDestinationBySlug(input.slug)),
  adminList: adminProcedure.query(() => listAllDestinations()),
  adminById: adminProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => {
    const destination = await getDestinationById(input.id);
    if (!destination) throw new TRPCError({ code: "NOT_FOUND", message: "Destino não encontrado." });
    return destination;
  }),
  create: adminProcedure.input(destinationFields).mutation(async ({ input }) => {
    const destination = await createDestination(normalizeDestination(input));
    if (!destination) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível criar o destino." });
    return destination;
  }),
  update: adminProcedure.input(destinationFields.partial().extend({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    const { id, ...changes } = input;
    if (!Object.keys(changes).length) throw new TRPCError({ code: "BAD_REQUEST", message: "Informe ao menos um campo para atualizar." });
    const destination = await updateDestination(id, normalizeDestination(destinationFields.parse({
      ...(await getDestinationById(id)),
      ...changes,
      lastVerifiedAt: changes.lastVerifiedAt ?? (await getDestinationById(id))?.lastVerifiedAt?.toISOString() ?? null,
    })));
    if (!destination) throw new TRPCError({ code: "NOT_FOUND", message: "Destino não encontrado." });
    return destination;
  }),
  setPublished: adminProcedure.input(z.object({ id: z.number().int().positive(), published: z.boolean() })).mutation(async ({ input }) => {
    const destination = await updateDestination(input.id, { published: input.published });
    if (!destination) throw new TRPCError({ code: "NOT_FOUND", message: "Destino não encontrado." });
    return destination;
  }),
  uploadImage: adminProcedure.input(z.object({
    destinationId: z.number().int().positive(),
    dataUrl: z.string().max(12_000_000),
    fileName: z.string().trim().min(1).max(140),
    altText: z.string().trim().min(8).max(255),
    caption: optionalText(600),
    sortOrder: z.number().int().min(0).max(1000).default(0),
  })).mutation(async ({ input }) => {
    const destination = await getDestinationById(input.destinationId);
    if (!destination) throw new TRPCError({ code: "NOT_FOUND", message: "Destino não encontrado." });
    const { data, contentType } = decodeImage(input.dataUrl);
    const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
    const { url } = await storagePut(`destinations/${destination.slug}/galeria-${Date.now()}.${extension}`, data, contentType);
    const result = await addDestinationImage({
      destinationId: input.destinationId,
      imageUrl: url,
      altText: input.altText,
      caption: input.caption ?? null,
      sortOrder: input.sortOrder,
    });
    if (!result) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Não foi possível salvar a imagem." });
    return result;
  }),
  removeImage: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    const destination = await removeDestinationImage(input.id);
    if (!destination) throw new TRPCError({ code: "NOT_FOUND", message: "Imagem não encontrada." });
    return destination;
  }),
});
