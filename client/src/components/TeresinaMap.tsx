/* Cerrado e Rios: mapa funcional como espaço principal de decisão, com marcadores terrosos e leitura clara. */
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
  const [ready, setReady] = useState(false);

  const createMarkers = useCallback(
    async (map: google.maps.Map) => {
      const geocoder = new google.maps.Geocoder();
      const bounds = new google.maps.LatLngBounds();
      const results = await Promise.all(
        places.map(
          (place) =>
            new Promise<{ place: MappedPlace; position: google.maps.LatLngLiteral | null }>((resolve) => {
              geocoder.geocode({ address: `${place.mapQuery}, Teresina, Piauí, Brasil` }, (matches, status) => {
                const location = status === "OK" && matches?.[0] ? matches[0].geometry.location : null;
                resolve({
                  place,
                  position: location ? { lat: location.lat(), lng: location.lng() } : null,
                });
              });
            }),
        ),
      );

      results.forEach(({ place, position }) => {
        if (!position) return;
        bounds.extend(position);
        const marker = new google.maps.Marker({
          map,
          position,
          title: place.title,
          label: { text: String(places.findIndex((item) => item.id === place.id) + 1), color: "#FFFDF6", fontWeight: "700" },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: place.accent,
            fillOpacity: 1,
            strokeColor: "#FFFDF6",
            strokeWeight: 3,
            scale: 13,
          },
        });
        marker.addListener("click", () => onSelect(place.id));
        markers.current.set(place.id, { marker, position });
      });
      if (!bounds.isEmpty()) map.fitBounds(bounds, 62);
      setReady(true);
    },
    [onSelect, places],
  );

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
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#FFFDF6]/95 px-3 py-2 text-xs font-extrabold text-[#3C482D] shadow-sm backdrop-blur">
        {ready ? <MapPin className="h-4 w-4 text-[#B9572D]" /> : <LoaderCircle className="h-4 w-4 animate-spin text-[#B9572D]" />}
        {ready ? "4 lugares no mapa" : "Carregando mapa"}
      </div>
    </div>
  );
}
