import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
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
    operationalStatus: mysqlEnum("operationalStatus", ["confirmado", "verificar", "indisponivel"])
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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = typeof destinations.$inferInsert;
export type DestinationImage = typeof destinationImages.$inferSelect;
export type InsertDestinationImage = typeof destinationImages.$inferInsert;
