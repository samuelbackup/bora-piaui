/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, LoaderCircle, RotateCcw } from "lucide-react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

export type MapStatus = "loading" | "ready" | "error";

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;
let mapScriptPromise: Promise<void> | null = null;

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

function injectScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });
}

function loadMapScript(): Promise<void> {
  if (window.google?.maps) return Promise.resolve();
  if (!mapScriptPromise) {
    mapScriptPromise = injectScript().catch((error) => {
      mapScriptPromise = null;
      throw error;
    });
  }
  return mapScriptPromise;
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
  onStatusChange?: (status: MapStatus) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
  onStatusChange,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const statusRef = useRef(onStatusChange);

  useEffect(() => {
    statusRef.current = onStatusChange;
  }, [onStatusChange]);

  const publish = (next: MapStatus) => {
    setStatus(next);
    statusRef.current?.(next);
  };

  const init = usePersistFn(async (isMounted: () => boolean) => {
    publish("loading");
    try {
      await loadMapScript();
    } catch {
      if (isMounted()) publish("error");
      return;
    }

    const container = mapContainer.current;
    if (!canInitializeMap({ isMounted: isMounted(), hasMap: map.current !== null, container }) || !container) return;

    const maps = window.google?.maps;
    if (!maps) return;

    map.current = new maps.Map(container, {
      zoom: initialZoom,
      center: initialCenter,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
      streetViewControl: true,
    });
    publish("ready");
    onMapReady?.(map.current);
  });

  const retry = () => {
    void init(() => true);
  };

  useEffect(() => {
    let isMounted = true;
    void init(() => isMounted);

    return () => {
      isMounted = false;
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
