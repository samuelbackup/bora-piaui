import { useCallback, useEffect, useRef, useState } from "react";
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

export function HeritageMap({
  places,
  activePlaceId,
  onSelect,
}: HeritageMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markers = useRef(
    new Map<
      string,
      { marker: google.maps.Marker; position: google.maps.LatLngLiteral }
    >()
  );
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
      const resolved = await Promise.all(
        places.map(
          place =>
            new Promise<{
              place: HeritagePlace;
              position: google.maps.LatLngLiteral | null;
            }>(resolve => {
              geocoder.geocode(
                { address: `${place.mapQuery}, Piauí, Brasil` },
                (matches, status) => {
                  const location =
                    status === "OK" && matches?.[0]
                      ? matches[0].geometry.location
                      : null;
                  resolve({
                    place,
                    position: location
                      ? { lat: location.lat(), lng: location.lng() }
                      : null,
                  });
                }
              );
            })
        )
      );

      resolved.forEach(({ place, position }, index) => {
        if (!position) return;
        bounds.extend(position);
        const marker = new google.maps.Marker({
          map,
          position,
          title: `${place.title} · ${place.place}`,
          label: {
            text: String(index + 1),
            color: "#FFFDF6",
            fontWeight: "700",
          },
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

      if (!bounds.isEmpty()) map.fitBounds(bounds, 78);
      setReady(true);
    },
    [clearMarkers, places]
  );

  useEffect(() => {
    if (mapRef.current) void createMarkers(mapRef.current);
  }, [createMarkers]);

  useEffect(() => {
    if (!activePlaceId || !mapRef.current) return;
    const current = markers.current.get(activePlaceId);
    if (!current) return;
    mapRef.current.panTo(current.position);
    mapRef.current.setZoom(10);
    current.marker.setAnimation(google.maps.Animation.BOUNCE);
    const timeout = window.setTimeout(
      () => current.marker.setAnimation(null),
      700
    );
    return () => window.clearTimeout(timeout);
  }, [activePlaceId, ready]);

  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-[#3C482D]/15 bg-[#E6D4AA] shadow-[0_18px_55px_rgba(59,70,42,.14)]">
      <MapView
        initialCenter={{ lat: -7.0, lng: -42.1 }}
        initialZoom={6}
        className="h-[410px] sm:h-[540px]"
        onMapReady={map => {
          mapRef.current = map;
          map.setOptions({
            mapTypeControl: false,
            streetViewControl: false,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#f1e5ca" }] },
              {
                elementType: "labels.text.fill",
                stylers: [{ color: "#564b35" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#9bc5c7" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#bed0a4" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#ffffff" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#e0cfae" }],
              },
            ],
          });
          void createMarkers(map);
        }}
      />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 bg-[#E6D4AA]">
          <div className="absolute -left-[10%] top-[30%] h-32 w-[122%] rotate-[-9deg] rounded-[50%] border-y-[4px] border-[#9BC5C7]/75" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(86,107,55,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(86,107,55,.2) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
        </div>
      )}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#FFFDF6]/95 px-3 py-2 text-xs font-extrabold text-[#3C482D] shadow-sm backdrop-blur">
        {ready ? (
          <MapPin className="h-4 w-4 text-[#B9572D]" />
        ) : (
          <LoaderCircle className="h-4 w-4 animate-spin text-[#B9572D]" />
        )}
        {ready
          ? `${places.length} lugares históricos no mapa`
          : "Localizando patrimônios"}
      </div>
    </div>
  );
}
