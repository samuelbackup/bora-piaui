import { useEffect } from "react";
import { MVP_USAGE_EVENT_NAME, type MvpUsageEvent } from "@/lib/mvpEvents";
import { trpc } from "@/lib/trpc";

export function MvpUsageEventBridge() {
  const { mutate } = trpc.metrics.track.useMutation();

  useEffect(() => {
    const onUsageEvent = (event: Event) => {
      const detail = (event as CustomEvent<MvpUsageEvent>).detail;
      if (!detail) return;
      mutate(detail, {
        onError: () => {
          // Métricas são opcionais e não devem interferir na jornada pública.
        },
      });
    };
    window.addEventListener(MVP_USAGE_EVENT_NAME, onUsageEvent);
    return () => window.removeEventListener(MVP_USAGE_EVENT_NAME, onUsageEvent);
  }, [mutate]);

  return null;
}
