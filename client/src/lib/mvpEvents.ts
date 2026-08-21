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

export type MvpEventName = typeof mvpEventNames[number];
export type MvpEvent = {
  name: MvpEventName;
  occurredAt: string;
  context?: Record<string, string | number | boolean | undefined>;
};

export function createMvpEvent(name: MvpEventName, context?: MvpEvent["context"]): MvpEvent {
  return { name, occurredAt: new Date().toISOString(), context };
}

export function trackMvpEvent(name: MvpEventName, context?: MvpEvent["context"]) {
  const event = createMvpEvent(name, context);
  if (import.meta.env.DEV) console.info("[Bora Piauí · evento local]", event);
  return event;
}
