import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import { LoaderCircle, MapPin } from "lucide-react";
import { MapView } from "@/components/Map";

export type HeritagePlace = {
  id: string;
  title: string;
  place: string;
  mapQuery: string;
  accent: string;
};

type HeritageMapProps = {
  places: HeritagePlace[];
  activePlaceId: string | null;
  onSelect: (id: string) => void;
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

export function HeritageMap({ places, activePlaceId, onSelect }: HeritageMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, { marker: L.Marker; position: [number, number] }>());
  const onSelectRef = useRef(onSelect);
  const runIdRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const clearMarkers = useCallback(() => {
    markers.current.forEach(({ marker }) => marker.remove());
    markers.current.clear();
  }, []);

  const createMarkers = useCallback(async (map: L.Map) => {
    const runId = ++runIdRef.current;
    setReady(false);
    clearMarkers();
    const resolved = await Promise.all(
      places.map(async (place) => {
        const position = await geocode(place.mapQuery);
        return { place, position };
      }),
    );

    if (runId !== runIdRef.current) return;

    const bounds = L.latLngBounds([]);
    resolved.forEach(({ place, position }, index) => {
      if (!position) return;
      const marker = L.marker(position, {
        title: `${place.title} · ${place.place}`,
        icon: buildMarkerIcon(index, place.accent),
      });
      marker.on("click", () => onSelectRef.current(place.id));
      marker.addTo(map);
      markers.current.set(place.id, { marker, position });
      bounds.extend(position);
    });

    if (bounds.isValid()) map.fitBounds(bounds, { padding: [78, 78] });
    setReady(true);
  }, [clearMarkers, places]);

  useEffect(() => {
    if (mapRef.current) void createMarkers(mapRef.current);
  }, [createMarkers]);

  useEffect(() => {
    if (!activePlaceId || !mapRef.current) return;
    const current = markers.current.get(activePlaceId);
    if (!current) return;
    mapRef.current.flyTo(current.position, 10, { duration: 0.8 });
    const el = current.marker.getElement();
    if (el) {
      el.classList.add("leaflet-marker-bounce");
      const timeout = window.setTimeout(() => el.classList.remove("leaflet-marker-bounce"), 700);
      return () => window.clearTimeout(timeout);
    }
  }, [activePlaceId, ready]);

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-[#3C482D]/15 bg-[#E6D4AA] shadow-[0_18px_55px_rgba(59,70,42,.14)]">
      <MapView
        initialCenter={[-7.0, -42.1]}
        initialZoom={6}
        className="h-[410px] sm:h-[540px]"
        onStatusChange={status => setMapFailed(status === "error")}
        onMapReady={(map) => {
          mapRef.current = map;
          void createMarkers(map);
        }}
      />
      {!ready && !mapFailed && <div className="pointer-events-none absolute inset-0 bg-[#E6D4AA]"><div className="absolute -left-[10%] top-[30%] h-32 w-[122%] rotate-[-9deg] rounded-[50%] border-y-[4px] border-[#9BC5C7]/75" /><div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(86,107,55,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(86,107,55,.2) 1px, transparent 1px)", backgroundSize: "34px 34px" }} /></div>}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#FFFDF6]/95 px-3 py-2 text-xs font-extrabold text-[#3C482D] shadow-sm backdrop-blur">{ready ? <MapPin className="h-4 w-4 text-[#B9572D]" /> : <LoaderCircle className="h-4 w-4 animate-spin text-[#B9572D]" />}{ready ? `${places.length} lugares históricos no mapa` : "Localizando patrimônios"}</div>
    </div>
  );
}
