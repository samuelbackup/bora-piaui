/* Cerrado e Rios — Atlas estadual: mapa é uma camada de decisão, com marcadores por polo e foco territorial amplo. */
import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import { ArrowRight, LoaderCircle, MapPin } from "lucide-react";
import { MapView } from "@/components/Map";
import { Link } from "wouter";

export type MappedPlace = {
  id: string;
  title: string;
  municipality: string;
  category: string;
  mapQuery: string;
  accent: string;
};

type PiauiMapProps = {
  places: MappedPlace[];
  activePlaceId: string | null;
  onSelect: (placeId: string) => void;
};

async function geocode(query: string): Promise<[number, number] | null> {
  try {
    const url = new URL("/api/geocode", window.location.origin);
    url.searchParams.set("q", `${query}, Piauí, Brasil`);
    const response = await fetch(url.toString());
    if (!response.ok) return null;
    const data = (await response.json()) as { lat: number | null; lng: number | null };
    if (data.lat == null || data.lng == null) return null;
    return [data.lat, data.lng];
  } catch {
    return null;
  }
}

function buildMarkerIcon(index: number, accent: string): L.DivIcon {
  return L.divIcon({
    className: "leaflet-heritage-marker",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9999px;background:${accent};color:#FFFDF6;font-weight:800;font-size:14px;border:3px solid #FFFDF6;box-shadow:0 4px 12px rgba(45,54,34,.28);">${index + 1}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

export function PiauiMap({ places, activePlaceId, onSelect }: PiauiMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, { marker: L.Marker; position: [number, number] }>());
  const onSelectRef = useRef(onSelect);
  const runIdRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const activePlace = activePlaceId ? places.find((place) => place.id === activePlaceId) ?? null : null;

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const clearMarkers = useCallback(() => {
    markers.current.forEach(({ marker }) => marker.remove());
    markers.current.clear();
  }, []);

  const createMarkers = useCallback(
    async (map: L.Map) => {
      const runId = ++runIdRef.current;
      setReady(false);
      clearMarkers();
      const results = await Promise.all(
        places.map(async (place) => {
          const position = await geocode(place.mapQuery);
          return { place, position };
        }),
      );

      if (runId !== runIdRef.current) return;

      const bounds = L.latLngBounds([]);
      results.forEach(({ place, position }, index) => {
        if (!position) return;
        const marker = L.marker(position, {
          title: `${place.title} · ${place.municipality}`,
          icon: buildMarkerIcon(index, place.accent),
        });
        marker.on("click", () => onSelectRef.current(place.id));
        marker.addTo(map);
        markers.current.set(place.id, { marker, position });
        bounds.extend(position);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [76, 76] });
        if (markers.current.size === 1) map.setZoom(8);
      }
      setReady(true);
    },
    [clearMarkers, places],
  );

  useEffect(() => {
    if (mapRef.current) void createMarkers(mapRef.current);
  }, [createMarkers]);

  useEffect(() => {
    if (!activePlaceId || !mapRef.current) return;
    const current = markers.current.get(activePlaceId);
    if (!current) return;
    mapRef.current.flyTo(current.position, 8, { duration: 0.8 });
    const el = current.marker.getElement();
    if (el) {
      el.classList.add("leaflet-marker-bounce");
      const timeout = window.setTimeout(() => el.classList.remove("leaflet-marker-bounce"), 700);
      return () => window.clearTimeout(timeout);
    }
  }, [activePlaceId, ready]);

  return (
    <div role="region" aria-label={`Mapa com ${places.length} ${places.length === 1 ? "destino" : "destinos"}`} aria-busy={!ready && !mapFailed} className="relative overflow-hidden rounded-[1.8rem] border border-[#3C482D]/15 bg-[#E6D4AA] shadow-[0_18px_55px_rgba(59,70,42,.14)]">
      <MapView
        initialCenter={[-6.45, -42.75]}
        initialZoom={6}
        className="h-[440px] sm:h-[560px]"
        onStatusChange={status => setMapFailed(status === "error")}
        onMapReady={(map) => {
          mapRef.current = map;
          void createMarkers(map);
        }}
      />
      {!ready && !mapFailed && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#E6D4AA]">
          <div className="absolute -left-[8%] top-[22%] h-28 w-[122%] rotate-[-10deg] rounded-[50%] border-y-[4px] border-[#9BC5C7]/75" />
          <div className="absolute -left-[6%] top-[49%] h-44 w-[118%] rotate-[8deg] border-t-[3px] border-dashed border-[#B9572D]/55" />
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(86,107,55,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(86,107,55,.2) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
          {places.slice(0, 6).map((place, index) => (
            <span key={place.id} className="absolute z-10 grid h-10 w-10 place-items-center rounded-full border-4 border-[#FFFDF6] bg-[#B9572D] text-sm font-extrabold text-white shadow-lg" style={{ left: `${12 + index * 14}%`, top: `${30 + (index % 3) * 18}%` }}>
              {index + 1}
            </span>
          ))}
          <div className="absolute bottom-5 left-5 rounded-2xl border border-[#3C482D]/10 bg-[#FFFDF6]/95 px-4 py-3 text-xs font-bold text-[#3C482D] shadow-sm">
            Preparando o mapa de percursos do Piauí
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#FFFDF6]/95 px-3 py-2 text-xs font-extrabold text-[#3C482D] shadow-sm backdrop-blur">
        {ready ? <MapPin className="h-4 w-4 text-[#B9572D]" /> : <LoaderCircle className="h-4 w-4 animate-spin text-[#B9572D]" />}
        {ready ? `${places.length} ${places.length === 1 ? "destino" : "destinos"} no mapa` : "Atualizando mapa"}
      </div>
      <div id="mapa-destino-ativo" role="status" aria-live="polite" aria-atomic="true" className="pointer-events-auto absolute bottom-4 left-4 right-4 flex max-w-md items-center gap-2 rounded-2xl border border-[#FFFDF6]/15 bg-[#3C482D]/95 px-3 py-2.5 text-[#FFFDF6] shadow-[0_12px_28px_rgba(45,54,34,.28)] backdrop-blur sm:right-auto">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A640]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#D9A640]">Destino ativo no mapa</p>
          <p className="mt-0.5 truncate text-xs font-bold leading-5">{activePlace ? `${activePlace.title} · ${activePlace.municipality}` : "Selecione um destino para localizar no mapa."}</p>
        </div>
        {activePlace && <Link href={`/destinos/${activePlace.id}`} aria-label={`Ver detalhes de ${activePlace.title}`} className="tap inline-flex shrink-0 items-center gap-1 rounded-full border border-[#FFFDF6]/35 bg-[#FFFDF6] px-2.5 py-2 text-[11px] font-extrabold text-[#3C482D] hover:bg-[#F5ECD8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A640] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3C482D]">Ver detalhes <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>}
      </div>
    </div>
  );
}
