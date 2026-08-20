import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle, MapPin } from "lucide-react";
import { MapView } from "@/components/Map";

export type MappedPlace = {
  id: string;
  title: string;
  district: string;
  category: string;
  mapQuery: string;
  accent: string;
};

type TeresinaMapProps = {
  places: MappedPlace[];
  activePlaceId: string | null;
  onSelect: (placeId: string) => void;
};

export function TeresinaMap({ places, activePlaceId, onSelect }: TeresinaMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markers = useRef(new Map<string, { marker: google.maps.Marker; position: google.maps.LatLngLiteral }>());
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const clearMarkers = useCallback(() => {
    markers.current.forEach(({ marker }) => marker.setMap(null));
    markers.current.clear();
  }, []);

  const createMarkers = useCallback(
    async (map: google.maps.Map) => {
      setReady(false);
      clearMarkers();
      const geocoder = new google.maps.Geocoder();
      const bounds = new google.maps.LatLngBounds();
      const results = await Promise.all(
        places.map(
          (place) =>
            new Promise<{ place: MappedPlace; position: google.maps.LatLngLiteral | null }>((resolve) => {
              geocoder.geocode({ address: `${place.mapQuery}, Teresina, Piauí, Brasil` }, (matches, status) => {
                const location = status === "OK" && matches?.[0] ? matches[0].geometry.location : null;
                resolve({ place, position: location ? { lat: location.lat(), lng: location.lng() } : null });
              });
            }),
        ),
      );

      results.forEach(({ place, position }, index) => {
        if (!position) return;
        bounds.extend(position);
        const marker = new google.maps.Marker({
          map,
          position,
          title: place.title,
          label: { text: String(index + 1), color: "#FFFDF6", fontWeight: "700" },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: place.accent,
            fillOpacity: 1,
            strokeColor: "#FFFDF6",
            strokeWeight: 3,
            scale: 13,
          },
        });
        marker.addListener("click", () => onSelectRef.current(place.id));
        markers.current.set(place.id, { marker, position });
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds, 62);
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
    mapRef.current.panTo(current.position);
    mapRef.current.setZoom(15);
    current.marker.setAnimation(google.maps.Animation.BOUNCE);
    const timeout = window.setTimeout(() => current.marker.setAnimation(null), 700);
    return () => window.clearTimeout(timeout);
  }, [activePlaceId, ready]);

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-[#3C482D]/15 bg-[#E6D4AA] shadow-[0_18px_55px_rgba(59,70,42,.14)]">
      <MapView
        initialCenter={{ lat: -5.092, lng: -42.803 }}
        initialZoom={12}
        className="h-[420px] sm:h-[520px]"
        onMapReady={(map) => {
          mapRef.current = map;
          map.setOptions({
            styles: [
              { elementType: "geometry", stylers: [{ color: "#f1e5ca" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#564b35" }] },
              { featureType: "water", elementType: "geometry", stylers: [{ color: "#9bc5c7" }] },
              { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#bed0a4" }] },
              { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
              { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e0cfae" }] },
            ],
          });
          void createMarkers(map);
        }}
      />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#E6D4AA]">
          <div className="absolute -left-[8%] top-[22%] h-28 w-[122%] rotate-[-10deg] rounded-[50%] border-y-[4px] border-[#9BC5C7]/75" />
          <div className="absolute -left-[6%] top-[49%] h-44 w-[118%] rotate-[8deg] rounded-[50%] border-t-[3px] border-dashed border-[#B9572D]/55" />
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(86,107,55,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(86,107,55,.2) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
          {places.slice(0, 5).map((place, index) => (
            <span
              key={place.id}
              className="absolute z-10 grid h-10 w-10 place-items-center rounded-full border-4 border-[#FFFDF6] bg-[#B9572D] text-sm font-extrabold text-white shadow-lg"
              style={{ left: `${15 + index * 16}%`, top: `${36 + (index % 2) * 23}%` }}
            >
              {index + 1}
            </span>
          ))}
          <div className="absolute bottom-5 left-5 rounded-2xl border border-[#3C482D]/10 bg-[#FFFDF6]/95 px-4 py-3 text-xs font-bold text-[#3C482D] shadow-sm">
            Preparando o mapa de Teresina e suas paradas
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#FFFDF6]/95 px-3 py-2 text-xs font-extrabold text-[#3C482D] shadow-sm backdrop-blur">
        {ready ? <MapPin className="h-4 w-4 text-[#B9572D]" /> : <LoaderCircle className="h-4 w-4 animate-spin text-[#B9572D]" />}
        {ready ? `${places.length} ${places.length === 1 ? "lugar" : "lugares"} no mapa` : "Atualizando mapa"}
      </div>
    </div>
  );
}
