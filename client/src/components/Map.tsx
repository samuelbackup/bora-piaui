import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AlertTriangle, LoaderCircle, RotateCcw } from "lucide-react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

export type MapStatus = "loading" | "ready" | "error";

export function canInitializeMap({
  isMounted,
  hasMap,
  container,
}: {
  isMounted: boolean;
  hasMap: boolean;
  container: HTMLDivElement | null;
}): boolean {
  return isMounted && !hasMap && container !== null;
}

interface MapViewProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  onMapReady?: (map: L.Map) => void;
  onStatusChange?: (status: MapStatus) => void;
}

export function MapView({
  className,
  initialCenter = [-7.0, -42.1],
  initialZoom = 6,
  onMapReady,
  onStatusChange,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const statusRef = useRef(onStatusChange);

  useEffect(() => {
    statusRef.current = onStatusChange;
  }, [onStatusChange]);

  const publish = (next: MapStatus) => {
    setStatus(next);
    statusRef.current?.(next);
  };

  const init = usePersistFn((isMounted: () => boolean) => {
    const container = mapContainer.current;
    if (!canInitializeMap({ isMounted: isMounted(), hasMap: map.current !== null, container }) || !container) {
      return;
    }
    try {
      const instance = L.map(container, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(instance);
      map.current = instance;
      publish("ready");
      onMapReady?.(instance);
    } catch (error) {
      console.error("[Map] failed to init:", error);
      if (isMounted()) publish("error");
    }
  });

  const retry = () => {
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    init(() => true);
  };

  useEffect(() => {
    let isMounted = true;
    init(() => isMounted);
    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [init]);

  return (
    <div className={cn("relative", className)}>
      <div ref={mapContainer} className="h-full w-full" aria-hidden={status !== "ready"} />
      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" ? "Carregando o mapa…" : status === "error" ? "Não foi possível carregar o mapa." : "Mapa carregado."}
      </div>
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-[#E6D4AA]/60 backdrop-blur-[1px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3C482D]/12 bg-[#FFFDF6]/95 px-4 py-2 text-xs font-extrabold text-[#3C482D] shadow-sm">
            <LoaderCircle className="h-4 w-4 animate-spin text-[#B9572D]" />
            Carregando o mapa…
          </span>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-[#E6D4AA] p-6">
          <div className="max-w-sm rounded-2xl border border-[#B9572D]/30 bg-[#FFFDF6] p-5 text-center shadow-sm">
            <AlertTriangle className="mx-auto h-6 w-6 text-[#B9572D]" />
            <p className="mt-3 font-extrabold text-[#3C482D]">O mapa não carregou agora.</p>
            <p className="mt-1 text-xs leading-5 text-[#66705E]">Verifique sua conexão e tente de novo — os destinos continuam disponíveis nos filtros acima.</p>
            <button type="button" onClick={retry} className="tap mt-4 inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#CD6D45]">
              <RotateCcw className="h-3.5 w-3.5" /> Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
