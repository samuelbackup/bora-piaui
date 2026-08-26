import { z } from "zod";

export const pilotSourceFields = {
  sourceName: z.string().trim().min(3).max(255),
  sourceUrl: z.string().url().max(1024),
  sourceVerifiedAt: z.string().trim().min(3).max(96),
  sourceResponsible: z.string().trim().min(2).max(255).nullable().optional(),
};

export const pilotImageSchema = z.object({
  url: z.string().min(1).max(1024),
  alt: z.string().trim().min(3).max(255),
  credit: z.string().trim().min(2).max(255).optional(),
  license: z.string().trim().min(2).max(120).optional(),
  licenseUrl: z.string().url().max(1024).optional(),
});

export const cityInsertRowSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens."),
  name: z.string().trim().min(2).max(120),
  eyebrow: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(10),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use uma cor hexadecimal no formato #RRGGBB."),
  ...pilotSourceFields,
  published: z.boolean().optional(),
});

export const placeInsertRowSchema = z.object({
  cityId: z.number().int().positive(),
  externalId: z.string().trim().min(3).max(140),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(140)
    .regex(/^[a-z0-9-]+$/),
  kind: z.enum(["attraction", "business"]),
  title: z.string().trim().min(3).max(180),
  category: z.string().trim().min(2).max(100),
  summary: z.string().trim().min(10),
  image: pilotImageSchema.nullable(),
  routeUrl: z.string().url().max(1024).nullable(),
  contactUrl: z.string().url().max(1024).nullable(),
  externalUrl: z.string().url().max(1024).nullable(),
  mapQuery: z.string().trim().min(3).max(255),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  operationalStatus: z.enum(["confirmed", "verify", "unavailable"]),
  editorialStatus: z.enum(["published", "pending"]),
  ...pilotSourceFields,
});

export const curatedBusinessInsertRowSchema = z.object({
  cityId: z.number().int().positive(),
  externalId: z.string().trim().min(3).max(140),
  kind: z.enum(["restaurant", "service"]),
  anchorPlaceIds: z.array(z.string().trim().min(3).max(140)),
  title: z.string().trim().min(3).max(180),
  category: z.string().trim().min(2).max(100),
  summary: z.string().trim().min(10),
  routeUrl: z.string().url().max(1024).nullable(),
  contactUrl: z.string().url().max(1024).nullable(),
  editorialStatus: z.enum(["published", "pending"]),
  ...pilotSourceFields,
});

export const itineraryInsertRowSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(140)
    .regex(/^[a-z0-9-]+$/),
  cityId: z.number().int().positive(),
  dayScope: z.literal("one-day"),
  title: z.string().trim().min(3).max(180),
  durationLabel: z.string().trim().min(3).max(120),
  summary: z.string().trim().min(10),
  confirmationNotice: z.string().trim().min(10),
});

export const itineraryStopInsertRowSchema = z.object({
  itineraryId: z.number().int().positive(),
  placeId: z.number().int().positive(),
  sortOrder: z.number().int().min(0),
});

export const proximityRelationInsertRowSchema = z.object({
  externalId: z.string().trim().min(3).max(180),
  anchorPlaceId: z.number().int().positive(),
  relatedPlaceId: z.number().int().positive(),
  category: z.string().trim().min(2).max(120),
  editorialReason: z.string().trim().min(10),
  ...pilotSourceFields,
});

export const curationTopicInsertRowSchema = z.object({
  cityId: z.number().int().positive(),
  externalId: z.string().trim().min(3).max(140),
  category: z.enum(["gastronomy", "service"]),
  title: z.string().trim().min(3).max(180),
  description: z.string().trim().min(10),
  status: z.enum(["curating", "published"]),
});

export const editorialHighlightInsertRowSchema = z.object({
  cityId: z.number().int().positive(),
  externalId: z.string().trim().min(3).max(140),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10),
  ...pilotSourceFields,
});
