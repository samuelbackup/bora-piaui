export const mvpEventNames = [
  "search",
  "view_item",
  "add_to_itinerary",
  "open_route",
  "open_contact",
  "open_external_link",
  "ui_error",
  "feedback",
] as const;

export type MvpEventName = (typeof mvpEventNames)[number];
export type MvpEventContext = Record<
  string,
  string | number | boolean | undefined
>;
export type MvpEvent = {
  name: MvpEventName;
  occurredAt: string;
  context?: MvpEventContext;
};
export type MvpUsageEventName =
  | "city_viewed"
  | "place_viewed"
  | "food_context_opened"
  | "map_search_opened"
  | "route_opened"
  | "source_opened"
  | "itinerary_opened";
export type MvpUsageEvent = {
  eventName: MvpUsageEventName;
  sessionId: string;
  citySlug?: string;
  itemId?: string;
  anchorItemId?: string;
  source?: string;
};

export const MVP_USAGE_EVENT_NAME = "bora-piaui:usage-event";
const SESSION_KEY = "bora-piaui-usage-session-v1";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function cleanIdentifier(value: unknown, max = 120) {
  return typeof value === "string" &&
    /^[a-z0-9_-]+$/.test(value) &&
    value.length <= max
    ? value
    : undefined;
}

function createSessionId() {
  if (typeof globalThis.crypto?.randomUUID === "function")
    return globalThis.crypto.randomUUID();
  return null;
}

function getUsageSessionId() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { id?: string; expiresAt?: number };
      if (
        typeof parsed.id === "string" &&
        typeof parsed.expiresAt === "number" &&
        parsed.expiresAt > Date.now()
      )
        return parsed.id;
    }
    const id = createSessionId();
    if (!id) return null;
    window.sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id, expiresAt: Date.now() + SESSION_TTL_MS })
    );
    return id;
  } catch {
    return null;
  }
}

function toUsageEvent(
  name: MvpEventName,
  context?: MvpEventContext
): Omit<MvpUsageEvent, "sessionId"> | null {
  const citySlug = cleanIdentifier(context?.city, 80);
  const itemId = cleanIdentifier(context?.item);
  const anchorItemId = cleanIdentifier(context?.anchor);
  const source =
    cleanIdentifier(context?.source, 48) ?? cleanIdentifier(context?.scope, 48);
  if (
    name === "search" &&
    (context?.scope === "pilot_city" || context?.scope === "mvp_city_card")
  )
    return { eventName: "city_viewed", citySlug, source };
  if (name === "search" && context?.scope === "food_by_anchor")
    return { eventName: "food_context_opened", citySlug, anchorItemId, source };
  if (name === "view_item")
    return {
      eventName: "place_viewed",
      citySlug,
      itemId,
      anchorItemId,
      source,
    };
  if (name === "add_to_itinerary")
    return {
      eventName: "itinerary_opened",
      citySlug,
      source: source ?? "itinerary",
    };
  if (name === "open_route")
    return {
      eventName: "route_opened",
      citySlug,
      itemId,
      anchorItemId,
      source,
    };
  if (name === "open_external_link") {
    return context?.source === "food_map_search"
      ? {
          eventName: "map_search_opened",
          citySlug,
          anchorItemId,
          source: "food_map_search",
        }
      : { eventName: "source_opened", citySlug, itemId, anchorItemId, source };
  }
  return null;
}

export function createMvpEvent(
  name: MvpEventName,
  context?: MvpEventContext
): MvpEvent {
  return { name, occurredAt: new Date().toISOString(), context };
}

export function trackMvpEvent(name: MvpEventName, context?: MvpEventContext) {
  const event = createMvpEvent(name, context);
  const usage = toUsageEvent(name, context);
  const sessionId = usage ? getUsageSessionId() : null;
  if (usage && sessionId && typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent<MvpUsageEvent>(MVP_USAGE_EVENT_NAME, {
        detail: { ...usage, sessionId },
      })
    );
  if (import.meta.env.DEV) console.info("[Bora Piauí · evento]", event);
  return event;
}
