import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Destination,
  DestinationImage,
  destinationImages,
  destinations,
  InsertDestination,
  InsertDestinationImage,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type DestinationWithImages = Destination & { images: DestinationImage[] };

async function attachImages(rows: Destination[]): Promise<DestinationWithImages[]> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  if (!rows.length) return [];
  const imageRows = await db.select().from(destinationImages).orderBy(asc(destinationImages.sortOrder), asc(destinationImages.id));
  return rows.map(destination => ({
    ...destination,
    images: imageRows.filter(image => image.destinationId === destination.id),
  }));
}

export async function listPublishedDestinations() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db.select().from(destinations).where(eq(destinations.published, true)).orderBy(asc(destinations.title));
  return attachImages(rows);
}

export async function listAllDestinations() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db.select().from(destinations).orderBy(desc(destinations.updatedAt));
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
