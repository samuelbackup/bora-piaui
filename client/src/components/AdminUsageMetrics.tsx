import { createPortal } from "react-dom";
import { BarChart3, Loader2, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export function AdminUsageMetrics() {
  const [location] = useLocation();
  const active = location === "/admin/editorial";
  const { data, isLoading, isError } = trpc.metrics.summary.useQuery(undefined, { enabled: active });

  if (!active) return null;

  const panel = <section aria-label="Métricas agregadas de demanda" className="mt-6 rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-5 text-[#26311E] sm:p-7">
    <div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E9DCC0] text-[#B9572D]"><BarChart3 className="h-4 w-4" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#B9572D]">Demanda do MVP</p><h2 className="mt-1 text-base font-extrabold">Métricas agregadas</h2></div></div>
    {isLoading ? <p className="mt-4 flex items-center gap-2 text-sm text-[#566457]"><Loader2 className="h-4 w-4 animate-spin" />Carregando indicadores…</p> : isError ? <p className="mt-4 text-sm leading-5 text-[#566457]">A leitura é restrita a administradores autenticados. Nenhum dado pessoal é exibido.</p> : data ? <><div className="mt-4 grid grid-cols-3 gap-2"><Metric label="Eventos" value={data.totalEvents} /><Metric label="Para comer" value={data.foodContextOpens} /><Metric label="Rotas" value={data.routeOpens} /></div><div className="mt-4 grid gap-3 text-xs"><MetricList label="Cidades mais acionadas" rows={data.topCities.map(row => ({ label: row.citySlug, value: row.total }))} /><MetricList label="Itens mais acionados" rows={data.topItems.map(row => ({ label: row.itemId, value: row.total }))} /></div></> : null}
    <p className="mt-4 flex gap-2 text-[11px] leading-4 text-[#566457]"><ShieldCheck className="h-4 w-4 shrink-0 text-[#B9572D]" />Dados minimizados para validar demanda; sem dados pessoais, localização precisa ou conteúdo livre.</p>
  </section>;
  const target = document.querySelector("main > div.mx-auto.max-w-6xl");
  return target ? createPortal(panel, target) : null;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-white px-2 py-2.5"><p className="text-[9px] font-bold uppercase tracking-[.1em] text-[#566457]">{label}</p><p className="mt-1 text-lg font-extrabold">{value}</p></div>;
}

function MetricList({ label, rows }: { label: string; rows: Array<{ label: string; value: number }> }) {
  return <div><p className="font-bold text-[#566457]">{label}</p>{rows.length ? <ol className="mt-1.5 space-y-1">{rows.map(row => <li key={row.label} className="flex justify-between gap-2"><span className="truncate">{row.label}</span><strong>{row.value}</strong></li>)}</ol> : <p className="mt-1 text-[#566457]">Sem interações registradas.</p>}</div>;
}
