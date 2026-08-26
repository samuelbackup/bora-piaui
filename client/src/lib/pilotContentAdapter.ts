import type { CuratedBusiness, PilotCity, PilotCurationTopic, PilotEditorialHighlight, PilotItem, PilotProximityRelation, SourceReference } from "@/lib/mvpPilot";

export type SourceFields = {
  sourceName: string;
  sourceUrl: string;
  sourceVerifiedAt: string;
  sourceResponsible: string | null;
};

export type CityRow = {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  accent: string;
} & SourceFields;

export type PlaceImageRow = {
  url: string;
  alt: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
};

export type PlaceRow = {
  externalId: string;
  slug: string;
  kind: "attraction" | "business";
  title: string;
  category: string;
  summary: string;
  image: PlaceImageRow | null;
  routeUrl: string | null;
  contactUrl: string | null;
  externalUrl: string | null;
  mapQuery: string;
  accent: string;
  operationalStatus: "confirmed" | "verify" | "unavailable";
  editorialStatus: "published" | "pending";
} & SourceFields;

export type BusinessRow = {
  externalId: string;
  kind: "restaurant" | "service";
  anchorPlaceIds: string[];
  title: string;
  category: string;
  summary: string;
  routeUrl: string | null;
  contactUrl: string | null;
  editorialStatus: "published" | "pending";
} & SourceFields;

export type TopicRow = {
  externalId: string;
  category: "gastronomy" | "service";
  title: string;
  description: string;
  status: "curating" | "published";
};

export type HighlightRow = {
  externalId: string;
  title: string;
  description: string;
} & SourceFields;

export type ProximityRelationRow = {
  externalId: string;
  category: string;
  editorialReason: string;
  anchorExternalId: string;
  relatedExternalId: string;
} & SourceFields;

function toSource(fields: SourceFields): SourceReference {
  return {
    name: fields.sourceName,
    url: fields.sourceUrl,
    verifiedAt: fields.sourceVerifiedAt,
    ...(fields.sourceResponsible ? { responsible: fields.sourceResponsible } : {}),
  };
}

export function mapCityRow(row: CityRow): PilotCity {
  return {
    slug: row.slug,
    name: row.name,
    eyebrow: row.eyebrow,
    summary: row.summary,
    accent: row.accent,
    source: toSource(row),
  };
}

export function mapPlaceRow(row: PlaceRow, citySlug: string): PilotItem {
  return {
    id: row.externalId,
    slug: row.slug,
    citySlug,
    kind: row.kind,
    title: row.title,
    category: row.category,
    summary: row.summary,
    image: row.image ?? undefined,
    routeUrl: row.routeUrl ?? undefined,
    contactUrl: row.contactUrl ?? undefined,
    externalUrl: row.externalUrl ?? undefined,
    mapQuery: row.mapQuery,
    accent: row.accent,
    operationalStatus: row.operationalStatus,
    source: toSource(row),
    status: row.editorialStatus === "published" ? "published" : "pending",
  };
}

export function mapBusinessRow(row: BusinessRow, citySlug: string): CuratedBusiness {
  return {
    id: row.externalId,
    citySlug,
    kind: row.kind,
    anchorItemIds: row.anchorPlaceIds,
    title: row.title,
    category: row.category,
    summary: row.summary,
    routeUrl: row.routeUrl ?? undefined,
    contactUrl: row.contactUrl ?? undefined,
    source: toSource(row),
    status: row.editorialStatus === "published" ? "published" : "pending",
  };
}

export function mapTopicRow(row: TopicRow, citySlug: string): PilotCurationTopic {
  return {
    id: row.externalId,
    citySlug,
    category: row.category,
    title: row.title,
    description: row.description,
    status: row.status,
  };
}

export function mapHighlightRow(row: HighlightRow, citySlug: string): PilotEditorialHighlight {
  return {
    id: row.externalId,
    citySlug,
    title: row.title,
    description: row.description,
    source: toSource(row),
  };
}

export function mapProximityRelationRow(row: ProximityRelationRow): PilotProximityRelation {
  return {
    id: row.externalId,
    anchorItemId: row.anchorExternalId,
    relatedItemId: row.relatedExternalId,
    category: row.category,
    editorialReason: row.editorialReason,
    source: toSource(row),
  };
}
