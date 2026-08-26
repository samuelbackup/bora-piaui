import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  sessionsInvalidatedAt: timestamp("sessionsInvalidatedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const destinations = mysqlTable(
  "destinations",
  {
    id: int("id").autoincrement().primaryKey(),
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
    operationalStatus: mysqlEnum("operationalStatus", [
      "confirmado",
      "verificar",
      "indisponivel",
    ])
      .default("verificar")
      .notNull(),
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
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("destinations_slug_unique").on(table.slug)]
);

export const destinationImages = mysqlTable("destination_images", {
  id: int("id").autoincrement().primaryKey(),
  destinationId: int("destinationId")
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
  imageUrl: varchar("imageUrl", { length: 1024 }).notNull(),
  altText: varchar("altText", { length: 255 }).notNull(),
  caption: text("caption"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const culturalEvents = mysqlTable(
  "cultural_events",
  {
    id: int("id").autoincrement().primaryKey(),
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
    confirmationStatus: mysqlEnum("confirmationStatus", [
      "confirmado",
      "verificar",
      "cancelado",
    ])
      .default("verificar")
      .notNull(),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("cultural_events_slug_unique").on(table.slug)]
);

export const partnerSubmissions = mysqlTable("partner_submissions", {
  id: int("id").autoincrement().primaryKey(),
  businessName: varchar("businessName", { length: 180 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  openingHours: varchar("openingHours", { length: 255 }),
  description: text("description").notNull(),
  plan: mysqlEnum("plan", ["gratuito", "destaque"])
    .default("gratuito")
    .notNull(),
  editorialStatus: mysqlEnum("editorialStatus", [
    "pendente",
    "em_revisao",
    "aprovado",
    "recusado",
  ])
    .default("pendente")
    .notNull(),
  editorialNotes: text("editorialNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const usageEvents = mysqlTable(
  "usage_events",
  {
    id: int("id").autoincrement().primaryKey(),
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

export const cities = mysqlTable(
  "cities",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    eyebrow: varchar("eyebrow", { length: 120 }).notNull(),
    summary: text("summary").notNull(),
    accent: varchar("accent", { length: 32 }).notNull(),
    sourceName: varchar("sourceName", { length: 255 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
    sourceVerifiedAt: varchar("sourceVerifiedAt", { length: 96 }).notNull(),
    sourceResponsible: varchar("sourceResponsible", { length: 255 }),
    published: boolean("published").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("cities_slug_unique").on(table.slug)]
);

export const cityPlaces = mysqlTable(
  "city_places",
  {
    id: int("id").autoincrement().primaryKey(),
    cityId: int("cityId")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    externalId: varchar("externalId", { length: 140 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    kind: mysqlEnum("kind", ["attraction", "business"])
      .default("attraction")
      .notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    summary: text("summary").notNull(),
    image: json("image").$type<PlaceImage | null>(),
    routeUrl: varchar("routeUrl", { length: 1024 }),
    contactUrl: varchar("contactUrl", { length: 1024 }),
    externalUrl: varchar("externalUrl", { length: 1024 }),
    mapQuery: varchar("mapQuery", { length: 255 }).notNull(),
    accent: varchar("accent", { length: 32 }).notNull(),
    operationalStatus: mysqlEnum("operationalStatus", [
      "confirmed",
      "verify",
      "unavailable",
    ])
      .default("verify")
      .notNull(),
    editorialStatus: mysqlEnum("editorialStatus", ["published", "pending"])
      .default("pending")
      .notNull(),
    sourceName: varchar("sourceName", { length: 255 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
    sourceVerifiedAt: varchar("sourceVerifiedAt", { length: 96 }).notNull(),
    sourceResponsible: varchar("sourceResponsible", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("city_places_external_id_unique").on(table.externalId),
    index("city_places_city_idx").on(table.cityId),
  ]
);

export const curatedBusinesses = mysqlTable(
  "curated_businesses",
  {
    id: int("id").autoincrement().primaryKey(),
    cityId: int("cityId")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    externalId: varchar("externalId", { length: 140 }).notNull(),
    kind: mysqlEnum("kind", ["restaurant", "service"])
      .default("service")
      .notNull(),
    anchorPlaceIds: json("anchorPlaceIds").$type<string[]>().notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    summary: text("summary").notNull(),
    routeUrl: varchar("routeUrl", { length: 1024 }),
    contactUrl: varchar("contactUrl", { length: 1024 }),
    editorialStatus: mysqlEnum("editorialStatus", ["published", "pending"])
      .default("pending")
      .notNull(),
    sourceName: varchar("sourceName", { length: 255 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
    sourceVerifiedAt: varchar("sourceVerifiedAt", { length: 96 }).notNull(),
    sourceResponsible: varchar("sourceResponsible", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("curated_businesses_external_id_unique").on(table.externalId),
    index("curated_businesses_city_idx").on(table.cityId),
  ]
);

export const itineraries = mysqlTable(
  "itineraries",
  {
    id: int("id").autoincrement().primaryKey(),
    cityId: int("cityId")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 140 }).notNull(),
    dayScope: mysqlEnum("dayScope", ["one-day"]).default("one-day").notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    durationLabel: varchar("durationLabel", { length: 120 }).notNull(),
    summary: text("summary").notNull(),
    confirmationNotice: text("confirmationNotice").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("itineraries_slug_unique").on(table.slug)]
);

export const itineraryStops = mysqlTable(
  "itinerary_stops",
  {
    id: int("id").autoincrement().primaryKey(),
    itineraryId: int("itineraryId")
      .notNull()
      .references(() => itineraries.id, { onDelete: "cascade" }),
    placeId: int("placeId")
      .notNull()
      .references(() => cityPlaces.id, { onDelete: "cascade" }),
    sortOrder: int("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("itinerary_stops_itinerary_idx").on(table.itineraryId)]
);

export const placeProximityRelations = mysqlTable(
  "place_proximity_relations",
  {
    id: int("id").autoincrement().primaryKey(),
    externalId: varchar("externalId", { length: 180 }).notNull(),
    anchorPlaceId: int("anchorPlaceId")
      .notNull()
      .references(() => cityPlaces.id, { onDelete: "cascade" }),
    relatedPlaceId: int("relatedPlaceId")
      .notNull()
      .references(() => cityPlaces.id, { onDelete: "cascade" }),
    category: varchar("category", { length: 120 }).notNull(),
    editorialReason: text("editorialReason").notNull(),
    sourceName: varchar("sourceName", { length: 255 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
    sourceVerifiedAt: varchar("sourceVerifiedAt", { length: 96 }).notNull(),
    sourceResponsible: varchar("sourceResponsible", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("place_proximity_relations_external_id_unique").on(
      table.externalId
    ),
  ]
);

export const curationTopics = mysqlTable(
  "curation_topics",
  {
    id: int("id").autoincrement().primaryKey(),
    cityId: int("cityId")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    externalId: varchar("externalId", { length: 140 }).notNull(),
    category: mysqlEnum("category", ["gastronomy", "service"])
      .default("service")
      .notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    description: text("description").notNull(),
    status: mysqlEnum("status", ["curating", "published"])
      .default("curating")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("curation_topics_external_id_unique").on(table.externalId),
  ]
);

export const editorialHighlights = mysqlTable(
  "editorial_highlights",
  {
    id: int("id").autoincrement().primaryKey(),
    cityId: int("cityId")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    externalId: varchar("externalId", { length: 140 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description").notNull(),
    sourceName: varchar("sourceName", { length: 255 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
    sourceVerifiedAt: varchar("sourceVerifiedAt", { length: 96 }).notNull(),
    sourceResponsible: varchar("sourceResponsible", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("editorial_highlights_external_id_unique").on(table.externalId),
  ]
);

export type PlaceImage = {
  url: string;
  alt: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
};

export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;
export type CityPlace = typeof cityPlaces.$inferSelect;
export type InsertCityPlace = typeof cityPlaces.$inferInsert;
export type CuratedBusiness = typeof curatedBusinesses.$inferSelect;
export type InsertCuratedBusiness = typeof curatedBusinesses.$inferInsert;
export type Itinerary = typeof itineraries.$inferSelect;
export type InsertItinerary = typeof itineraries.$inferInsert;
export type ItineraryStop = typeof itineraryStops.$inferSelect;
export type InsertItineraryStop = typeof itineraryStops.$inferInsert;
export type PlaceProximityRelation =
  typeof placeProximityRelations.$inferSelect;
export type InsertPlaceProximityRelation =
  typeof placeProximityRelations.$inferInsert;
export type CurationTopic = typeof curationTopics.$inferSelect;
export type InsertCurationTopic = typeof curationTopics.$inferInsert;
export type EditorialHighlight = typeof editorialHighlights.$inferSelect;
export type InsertEditorialHighlight = typeof editorialHighlights.$inferInsert;
