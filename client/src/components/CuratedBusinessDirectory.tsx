import {
  ExternalLink,
  MapPinned,
  Phone,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { MvpContentState } from "@/components/MvpContentState";
import type { CuratedBusiness, CuratedBusinessKind } from "@/lib/mvpPilot";

type CuratedBusinessDirectoryProps = {
  cityName: string;
  kind: CuratedBusinessKind;
  entries: CuratedBusiness[];
  onEvent?: (
    action: "contact" | "route" | "source",
    entry: CuratedBusiness
  ) => void;
};

const copyByKind = {
  restaurant: {
    eyebrow: "Para comer",
    title: "Restaurantes curados",
    description:
      "Estabelecimentos só aparecem quando a curadoria confirmar fonte, contato e informações permitidas.",
    emptyTitle: "Restaurantes em curadoria",
    emptyDescription:
      "Ainda não há restaurantes publicados para esta cidade. Não exibimos opções sem fonte e canal de contato verificados.",
    Icon: UtensilsCrossed,
  },
  service: {
    eyebrow: "Para organizar a visita",
    title: "Serviços curados",
    description:
      "Canais de apoio e orientação publicados para ajudar a planejar a visita com mais segurança.",
    emptyTitle: "Serviços em curadoria",
    emptyDescription:
      "Ainda não há serviços publicados para esta cidade. O diretório será preenchido somente com canais confirmados.",
    Icon: Store,
  },
} satisfies Record<
  CuratedBusinessKind,
  {
    eyebrow: string;
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    Icon: typeof Store;
  }
>;

export function CuratedBusinessDirectory({
  cityName,
  kind,
  entries,
  onEvent,
}: CuratedBusinessDirectoryProps) {
  const copy = copyByKind[kind];
  const Icon = copy.Icon;
  const sectionId = `diretorio-${kind}-${cityName.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <section
      aria-labelledby={sectionId}
      className="border-t border-[#3C482D]/12 pt-7"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E9DCC0] text-[#566B37]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#566B37]">
            {copy.eyebrow}
          </p>
          <h2
            id={sectionId}
            className="display-font mt-1 text-2xl tracking-[-0.045em] text-[#2E3222]"
          >
            {copy.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#66705E]">
            {copy.description}
          </p>
        </div>
      </div>

      {entries.length ? (
        <div className="mt-5 grid gap-4">
          {entries.map(entry => (
            <article
              key={entry.id}
              className="rounded-[1.5rem] border border-[#3C482D]/14 bg-[#FFFDF6] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[#E9DCC0] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#566B37]">
                  {entry.category}
                </span>
                <span className="text-[11px] font-bold text-[#B9572D]">
                  Condições a confirmar
                </span>
              </div>
              <h3 className="display-font mt-4 text-2xl tracking-[-0.04em] text-[#2E3222]">
                {entry.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#66705E]">
                {entry.summary}
              </p>
              <p className="mt-4 text-xs leading-5 text-[#67705D]">
                Fonte:{" "}
                <a
                  href={entry.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#566B37] underline decoration-[#566B37]/35 underline-offset-2"
                >
                  {entry.source.name}
                </a>{" "}
                · {entry.source.verifiedAt}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {entry.contactUrl ? (
                  <a
                    href={entry.contactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Contato com ${entry.title}`}
                    onClick={() => onEvent?.("contact", entry)}
                    className="tap inline-flex items-center gap-2 rounded-full bg-[#3C482D] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#566B37]"
                  >
                    <Phone className="h-4 w-4 text-[#F5ECD8]" /> Contato
                  </a>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-[#3C482D]/10 px-4 py-2.5 text-sm font-bold text-[#7B806F]">
                    Contato não publicado
                  </span>
                )}
                {entry.routeUrl && (
                  <a
                    href={entry.routeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir rota para ${entry.title}`}
                    onClick={() => onEvent?.("route", entry)}
                    className="tap inline-flex items-center gap-2 rounded-full border border-[#3C482D]/18 px-4 py-2.5 text-sm font-extrabold text-[#3C482D] hover:bg-[#EDE0C4]"
                  >
                    <MapPinned className="h-4 w-4 text-[#B9572D]" /> Abrir rota
                  </a>
                )}
                <a
                  href={entry.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver fonte sobre ${entry.title}`}
                  onClick={() => onEvent?.("source", entry)}
                  className="tap inline-flex items-center gap-2 rounded-full border border-[#3C482D]/18 px-4 py-2.5 text-sm font-extrabold text-[#3C482D] hover:bg-[#EDE0C4]"
                >
                  <ExternalLink className="h-4 w-4" /> Ver fonte
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <MvpContentState
            compact
            kind="empty"
            title={copy.emptyTitle}
            description={copy.emptyDescription}
          />
        </div>
      )}
    </section>
  );
}
