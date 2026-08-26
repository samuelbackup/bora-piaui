import { ChevronLeft, ExternalLink, MapPinned, Phone, UtensilsCrossed } from "lucide-react";
import { Link, useRoute } from "wouter";
import { MvpContentState } from "@/components/MvpContentState";
import type { PilotItem } from "@/lib/mvpPilot";
import { mapCityRow, mapPlaceRow } from "@/lib/pilotContentAdapter";
import { trackMvpEvent } from "@/lib/mvpEvents";
import { trpc } from "@/lib/trpc";

function SourceLine({ name, url, verifiedAt }: { name: string; url: string; verifiedAt: string }) {
  return <p className="text-xs leading-5 text-[#67705D]">Fonte: <a href={url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#566B37] underline decoration-[#566B37]/35 underline-offset-2">{name}</a> · {verifiedAt}</p>;
}

export default function PilotPlacePage() {
  const [, params] = useRoute("/cidades/:citySlug/locais/:itemSlug");
  const citySlug = params?.citySlug ?? "";
  const itemSlug = params?.itemSlug ?? "";
  const enabled = citySlug.length > 0 && itemSlug.length > 0;
  const placeQuery = trpc.cityPlaces.getByCityAndSlug.useQuery({ citySlug, itemSlug }, { enabled });

  if (placeQuery.isPending || !enabled) {
    return <main className="min-h-screen bg-[#F5ECD8] px-4 py-16 sm:px-6"><div className="mx-auto max-w-2xl"><MvpContentState kind="loading" title="Preparando o lugar" description="Organizando contexto, fonte e ações de visita." /></div></main>;
  }

  if (placeQuery.error?.data?.code === "NOT_FOUND" || !placeQuery.data) {
    return <main className="min-h-screen bg-[#F5ECD8] px-4 py-16 sm:px-6"><div className="mx-auto max-w-2xl"><MvpContentState kind="error" title="Local fora do recorte atual" description="Este endereço não está entre os lugares publicados para as cidades-piloto." action={<Link href={`/cidades/${citySlug}`} className="tap inline-flex items-center gap-2 rounded-full bg-[#3C482D] px-4 py-2.5 text-sm font-extrabold text-white"><ChevronLeft className="h-4 w-4" /> Voltar</Link>} /></div></main>;
  }

  if (placeQuery.error) {
    return <main className="min-h-screen bg-[#F5ECD8] px-4 py-16 sm:px-6"><div className="mx-auto max-w-2xl"><MvpContentState kind="error" title="Não foi possível carregar o local" description="Ocorreu uma falha de conexão com o acervo editorial. Verifique sua internet e tente novamente." action={<button onClick={() => { void placeQuery.refetch(); }} className="tap rounded-full bg-[#3C482D] px-4 py-2.5 text-sm font-extrabold text-white">Tentar novamente</button>} /></div></main>;
  }

  const item: PilotItem = mapPlaceRow(placeQuery.data.place, citySlug);
  const city = mapCityRow(placeQuery.data.city);

  return <div className="min-h-screen bg-[#F5ECD8] text-[#2E3222]"><header className="border-b border-[#3C482D]/12 bg-[#F5ECD8]/95 backdrop-blur"><div className="mx-auto flex min-h-[72px] max-w-5xl items-center px-4 sm:px-6"><Link href={`/cidades/${city.slug}`} className="tap inline-flex items-center gap-2 text-sm font-extrabold text-[#566B37] hover:text-[#B9572D]"><ChevronLeft className="h-4 w-4" /> Voltar para {city.name}</Link></div></header><main><section className="px-4 py-12 sm:px-6 lg:px-8" style={{ background: `linear-gradient(135deg, ${city.accent} 0%, #3C482D 72%)` }}><div className="mx-auto max-w-5xl text-white"><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/70">{city.name} · {item.category}</p><h1 className="display-font mt-4 max-w-3xl text-5xl leading-none tracking-[-0.06em] sm:text-6xl">{item.title}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{item.summary}</p></div></section><section className="px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_.9fr]"><div>{item.image ? <figure><img src={item.image.url} alt={item.image.alt} className="h-[320px] w-full rounded-[2rem] object-cover" />{item.image.credit && <figcaption className="mt-2 text-[11px] leading-5 text-[#66705E]">Imagem: {item.image.credit}{item.image.licenseUrl ? <> · <a href={item.image.licenseUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-[#B9572D]/60 underline-offset-2">{item.image.license ?? "licença"}</a></> : item.image.license ? ` · ${item.image.license}` : null}</figcaption>}</figure> : <MvpContentState kind="missing-image" title="Imagem em curadoria" description="Este espaço será preenchido somente com imagem creditada e texto alternativo revisado." />}</div><div className="rounded-[2rem] border border-[#3C482D]/14 bg-[#FFFDF6] p-6"><p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#566B37]">Como usar esta informação</p><h2 className="display-font mt-3 text-3xl tracking-[-0.05em]">Decida com contexto e confirme a operação.</h2><p className="mt-3 text-sm leading-6 text-[#66705E]">Este lugar integra uma curadoria pública. Horários, disponibilidade e demais condições devem ser confirmados antes da visita.</p><div className="mt-5"><SourceLine {...item.source} /></div><div className="mt-6 flex flex-wrap gap-2">{item.routeUrl && <a href={item.routeUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackMvpEvent("open_route", { item: item.id, source: "pilot_place" })} className="tap inline-flex items-center gap-2 rounded-full bg-[#3C482D] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[#566B37]"><MapPinned className="h-4 w-4" /> Abrir rota</a>}{city.slug === "teresina" && item.kind === "attraction" && <Link href={`/cidades/${city.slug}?para-comer=${item.id}#para-comer`} onClick={() => trackMvpEvent("search", { scope: "food_by_anchor", anchor: item.id })} className="tap inline-flex items-center gap-2 rounded-full border border-[#B9572D]/35 px-4 py-2.5 text-sm font-extrabold text-[#803B20] hover:bg-[#F3E1CF]"><UtensilsCrossed className="h-4 w-4 text-[#B9572D]" /> Ver opções para comer perto deste ponto</Link>}{item.contactUrl && <a href={item.contactUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackMvpEvent("open_external_link", { item: item.id, source: "contact" })} className="tap inline-flex items-center gap-2 rounded-full border border-[#3C482D]/18 px-4 py-2.5 text-sm font-extrabold text-[#3C482D]"><Phone className="h-4 w-4 text-[#B9572D]" /> Contato</a>}{item.externalUrl && <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackMvpEvent("open_external_link", { item: item.id, source: "place_source" })} className="tap inline-flex items-center gap-2 rounded-full border border-[#3C482D]/18 px-4 py-2.5 text-sm font-extrabold text-[#3C482D]"><ExternalLink className="h-4 w-4" /> Fonte</a>}</div></div></div></section></main></div>;
}
