import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  Destination,
  DestinationImage,
  culturalEvents,
  destinationImages,
  destinations,
  feedbacks,
  InsertCulturalEvent,
  InsertDestination,
  InsertDestinationImage,
  InsertFeedback,
  InsertPartnerSubmission,
  InsertUser,
  partnerSubmissions,
  InsertUsageEvent,
  usageEvents,
  users,
} from "./database/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

const createDrizzle = drizzle as (client: unknown) => NonNullable<typeof _db>;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const url = process.env.DATABASE_URL;
      const needsSsl = /aivencloud\.com|tidbcloud\.com|sslmode=required|ssl=true/i.test(url);
      if (needsSsl) {
        const pool = mysql.createPool({
          uri: url,
          ssl: { rejectUnauthorized: false },
        });
        _db = createDrizzle(pool);
      } else {
        _db = drizzle(url);
      }
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function invalidateUserSessions(openId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(users)
    .set({ sessionsInvalidatedAt: new Date() })
    .where(eq(users.openId, openId));
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export type DestinationWithImages = Destination & { images: DestinationImage[] };

async function attachImages(rows: Destination[]): Promise<DestinationWithImages[]> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  if (!rows.length) return [];
  const imageRows = await db
    .select()
    .from(destinationImages)
    .where(inArray(destinationImages.destinationId, rows.map(row => row.id)))
    .orderBy(asc(destinationImages.sortOrder), asc(destinationImages.id));
  return rows.map(destination => ({
    ...destination,
    images: imageRows.filter(image => image.destinationId === destination.id),
  }));
}

export async function listPublishedDestinations() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db.select().from(destinations).where(eq(destinations.published, true)).orderBy(asc(destinations.title)).limit(300);
  return attachImages(rows);
}

export async function listAllDestinations() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db.select().from(destinations).orderBy(desc(destinations.updatedAt)).limit(500);
  return attachImages(rows);
}

export async function getDestinationBySlug(slug: string, includeUnpublished = false) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const condition = includeUnpublished
    ? eq(destinations.slug, slug)
    : and(eq(destinations.slug, slug), eq(destinations.published, true));
  const rows = await db.select().from(destinations).where(condition).limit(1);
  const result = await attachImages(rows);
  return result[0] ?? null;
}

export async function getDestinationById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db.select().from(destinations).where(eq(destinations.id, id)).limit(1);
  const result = await attachImages(rows);
  return result[0] ?? null;
}

export async function createDestination(data: InsertDestination) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(destinations).values(data);
  return getDestinationBySlug(data.slug, true);
}

export async function updateDestination(id: number, data: Partial<InsertDestination>) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(destinations).set(data).where(eq(destinations.id, id));
  return getDestinationById(id);
}

export async function addDestinationImage(data: InsertDestinationImage) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(destinationImages).values(data);
  return getDestinationById(data.destinationId);
}

export async function removeDestinationImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const current = await db.select().from(destinationImages).where(eq(destinationImages.id, id)).limit(1);
  if (!current[0]) return null;
  await db.delete(destinationImages).where(eq(destinationImages.id, id));
  return getDestinationById(current[0].destinationId);
}

export async function listPublishedCulturalEvents() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db
    .select()
    .from(culturalEvents)
    .where(and(eq(culturalEvents.published, true), eq(culturalEvents.confirmationStatus, "confirmado")))
    .orderBy(asc(culturalEvents.startsAt))
    .limit(300);
}

export async function listAllCulturalEvents() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.select().from(culturalEvents).orderBy(desc(culturalEvents.updatedAt)).limit(500);
}

export async function getCulturalEventById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.select().from(culturalEvents).where(eq(culturalEvents.id, id)).limit(1);
  return result[0] ?? null;
}

export async function createCulturalEvent(data: InsertCulturalEvent) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(culturalEvents).values(data);
  const result = await db.select().from(culturalEvents).where(eq(culturalEvents.slug, data.slug)).limit(1);
  return result[0] ?? null;
}

export async function updateCulturalEvent(id: number, data: Partial<InsertCulturalEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(culturalEvents).set(data).where(eq(culturalEvents.id, id));
  return getCulturalEventById(id);
}

export async function removeCulturalEvent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const current = await getCulturalEventById(id);
  if (!current) return null;
  await db.delete(culturalEvents).where(eq(culturalEvents.id, id));
  return current;
}

export async function createPartnerSubmission(data: InsertPartnerSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(partnerSubmissions).values(data);
  return getPartnerSubmissionById(Number(result[0].insertId));
}

export async function getPartnerSubmissionById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.select().from(partnerSubmissions).where(eq(partnerSubmissions.id, id)).limit(1);
  return result[0] ?? null;
}

export async function listPartnerSubmissions() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.select().from(partnerSubmissions).orderBy(desc(partnerSubmissions.updatedAt)).limit(500);
}

export async function updatePartnerSubmission(id: number, data: Partial<InsertPartnerSubmission>) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(partnerSubmissions).set(data).where(eq(partnerSubmissions.id, id));
  return getPartnerSubmissionById(id);
}

export async function createFeedback(data: InsertFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.insert(feedbacks).values(data);
  return getFeedbackById(Number(result[0].insertId));
}

export async function getFeedbackById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const result = await db.select().from(feedbacks).where(eq(feedbacks.id, id)).limit(1);
  return result[0] ?? null;
}

export async function listFeedbacks() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt)).limit(500);
}

export async function markFeedbackRead(id: number, isRead: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.update(feedbacks).set({ isRead }).where(eq(feedbacks.id, id));
  return getFeedbackById(id);
}

export async function recordUsageEvent(data: InsertUsageEvent) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.insert(usageEvents).values(data);
  return { success: true } as const;
}

export async function getUsageMetrics() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");

  const [totalRow] = await db.select({ total: sql<number>`count(*)` }).from(usageEvents);
  const byEvent = await db.select({ eventName: usageEvents.eventName, total: sql<number>`count(*)` }).from(usageEvents).groupBy(usageEvents.eventName);
  const topCities = await db.select({ citySlug: usageEvents.citySlug, total: sql<number>`count(*)` }).from(usageEvents).where(isNotNull(usageEvents.citySlug)).groupBy(usageEvents.citySlug).orderBy(desc(sql`count(*)`)).limit(5);
  const topItems = await db.select({ itemId: usageEvents.itemId, total: sql<number>`count(*)` }).from(usageEvents).where(isNotNull(usageEvents.itemId)).groupBy(usageEvents.itemId).orderBy(desc(sql`count(*)`)).limit(5);
  const countFor = (eventName: string) => Number(byEvent.find(row => row.eventName === eventName)?.total ?? 0);

  return {
    totalEvents: Number(totalRow?.total ?? 0),
    foodContextOpens: countFor("food_context_opened"),
    routeOpens: countFor("route_opened"),
    topCities: topCities.map(row => ({ citySlug: row.citySlug ?? "", total: Number(row.total) })),
    topItems: topItems.map(row => ({ itemId: row.itemId ?? "", total: Number(row.total) })),
  };
}
