import "dotenv/config";
import { eq } from "drizzle-orm";
import {
  cities,
  cityPlaces,
  curatedBusinesses,
  curationTopics,
  editorialHighlights,
  itineraries,
  itineraryStops,
  placeProximityRelations,
  type InsertCity,
  type InsertCityPlace,
  type InsertCuratedBusiness,
  type InsertCurationTopic,
  type InsertEditorialHighlight,
  type InsertItinerary,
} from "../drizzle/schema";
import {
  cityInsertRowSchema,
  curatedBusinessInsertRowSchema,
  curationTopicInsertRowSchema,
  editorialHighlightInsertRowSchema,
  itineraryInsertRowSchema,
  itineraryStopInsertRowSchema,
  placeInsertRowSchema,
  proximityRelationInsertRowSchema,
} from "../../shared/pilotContent";
import { type PilotCatalog, pilotCatalog } from "../../client/src/lib/mvpPilot";

export type SeedDatabase = NonNullable<Awaited<ReturnType<typeof import("../db").getDb>>>;
type CityIdResolver = (citySlug: string) => number;
export function buildCityRows(catalog: PilotCatalog = pilotCatalog): InsertCity[] {
  return catalog.cities.map(city =>
    cityInsertRowSchema.parse({
      slug: city.slug,
      name: city.name,
      eyebrow: city.eyebrow,
      summary: city.summary,
      accent: city.accent,
      sourceName: city.source.name,
      sourceUrl: city.source.url,
      sourceVerifiedAt: city.source.verifiedAt,
      sourceResponsible: city.source.responsible ?? null,
    }),
  );
}

function resolveCityIdOrThrow(resolver: CityIdResolver, citySlug: string): number {
  const cityId = resolver(citySlug);
  if (!Number.isInteger(cityId) || cityId <= 0) {
    throw new Error(`[seed] Cidade não resolvida no banco: ${citySlug}`);
  }
  return cityId;
}

export function buildPlaceRows(resolveCityId: CityIdResolver, catalog: PilotCatalog = pilotCatalog): InsertCityPlace[] {
  return catalog.items.map(item =>
    placeInsertRowSchema.parse({
      cityId: resolveCityIdOrThrow(resolveCityId, item.citySlug),
      externalId: item.id,
      slug: item.slug,
      kind: item.kind,
      title: item.title,
      category: item.category,
      summary: item.summary,
      image: item.image ?? null,
      routeUrl: item.routeUrl ?? null,
      contactUrl: item.contactUrl ?? null,
      externalUrl: item.externalUrl ?? null,
      mapQuery: item.mapQuery,
      accent: item.accent,
      operationalStatus: item.operationalStatus,
      editorialStatus: item.status,
      sourceName: item.source.name,
      sourceUrl: item.source.url,
      sourceVerifiedAt: item.source.verifiedAt,
      sourceResponsible: item.source.responsible ?? null,
    }),
  );
}

export function buildCuratedBusinessRows(resolveCityId: CityIdResolver, catalog: PilotCatalog = pilotCatalog): InsertCuratedBusiness[] {
  return catalog.curatedBusinesses.map(business =>
    curatedBusinessInsertRowSchema.parse({
      cityId: resolveCityIdOrThrow(resolveCityId, business.citySlug),
      externalId: business.id,
      kind: business.kind,
      anchorPlaceIds: business.anchorItemIds ?? [],
      title: business.title,
      category: business.category,
      summary: business.summary,
      routeUrl: business.routeUrl ?? null,
      contactUrl: business.contactUrl ?? null,
      editorialStatus: business.status,
      sourceName: business.source.name,
      sourceUrl: business.source.url,
      sourceVerifiedAt: business.source.verifiedAt,
      sourceResponsible: business.source.responsible ?? null,
    }),
  );
}

export function buildItineraryRows(resolveCityId: CityIdResolver, catalog: PilotCatalog = pilotCatalog): InsertItinerary[] {
  return catalog.itineraries.map(itinerary =>
    itineraryInsertRowSchema.parse({
      slug: itinerary.slug,
      cityId: resolveCityIdOrThrow(resolveCityId, itinerary.citySlug),
      dayScope: itinerary.dayScope,
      title: itinerary.title,
      durationLabel: itinerary.durationLabel,
      summary: itinerary.summary,
      confirmationNotice: itinerary.confirmationNotice,
    }),
  );
}

export function buildCurationTopicRows(resolveCityId: CityIdResolver, catalog: PilotCatalog = pilotCatalog): InsertCurationTopic[] {
  return catalog.curationTopics.map(topic =>
    curationTopicInsertRowSchema.parse({
      cityId: resolveCityIdOrThrow(resolveCityId, topic.citySlug),
      externalId: topic.id,
      category: topic.category,
      title: topic.title,
      description: topic.description,
      status: topic.status === "curating" ? "curating" : "published",
    }),
  );
}

export function buildEditorialHighlightRows(resolveCityId: CityIdResolver, catalog: PilotCatalog = pilotCatalog): InsertEditorialHighlight[] {
  return catalog.editorialHighlights.map(highlight =>
    editorialHighlightInsertRowSchema.parse({
      cityId: resolveCityIdOrThrow(resolveCityId, highlight.citySlug),
      externalId: highlight.id,
      title: highlight.title,
      description: highlight.description,
      sourceName: highlight.source.name,
      sourceUrl: highlight.source.url,
      sourceVerifiedAt: highlight.source.verifiedAt,
      sourceResponsible: highlight.source.responsible ?? null,
    }),
  );
}

export function assertCatalogIntegrity(catalog: PilotCatalog = pilotCatalog): void {
  const problems: string[] = [];
  const citySlugs = new Set(catalog.cities.map(city => city.slug));
  const placeIds = new Set(catalog.items.map(item => item.id));

  for (const item of [...catalog.items, ...catalog.curatedBusinesses]) {
    if (!citySlugs.has(item.citySlug)) problems.push(`Cidade inexistente para "${item.id}": ${item.citySlug}`);
  }
  for (const itinerary of catalog.itineraries) {
    if (!citySlugs.has(itinerary.citySlug)) problems.push(`Cidade inexistente para o roteiro "${itinerary.slug}"`);
    for (const stopId of itinerary.stopIds) {
      if (!placeIds.has(stopId)) problems.push(`Parada inexistente no roteiro "${itinerary.slug}": ${stopId}`);
    }
  }
  for (const relation of catalog.proximityRelations) {
    if (!placeIds.has(relation.anchorItemId)) problems.push(`Âncora inexistente na relação "${relation.id}": ${relation.anchorItemId}`);
    if (!placeIds.has(relation.relatedItemId)) problems.push(`Item relacionado inexistente na relação "${relation.id}": ${relation.relatedItemId}`);
  }
  for (const business of catalog.curatedBusinesses) {
    for (const anchorId of business.anchorItemIds ?? []) {
      if (!placeIds.has(anchorId)) problems.push(`Âncora inexistente no negócio "${business.id}": ${anchorId}`);
    }
  }
  for (const topic of catalog.curationTopics) {
    if (!citySlugs.has(topic.citySlug)) problems.push(`Cidade inexistente para o tópico "${topic.id}"`);
  }
  for (const highlight of catalog.editorialHighlights) {
    if (!citySlugs.has(highlight.citySlug)) problems.push(`Cidade inexistente para o destaque "${highlight.id}"`);
  }

  if (problems.length) {
    throw new Error(`[seed] Catálogo inconsistente:\n${problems.map(problem => `- ${problem}`).join("\n")}`);
  }
}

async function upsertCity(db: SeedDatabase, row: InsertCity): Promise<number> {
  await db.insert(cities).values(row).onDuplicateKeyUpdate({
    set: {
      name: row.name,
      eyebrow: row.eyebrow,
      summary: row.summary,
      accent: row.accent,
      sourceName: row.sourceName,
      sourceUrl: row.sourceUrl,
      sourceVerifiedAt: row.sourceVerifiedAt,
      sourceResponsible: row.sourceResponsible ?? null,
      published: row.published ?? true,
    },
  });
  const [saved] = await db.select({ id: cities.id }).from(cities).where(eq(cities.slug, row.slug)).limit(1);
  if (!saved) throw new Error(`[seed] Cidade não encontrada após upsert: ${row.slug}`);
  return saved.id;
}

async function upsertPlace(db: SeedDatabase, row: InsertCityPlace): Promise<number> {
  await db.insert(cityPlaces).values(row).onDuplicateKeyUpdate({
    set: {
      cityId: row.cityId,
      slug: row.slug,
      kind: row.kind,
      title: row.title,
      category: row.category,
      summary: row.summary,
      image: row.image ?? null,
      routeUrl: row.routeUrl ?? null,
      contactUrl: row.contactUrl ?? null,
      externalUrl: row.externalUrl ?? null,
      mapQuery: row.mapQuery,
      accent: row.accent,
      operationalStatus: row.operationalStatus,
      editorialStatus: row.editorialStatus,
      sourceName: row.sourceName,
      sourceUrl: row.sourceUrl,
      sourceVerifiedAt: row.sourceVerifiedAt,
      sourceResponsible: row.sourceResponsible ?? null,
    },
  });
  const [saved] = await db.select({ id: cityPlaces.id }).from(cityPlaces).where(eq(cityPlaces.externalId, row.externalId)).limit(1);
  if (!saved) throw new Error(`[seed] Local não encontrado após upsert: ${row.externalId}`);
  return saved.id;
}

async function upsertItinerary(db: SeedDatabase, row: InsertItinerary): Promise<number> {
  await db.insert(itineraries).values(row).onDuplicateKeyUpdate({
    set: {
      cityId: row.cityId,
      dayScope: row.dayScope,
      title: row.title,
      durationLabel: row.durationLabel,
      summary: row.summary,
      confirmationNotice: row.confirmationNotice,
    },
  });
  const [saved] = await db.select({ id: itineraries.id }).from(itineraries).where(eq(itineraries.slug, row.slug)).limit(1);
  if (!saved) throw new Error(`[seed] Roteiro não encontrado após upsert: ${row.slug}`);
  return saved.id;
}

export async function seedPilotCatalog(db: SeedDatabase, catalog: PilotCatalog = pilotCatalog) {
  assertCatalogIntegrity(catalog);

  const cityIds = new Map<string, number>();
  let cityCount = 0;
  for (const row of buildCityRows(catalog)) {
    cityIds.set(row.slug, await upsertCity(db, row));
    cityCount += 1;
  }
  const resolveCityId: CityIdResolver = citySlug => cityIds.get(citySlug) ?? 0;

  const placeIds = new Map<string, number>();
  let placeCount = 0;
  for (const row of buildPlaceRows(resolveCityId, catalog)) {
    placeIds.set(row.externalId, await upsertPlace(db, row));
    placeCount += 1;
  }

  for (const row of buildCuratedBusinessRows(resolveCityId, catalog)) {
    await db.insert(curatedBusinesses).values(row).onDuplicateKeyUpdate({
      set: {
        cityId: row.cityId,
        kind: row.kind,
        anchorPlaceIds: row.anchorPlaceIds,
        title: row.title,
        category: row.category,
        summary: row.summary,
        routeUrl: row.routeUrl ?? null,
        contactUrl: row.contactUrl ?? null,
        editorialStatus: row.editorialStatus,
        sourceName: row.sourceName,
        sourceUrl: row.sourceUrl,
        sourceVerifiedAt: row.sourceVerifiedAt,
        sourceResponsible: row.sourceResponsible ?? null,
      },
    });
  }

  const stopRows: Array<{ itineraryId: number; placeId: number; sortOrder: number }> = [];
  for (const itinerary of catalog.itineraries) {
    const row = itineraryInsertRowSchema.parse({
      slug: itinerary.slug,
      cityId: resolveCityId(itinerary.citySlug),
      dayScope: itinerary.dayScope,
      title: itinerary.title,
      durationLabel: itinerary.durationLabel,
      summary: itinerary.summary,
      confirmationNotice: itinerary.confirmationNotice,
    });
    const itineraryId = await upsertItinerary(db, row);
    await db.delete(itineraryStops).where(eq(itineraryStops.itineraryId, itineraryId));
    for (let index = 0; index < itinerary.stopIds.length; index += 1) {
      const stopId = itinerary.stopIds[index];
      const placeId = placeIds.get(stopId);
      if (!placeId) throw new Error(`[seed] Parada sem local persistido: ${stopId}`);
      const stop = itineraryStopInsertRowSchema.parse({ itineraryId, placeId, sortOrder: index });
      stopRows.push(stop);
      await db.insert(itineraryStops).values(stop);
    }
  }

  for (const relation of catalog.proximityRelations) {
    const anchorPlaceId = placeIds.get(relation.anchorItemId);
    const relatedPlaceId = placeIds.get(relation.relatedItemId);
    if (!anchorPlaceId || !relatedPlaceId) throw new Error(`[seed] Relação sem locais persistidos: ${relation.id}`);
    const row = proximityRelationInsertRowSchema.parse({
      externalId: relation.id,
      anchorPlaceId,
      relatedPlaceId,
      category: relation.category,
      editorialReason: relation.editorialReason,
      sourceName: relation.source.name,
      sourceUrl: relation.source.url,
      sourceVerifiedAt: relation.source.verifiedAt,
      sourceResponsible: relation.source.responsible ?? null,
    });
    await db.insert(placeProximityRelations).values(row).onDuplicateKeyUpdate({
      set: {
        anchorPlaceId: row.anchorPlaceId,
        relatedPlaceId: row.relatedPlaceId,
        category: row.category,
        editorialReason: row.editorialReason,
        sourceName: row.sourceName,
        sourceUrl: row.sourceUrl,
        sourceVerifiedAt: row.sourceVerifiedAt,
        sourceResponsible: row.sourceResponsible ?? null,
      },
    });
  }

  for (const row of buildCurationTopicRows(resolveCityId, catalog)) {
    await db.insert(curationTopics).values(row).onDuplicateKeyUpdate({
      set: {
        cityId: row.cityId,
        category: row.category,
        title: row.title,
        description: row.description,
        status: row.status,
      },
    });
  }

  for (const row of buildEditorialHighlightRows(resolveCityId, catalog)) {
    await db.insert(editorialHighlights).values(row).onDuplicateKeyUpdate({
      set: {
        cityId: row.cityId,
        title: row.title,
        description: row.description,
        sourceName: row.sourceName,
        sourceUrl: row.sourceUrl,
        sourceVerifiedAt: row.sourceVerifiedAt,
        sourceResponsible: row.sourceResponsible ?? null,
      },
    });
  }

  return {
    cities: cityCount,
    places: placeCount,
    curatedBusinesses: catalog.curatedBusinesses.length,
    itineraries: catalog.itineraries.length,
    itineraryStops: stopRows.length,
    proximityRelations: catalog.proximityRelations.length,
    curationTopics: catalog.curationTopics.length,
    editorialHighlights: catalog.editorialHighlights.length,
  };
}

export async function runSeed() {
  const { getDb } = await import("../db");
  const database = await getDb();
  if (!database) {
    throw new Error("[seed] DATABASE_URL ausente ou banco indisponível. Configure a variável de ambiente e aplique as migrations antes de semear.");
  }
  return seedPilotCatalog(database);
}

const invokedDirectly = Boolean(process.argv[1]?.replace(/\\/g, "/").endsWith("server/db/seed.ts"));
if (invokedDirectly) {
  runSeed()
    .then(summary => console.log(`[seed] Concluído: ${JSON.stringify(summary)}`))
    .catch(error => {
      console.error("[seed] Falhou:", error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
