import { boolean, index, integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const operationalStatus = pgEnum("operational_status", ["confirmado", "verificar", "indisponivel"]);
export const confirmationStatus = pgEnum("confirmation_status", ["confirmado", "verificar", "cancelado"]);
export const partnerPlan = pgEnum("partner_plan", ["gratuito", "destaque"]);
export const editorialStatus = pgEnum("editorial_status", ["pendente", "em_revisao", "aprovado", "recusado"]);
export const feedbackCategory = pgEnum("feedback_category", ["elogio", "sugestao", "problema"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  passwordHash: text("passwordHash"),
  sessionsInvalidatedAt: timestamp("sessionsInvalidatedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const destinations = pgTable(
  "destinations",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    polo: varchar("polo", { length: 100 }).notNull(),
    category: varchar("category", { length: 80 }).notNull(),
    municipality: varchar("municipality", { length: 120 }).notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    mapQuery: varchar("mapQuery", { length: 255 }).notNull(),
    routeUrl: varchar("routeUrl", { length: 1024 }).notNull(),
    sourceName: varchar("sourceName", { length: 255 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
    sourceYear: varchar("sourceYear", { length: 48 }).notNull(),
    operationalStatus: operationalStatus("operationalStatus").default("verificar").notNull(),
    hours: text("hours"),
    pricing: text("pricing"),
    accessInfo: text("accessInfo"),
    contactInfo: text("contactInfo"),
    visitNotes: text("visitNotes"),
    operationalSource: varchar("operationalSource", { length: 255 }),
    operationalSourceUrl: varchar("operationalSourceUrl", { length: 1024 }),
    lastVerifiedAt: timestamp("lastVerifiedAt"),
    published: boolean("published").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  table => [uniqueIndex("destinations_slug_unique").on(table.slug)]
);

export const destinationImages = pgTable("destination_images", {
  id: serial("id").primaryKey(),
  destinationId: integer("destinationId")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  altText: varchar("altText", { length: 255 }).notNull(),
  caption: text("caption"),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const culturalEvents = pgTable(
  "cultural_events",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 220 }).notNull(),
    city: varchar("city", { length: 120 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    startsAt: timestamp("startsAt").notNull(),
    endsAt: timestamp("endsAt"),
    venue: varchar("venue", { length: 220 }).notNull(),
    summary: text("summary").notNull(),
    sourceName: varchar("sourceName", { length: 255 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
    confirmationStatus: confirmationStatus("confirmationStatus").default("verificar").notNull(),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  table => [uniqueIndex("cultural_events_slug_unique").on(table.slug)]
);

export const partnerSubmissions = pgTable("partner_submissions", {
  id: serial("id").primaryKey(),
  businessName: varchar("businessName", { length: 180 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  openingHours: varchar("openingHours", { length: 255 }),
  description: text("description").notNull(),
  plan: partnerPlan("plan").default("gratuito").notNull(),
  editorialStatus: editorialStatus("editorialStatus").default("pendente").notNull(),
  editorialNotes: text("editorialNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const feedbacks = pgTable(
  "feedbacks",
  {
    id: serial("id").primaryKey(),
    category: feedbackCategory("category").notNull(),
    message: text("message").notNull(),
    rating: integer("rating"),
    destinationSlug: varchar("destinationSlug", { length: 120 }),
    destinationName: varchar("destinationName", { length: 180 }),
    isRead: boolean("isRead").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  table => [
    index("feedbacks_created_at_idx").on(table.createdAt),
    index("feedbacks_category_idx").on(table.category),
    index("feedbacks_is_read_idx").on(table.isRead),
  ]
);

export const usageEvents = pgTable(
  "usage_events",
  {
    id: serial("id").primaryKey(),
    eventName: varchar("eventName", { length: 48 }).notNull(),
    sessionId: varchar("sessionId", { length: 36 }).notNull(),
    citySlug: varchar("citySlug", { length: 80 }),
    itemId: varchar("itemId", { length: 120 }),
    anchorItemId: varchar("anchorItemId", { length: 120 }),
    source: varchar("source", { length: 48 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("usage_events_created_at_idx").on(table.createdAt),
    index("usage_events_event_name_idx").on(table.eventName),
    index("usage_events_city_slug_idx").on(table.citySlug),
  ]
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = typeof destinations.$inferInsert;
export type DestinationImage = typeof destinationImages.$inferSelect;
export type InsertDestinationImage = typeof destinationImages.$inferInsert;
export type CulturalEvent = typeof culturalEvents.$inferSelect;
export type InsertCulturalEvent = typeof culturalEvents.$inferInsert;
export type PartnerSubmission = typeof partnerSubmissions.$inferSelect;
export type InsertPartnerSubmission = typeof partnerSubmissions.$inferInsert;
export type UsageEvent = typeof usageEvents.$inferSelect;
export type InsertUsageEvent = typeof usageEvents.$inferInsert;
export type Feedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;
