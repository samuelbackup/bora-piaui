import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  cities,
  City,
  CityPlace,
  CurationTopic,
  CuratedBusiness,
  culturalEvents,
  CulturalEvent,
  destinationImages,
  destinations,
  Destination,
  DestinationImage,
  editorialHighlights,
  EditorialHighlight,
  InsertCulturalEvent,
  InsertDestination,
  InsertDestinationImage,
  InsertPartnerSubmission,
  InsertUser,
  itineraries,
  Itinerary,
  itineraryStops,
  PartnerSubmission,
  partnerSubmissions,
  cityPlaces,
  placeProximityRelations,
  curationTopics,
  curatedBusinesses,
  InsertUsageEvent,
  usageEvents,
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

async function requireCityId(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, citySlug: string): Promise<number | null> {
  const [city] = await db.select({ id: cities.id }).from(cities).where(eq(cities.slug, citySlug)).limit(1);
  return city?.id ?? null;
}

export type CityContentPayload = {
  places: CityPlace[];
  curationTopics: CurationTopic[];
  editorialHighlights: EditorialHighlight[];
  curatedBusinesses: CuratedBusiness[];
  proximityRelations: Array<{
    externalId: string;
    category: string;
    editorialReason: string;
    sourceName: string;
    sourceUrl: string;
    sourceVerifiedAt: string;
    sourceResponsible: string | null;
    anchorExternalId: string;
    relatedExternalId: string;
  }>;
};

export async function listCities() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.select().from(cities).where(eq(cities.published, true)).orderBy(asc(cities.name));
}

export async function getCityBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db.select().from(cities).where(and(eq(cities.slug, slug), eq(cities.published, true))).limit(1);
  return rows[0] ?? null;
}

export async function listCityContent(citySlug: string): Promise<CityContentPayload> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const cityId = await requireCityId(db, citySlug);
  if (!cityId) {
    return { places: [], curationTopics: [], editorialHighlights: [], curatedBusinesses: [], proximityRelations: [] };
  }

  const places = await db
    .select()
    .from(cityPlaces)
    .where(and(eq(cityPlaces.cityId, cityId), eq(cityPlaces.editorialStatus, "published")))
    .orderBy(asc(cityPlaces.title));
  const placeIds = new Set(places.map(place => place.id));

  const [topics, highlights, businesses] = await Promise.all([
    db.select().from(curationTopics).where(eq(curationTopics.cityId, cityId)).orderBy(asc(curationTopics.title)),
    db.select().from(editorialHighlights).where(eq(editorialHighlights.cityId, cityId)).orderBy(asc(editorialHighlights.title)),
    db
      .select()
      .from(curatedBusinesses)
      .where(and(eq(curatedBusinesses.cityId, cityId), eq(curatedBusinesses.editorialStatus, "published")))
      .orderBy(asc(curatedBusinesses.title)),
  ]);

  const relationRows = await db
    .select({
      externalId: placeProximityRelations.externalId,
      anchorPlaceId: placeProximityRelations.anchorPlaceId,
      relatedPlaceId: placeProximityRelations.relatedPlaceId,
      category: placeProximityRelations.category,
      editorialReason: placeProximityRelations.editorialReason,
      sourceName: placeProximityRelations.sourceName,
      sourceUrl: placeProximityRelations.sourceUrl,
      sourceVerifiedAt: placeProximityRelations.sourceVerifiedAt,
      sourceResponsible: placeProximityRelations.sourceResponsible,
    })
    .from(placeProximityRelations)
    .innerJoin(cityPlaces, eq(cityPlaces.id, placeProximityRelations.anchorPlaceId))
    .where(eq(cityPlaces.cityId, cityId))
    .orderBy(asc(placeProximityRelations.externalId));

  const externalIdById = new Map(places.map(place => [place.id, place.externalId]));
  const proximityRelations = relationRows
    .filter(relation => placeIds.has(relation.relatedPlaceId) && externalIdById.has(relation.anchorPlaceId) && externalIdById.has(relation.relatedPlaceId))
    .map(relation => ({
      externalId: relation.externalId,
      category: relation.category,
      editorialReason: relation.editorialReason,
      sourceName: relation.sourceName,
      sourceUrl: relation.sourceUrl,
      sourceVerifiedAt: relation.sourceVerifiedAt,
      sourceResponsible: relation.sourceResponsible,
      anchorExternalId: externalIdById.get(relation.anchorPlaceId)!,
      relatedExternalId: externalIdById.get(relation.relatedPlaceId)!,
    }));

  return { places, curationTopics: topics, editorialHighlights: highlights, curatedBusinesses: businesses, proximityRelations };
}

export type ItineraryWithCity = { itinerary: Itinerary; city: City };

export async function getItineraryBySlug(slug: string): Promise<{ itinerary: Itinerary; city: City; stops: CityPlace[] } | null> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db
    .select({ itinerary: itineraries, city: cities })
    .from(itineraries)
    .innerJoin(cities, eq(cities.id, itineraries.cityId))
    .where(and(eq(itineraries.slug, slug), eq(itineraries.dayScope, "one-day")))
    .limit(1);
  const found = rows[0];
  if (!found) return null;

  const stops = await db
    .select({ place: cityPlaces, sortOrder: itineraryStops.sortOrder })
    .from(itineraryStops)
    .innerJoin(cityPlaces, eq(cityPlaces.id, itineraryStops.placeId))
    .where(eq(itineraryStops.itineraryId, found.itinerary.id))
    .orderBy(asc(itineraryStops.sortOrder), asc(itineraryStops.id));

  return {
    itinerary: found.itinerary,
    city: found.city,
    stops: stops.filter(entry => entry.place.editorialStatus === "published").map(entry => entry.place),
  };
}

export async function getItineraryByCitySlug(citySlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db
    .select()
    .from(itineraries)
    .innerJoin(cities, eq(cities.id, itineraries.cityId))
    .where(and(eq(cities.slug, citySlug), eq(itineraries.dayScope, "one-day")))
    .limit(1);
  return rows[0]?.itineraries ?? null;
}

export async function listItineraries() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  return db.select().from(itineraries).where(eq(itineraries.dayScope, "one-day")).orderBy(asc(itineraries.title));
}

export async function getPlaceBySlugAndCity(citySlug: string, itemSlug: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const rows = await db
    .select({ place: cityPlaces, city: cities })
    .from(cityPlaces)
    .innerJoin(cities, eq(cities.id, cityPlaces.cityId))
    .where(and(eq(cities.slug, citySlug), eq(cityPlaces.slug, itemSlug), eq(cityPlaces.editorialStatus, "published")))
    .limit(1);
  return rows[0] ?? null;
}
