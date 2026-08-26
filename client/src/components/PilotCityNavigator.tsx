import { MapPinned } from "lucide-react";
import { Link } from "wouter";
import type { PilotCity } from "@/lib/mvpPilot";

type PilotCityNavigatorProps = {
  cities: PilotCity[];
  currentSlug: string;
};

export function PilotCityNavigator({
  cities,
  currentSlug,
}: PilotCityNavigatorProps) {
  return (
    <nav
      aria-label="Cidades-piloto"
      className="border-b border-[#3C482D]/12 bg-[#FFF8EA]"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex shrink-0 items-center gap-2 text-[#566B37]">
            <MapPinned className="h-4 w-4 text-[#B9572D]" aria-hidden="true" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em]">
              Cidades-piloto
            </p>
          </div>
          <div
            className="flex gap-2 overflow-x-auto pb-1 sm:justify-end sm:pb-0"
            aria-label="Alternar cidade"
          >
            {cities.map(city => {
              const isCurrent = city.slug === currentSlug;
              const className =
                "tap inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8EA]";

              if (isCurrent) {
                return (
                  <span
                    key={city.slug}
                    aria-current="page"
                    className={`${className} bg-[#3C482D] text-white`}
                  >
                    {city.name}
                  </span>
                );
              }

              return (
                <Link
                  key={city.slug}
                  href={`/cidades/${city.slug}`}
                  className={`${className} border border-[#3C482D]/18 bg-[#FFFDF6] text-[#3C482D] hover:bg-[#EDE0C4]`}
                >
                  {city.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
