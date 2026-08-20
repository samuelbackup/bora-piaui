/* Design philosophy: Caderno de Campo — clear editorial hierarchy and navigable product decisions. */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Copy,
  Flag,
  MapPinned,
  Menu,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const heroImage = "/manus-storage/bora-piaui-hero-field-guide_10c8f2eb.jpg";
const markImage = "/manus-storage/bora-piaui-route-mark_13f422fa.png";
const topoTexture = "/manus-storage/bora-piaui-topographic-texture_996c6da6.png";

const navigation = [
  { id: "visao", label: "Visão geral", number: "01" },
  { id: "principios", label: "Princípios", number: "02" },
  { id: "sistema", label: "Sistema enxuto", number: "03" },
  { id: "telas", label: "6 telas", number: "04" },
  { id: "teste", label: "Teste rápido", number: "05" },
  { id: "decisao", label: "Critério de avanço", number: "06" },
];

const principles = [
  { icon: Users, title: "Mobile-first", text: "Comece na tela estreita. A experiência deve funcionar com uma mão e leitura rápida." },
  { icon: Target, title: "Uma ação por tela", text: "Destaque a próxima decisão sem criar competição entre botões e caminhos." },
  { icon: ShieldCheck, title: "Confiança explícita", text: "Mostre fonte, data de verificação e pendências; não complete lacunas com suposições." },
  { icon: Search, title: "Escaneabilidade", text: "Organize informação prática para ser compreendida em poucos segundos." },
];

const screens = [
  { number: "01", title: "Página inicial", action: "Explorar cidade-piloto", goal: "Fazer o visitante entender o que é o Bora Piauí e como começar.", blocks: "Chamada curta, escolha da cidade, busca ou categorias e sinal de confiança.", question: "A pessoa entende o que o site oferece e qual é o primeiro passo?" },
  { number: "02", title: "Página da cidade", action: "Ver atrações", goal: "Contextualizar o destino e abrir caminhos de exploração.", blocks: "Nome, resumo, destaques, categorias, roteiros e informações práticas.", question: "A pessoa identifica as opções e escolhe uma sem percorrer a tela inteira?" },
  { number: "03", title: "Lista de descoberta", action: "Abrir um item", goal: "Permitir comparar opções de forma rápida.", blocks: "Busca, até três filtros, cards de item e estado vazio.", question: "A pessoa entende por que escolheria um item em vez de outro?" },
  { number: "04", title: "Página de detalhe", action: "Ver rota", goal: "Apoiar uma decisão e encaminhar para uma ação real.", blocks: "Nome, resumo, imagem, informações práticas, fonte, contato e rota.", question: "A pessoa encontra o necessário para decidir se vale visitar?" },
  { number: "05", title: "Roteiro básico", action: "Começar rota", goal: "Transformar conteúdo em um plano de visita.", blocks: "Duração, sequência de 2 a 4 paradas, resumos e ação final.", question: "A pessoa entende a ordem do roteiro e o próximo passo?" },
  { number: "06", title: "Mapa e ação", action: "Abrir rota externa", goal: "Concluir a jornada com uma ação concreta.", blocks: "Prévia de rota, endereço textual, mapa externo e contato de fallback.", question: "A pessoa percebe que chegou ao próximo passo real?" },
];

const tokens = [
  { name: "Verde rota", hex: "#174C45", role: "Ações, links e orientação", color: "#174C45" },
  { name: "Ocre solar", hex: "#D69B42", role: "Prioridades e destaques", color: "#D69B42" },
  { name: "Areia", hex: "#F7F1E5", role: "Fundo e repouso visual", color: "#F7F1E5" },
  { name: "Petróleo", hex: "#0B7285", role: "Rota e elementos ativos", color: "#0B7285" },
];

const checklist = [
  "Cidade-piloto definida para o cenário.",
  "Dados representativos preenchidos para atrações, negócios e roteiro.",
  "Rotas, contatos e estados vazios estão simulados.",
  "Tarefas de teste estão prontas, sem dicas de navegação.",
  "Participantes foram recrutados e autorizaram a sessão.",
];

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <div className="field-marker mb-5"><span>{eyebrow}</span><span>14° · 08′ · campo</span></div>
      <h2 className="display-font text-4xl leading-[0.98] tracking-[-0.035em] text-[#174c45] sm:text-5xl">{title}</h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-[#49605b] sm:text-lg">{description}</p>
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("visao");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);

  const completion = useMemo(() => Math.round((checked.length / checklist.length) * 100), [checked.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0.05 },
    );
    navigation.forEach(({ id }) => document.getElementById(id) && observer.observe(document.getElementById(id)!));
    return () => observer.disconnect();
  }, []);

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  }

  function toggleCheck(item: string) {
    setChecked((previous) => previous.includes(item) ? previous.filter((value) => value !== item) : [...previous, item]);
  }

  async function copyTestBrief() {
    const brief = "Teste Bora Piauí: 1) encontre uma atração; 2) escolha um roteiro para meio dia; 3) mostre como iniciar uma rota ou contato; 4) diga o que faz você confiar — ou não — na informação.";
    await navigator.clipboard.writeText(brief);
    toast.success("Roteiro de teste copiado.");
  }

  return (
    <div className="min-h-screen bg-[#f7f1e5] text-[#174c45]">
      <header className="sticky top-0 z-40 border-b border-[#174c45]/10 bg-[#f7f1e5]/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button onClick={() => goTo("visao")} className="flex items-center gap-2.5 text-left" aria-label="Ir para o início">
            <span className="field-stamp h-10 w-10"><img src={markImage} alt="Símbolo Bora Piauí" /></span>
            <span className="wordmark text-sm font-extrabold">bora <span className="text-[#b87324]">piauí</span></span>
          </button>
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen((open) => !open)} aria-label="Abrir navegação">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {isMenuOpen && (
          <nav className="border-t border-[#174c45]/10 px-3 py-3">
            {navigation.map((item) => (
              <button key={item.id} onClick={() => goTo(item.id)} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold hover:bg-[#174c45]/7">
                {item.label}<ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </nav>
        )}
      </header>

      <div className="mx-auto max-w-[1540px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden min-h-screen border-r border-[#174c45]/10 bg-[#efe6d4] lg:sticky lg:top-0 lg:block lg:h-screen">
          <div className="flex h-full flex-col px-7 py-8">
            <button onClick={() => goTo("visao")} className="flex items-center gap-3 text-left" aria-label="Ir para o início">
              <span className="field-stamp h-14 w-14"><img src={markImage} alt="Símbolo Bora Piauí" /></span>
              <div>
                <p className="wordmark text-lg font-extrabold">bora <span className="text-[#b87324]">piauí</span></p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6f7f73]">Guia de produto</p>
              </div>
            </button>

            <div className="route-rule mt-9 h-px w-full" />
            <p className="mt-6 text-xs leading-5 text-[#5f7065]">Um caderno de campo para alinhar a experiência do protótipo antes de escalar o MVP.</p>

            <nav className="mt-9 space-y-1" aria-label="Seções do guia">
              {navigation.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button key={item.id} onClick={() => goTo(item.id)} className={`nav-item flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left ${isActive ? "bg-[#0b7285] text-[#fffaf0]" : "text-[#40584e] hover:bg-[#174c45]/8"}`}>
                    <span className={`text-[10px] font-extrabold tracking-[0.13em] ${isActive ? "text-[#d7a95d]" : "text-[#a16a27]"}`}>{item.number}</span>
                    <span className="text-sm font-bold">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-[#174c45]/10 pt-6">
              <p className="eyebrow">Estado do guia</p>
              <div className="mt-3 flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-4 w-4 text-[#2b8a3e]" /> Protótipo navegável</div>
              <p className="mt-2 text-xs leading-5 text-[#607369]">Próximo foco: validar uma cidade e uma jornada inteira.</p>
            </div>
          </div>
        </aside>

        <main>
          <section id="visao" className="scroll-mt-20 border-b border-[#174c45]/10 px-5 py-7 sm:px-8 lg:px-12 lg:py-12 xl:px-16">
            <div className="mb-7 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#5d6f64]">
              <span>Guia interno · 2026</span><span>v1.0</span>
            </div>
            <div className="grid overflow-hidden rounded-[1.15rem] border border-[#174c45]/12 bg-[#174c45] lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative flex min-h-[520px] flex-col justify-between px-7 py-8 text-[#fffaf0] sm:px-10 sm:py-11 lg:px-12">
                <img src={topoTexture} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.11] mix-blend-screen" />
                <div className="relative">
                  <p className="inline-flex items-center gap-2 rounded-full border border-[#fffaf0]/20 bg-[#fffaf0]/8 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#f4ca82]"><Compass className="h-3.5 w-3.5" /> Caderno de Campo</p>
                  <h1 className="display-font mt-7 max-w-lg text-5xl leading-[0.94] tracking-[-0.055em] sm:text-6xl xl:text-7xl">Faça a rota funcionar antes de adicionar recursos.</h1>
                  <p className="mt-7 max-w-md text-base leading-7 text-[#f9efdb]/75 sm:text-lg">Diretrizes para transformar o Bora Piauí em uma experiência turística digital clara, confiável e validada com pessoas reais.</p>
                </div>
                <div className="relative mt-10 flex flex-wrap gap-3">
                  <Button onClick={() => goTo("telas")} className="bg-[#d69b42] text-[#173f39] hover:bg-[#ecc077]">Ver as 6 telas <ArrowDownRight className="h-4 w-4" /></Button>
                  <Button onClick={() => goTo("teste")} variant="outline" className="border-[#fffaf0]/30 bg-transparent text-[#fffaf0] hover:bg-[#fffaf0]/10 hover:text-[#fffaf0]">Planejar teste</Button>
                </div>
              </div>
              <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
                <img src={heroImage} alt="Paisagem semiárida do Piauí com trilha e formações rochosas" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#173f39]/48 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between border-t border-white/30 pt-4 text-white">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Tese do protótipo</p><p className="mt-1 text-sm font-semibold">Descobrir → decidir → agir</p></div>
                  <MapPinned className="h-7 w-7 text-[#f6c66f]" />
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-px overflow-hidden rounded-md border border-[#174c45]/12 bg-[#174c45]/12 sm:grid-cols-3">
              {[{ number: "01", title: "Uma cidade", text: "Um cenário suficiente para provar o fluxo." }, { number: "03", title: "Três tarefas", text: "Encontrar, escolher e agir sem ajuda." }, { number: "05–06", title: "Pessoas reais", text: "Rodada inicial de teste rápida e observável." }].map((item) => (
                <div key={item.title} className="bg-[#fffaf0] px-5 py-5"><p className="eyebrow">{item.number}</p><p className="mt-3 text-base font-extrabold tracking-[-0.03em]">{item.title}</p><p className="mt-1 text-sm leading-5 text-[#5c6b62]">{item.text}</p></div>
              ))}
            </div>
          </section>

          <section id="principios" className="scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <SectionTitle eyebrow="02 · Princípios" title="Uma interface que reduz incerteza." description="O protótipo não precisa provar toda a plataforma. Ele precisa comprovar que uma pessoa entende o destino, encontra uma opção confiável e consegue partir para uma ação prática." />
            <div className="mt-11 grid gap-4 md:grid-cols-2">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return <article key={principle.title} className="instrument-panel group relative overflow-hidden p-6"><p className="text-xs font-extrabold tracking-[0.16em] text-[#b87324]">0{index + 1} · PONTO DE CAMPO</p><Icon className="mt-8 h-7 w-7 text-[#0b7285] transition-transform duration-200 group-hover:-translate-y-1" /><h3 className="mt-5 text-xl font-extrabold tracking-[-0.04em]">{principle.title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#5a6c61]">{principle.text}</p></article>;
              })}
            </div>
            <div className="mt-10 grid gap-5 border-y border-[#174c45]/12 py-7 md:grid-cols-[0.7fr_1.3fr]">
              <p className="eyebrow pt-1">Regra de ouro</p>
              <p className="display-font text-3xl leading-tight text-[#174c45]">“A pessoa deve conseguir descobrir, decidir e agir com o mínimo de fricção.”</p>
            </div>
          </section>

          <section id="sistema" className="scroll-mt-20 bg-[#eee3cf] px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <SectionTitle eyebrow="03 · Sistema enxuto" title="Poucos tokens. Muitas decisões consistentes." description="Um sistema pequeno mantém o protótipo coerente sem transformar a primeira entrega em uma biblioteca extensa. A prioridade é repetição reconhecível e boa leitura." />
            <div className="mt-11 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="overflow-hidden rounded-md border border-[#174c45]/12 bg-[#fffaf0]">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[#174c45]/10 px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6c7b70]"><span>Token</span><span>Hex</span><span>Função</span></div>
                {tokens.map((token) => <div key={token.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#174c45]/8 px-5 py-4 last:border-0"><div className="flex items-center gap-3"><span className="h-7 w-7 rounded-full border border-black/10" style={{ background: token.color }} /><span className="text-sm font-extrabold">{token.name}</span></div><code className="text-xs font-bold text-[#6f7c71]">{token.hex}</code><span className="hidden max-w-32 text-right text-xs leading-4 text-[#67766c] sm:block">{token.role}</span></div>)}
              </div>
              <div className="space-y-5">
                <div className="instrument-panel p-6"><p className="eyebrow">Tipografia</p><p className="display-font mt-4 text-4xl leading-none">DM Serif Display</p><p className="mt-2 text-sm leading-6 text-[#586a60]">Títulos, decisões e frases de orientação.</p><p className="mt-7 text-xl font-extrabold tracking-[-0.04em]">Manrope</p><p className="mt-2 text-sm leading-6 text-[#586a60]">Texto, navegação, metadados e controles.</p></div>
                <div className="instrument-panel p-6"><p className="eyebrow">Componentes obrigatórios</p><div className="mt-5 flex flex-wrap gap-2">{["Botão", "Busca", "Filtro", "Card de item", "Metadados", "Fonte", "Roteiro", "Estado vazio"].map((item) => <span key={item} className="rounded-full border border-[#174c45]/14 bg-[#fffaf0] px-3 py-1.5 text-xs font-bold text-[#34574d]">{item}</span>)}</div></div>
              </div>
            </div>
          </section>

          <section id="telas" className="scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <SectionTitle eyebrow="04 · Arquitetura do protótipo" title="Seis telas para uma jornada inteira." description="Cada tela tem uma finalidade clara e uma ação dominante. Se a pessoa não encontra a próxima ação sem explicação, o fluxo ainda não está pronto para escalar." />
            <div className="mt-11 grid gap-8 xl:grid-cols-[0.77fr_1.23fr]">
              <div className="rounded-md border-t-[3px] border-[#0b7285] bg-[#174c45] p-6 text-[#fffaf0] sm:p-8"><Route className="h-8 w-8 text-[#d69b42]" /><p className="eyebrow mt-9 !text-[#f0c476]">Fluxo prioritário</p><p className="display-font mt-4 text-4xl leading-[0.95]">Descobrir.<br />Decidir.<br />Agir.</p><div className="mt-9 space-y-4 border-t border-[#fffaf0]/15 pt-6 text-sm leading-6 text-[#fffaf0]/72"><p><b className="text-[#fffaf0]">Descobrir:</b> cidade e opções relevantes.</p><p><b className="text-[#fffaf0]">Decidir:</b> informação prática e confiança.</p><p><b className="text-[#fffaf0]">Agir:</b> rota, contato ou serviço externo.</p></div></div>
              <Accordion type="single" collapsible className="rounded-md border border-[#174c45]/12 bg-[#fffaf0] px-5 sm:px-7">
                {screens.map((screen) => <AccordionItem key={screen.number} value={screen.number} className="border-[#174c45]/10"><AccordionTrigger className="py-5 text-left hover:no-underline"><span className="flex items-center gap-4"><span className="text-xs font-extrabold tracking-[0.15em] text-[#b87324]">{screen.number}</span><span className="text-base font-extrabold tracking-[-0.025em] sm:text-lg">{screen.title}</span></span></AccordionTrigger><AccordionContent className="pb-6"><div className="grid gap-4 text-sm leading-6 text-[#53685e] sm:grid-cols-2"><p><b className="text-[#174c45]">Objetivo:</b> {screen.goal}</p><p><b className="text-[#174c45]">Blocos:</b> {screen.blocks}</p><p className="sm:col-span-2 rounded-xl bg-[#efe6d4] px-4 py-3"><b className="text-[#174c45]">Ação dominante:</b> {screen.action} <span className="mx-2 text-[#b87324]">·</span> <b className="text-[#174c45]">No teste:</b> {screen.question}</p></div></AccordionContent></AccordionItem>)}
              </Accordion>
            </div>
          </section>

          <section id="teste" className="scroll-mt-20 bg-[#f1e8d8] px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <SectionTitle eyebrow="05 · Teste com pessoas reais" title="Uma rodada pequena já produz decisões melhores." description="Comece com cinco ou seis sessões de 20 a 25 minutos. O objetivo é observar se a jornada principal acontece sem ajuda relevante, não produzir uma pesquisa estatística." />
            <div className="mt-11 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="instrument-panel p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="eyebrow">Roteiro de sessão</p><h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">20–25 minutos</h3></div><ClipboardCheck className="h-9 w-9 text-[#b87324]" /></div><div className="mt-8 space-y-0">{[{ time: "02 min", label: "Abertura", text: "Objetivo, consentimento e contexto." }, { time: "03 min", label: "Contexto", text: "Como a pessoa planeja uma viagem curta." }, { time: "12 min", label: "3 tarefas", text: "Atração, roteiro e ação externa." }, { time: "05–08 min", label: "Encerramento", text: "Confiança, clareza e fricção." }].map((stage) => <div key={stage.label} className="grid grid-cols-[64px_1fr] gap-4 border-t border-[#174c45]/10 py-4"><p className="text-xs font-extrabold tracking-[0.08em] text-[#b87324]">{stage.time}</p><div><p className="text-sm font-extrabold">{stage.label}</p><p className="mt-1 text-sm leading-5 text-[#5d6d63]">{stage.text}</p></div></div>)}</div><Button onClick={copyTestBrief} variant="outline" className="mt-5 border-[#174c45]/18 bg-transparent text-[#174c45] hover:bg-[#174c45]/7"><Copy className="h-4 w-4" /> Copiar roteiro das tarefas</Button></div>
              <div className="rounded-md border-t-[3px] border-[#0b7285] bg-[#174c45] p-6 text-[#fffaf0] sm:p-8"><div className="flex items-start justify-between"><div><p className="eyebrow !text-[#f0c476]">Prontidão do teste</p><h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">Checklist de preparação</h3></div><span className="rounded-full bg-[#fffaf0]/10 px-3 py-1 text-xs font-bold text-[#f6cf90]">{completion}%</span></div><div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-[#d69b42] transition-all duration-200" style={{ width: `${completion}%` }} /></div><div className="mt-7 space-y-3">{checklist.map((item) => { const done = checked.includes(item); return <button key={item} onClick={() => toggleCheck(item)} className="flex w-full items-start gap-3 text-left group"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${done ? "border-[#d69b42] bg-[#d69b42] text-[#174c45]" : "border-white/35 text-transparent group-hover:border-[#f0c476]"}`}><Check className="h-3.5 w-3.5" /></span><span className={`text-sm leading-5 ${done ? "text-white/52 line-through" : "text-white/88"}`}>{item}</span></button> })}</div></div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">{[{ n: "Tarefa 1", text: "Encontre uma atração que você gostaria de visitar." }, { n: "Tarefa 2", text: "Escolha um roteiro para aproximadamente meio dia." }, { n: "Tarefa 3", text: "Mostre como iniciaria uma rota ou contato." }].map((task) => <div key={task.n} className="instrument-panel p-5"><p className="eyebrow">{task.n}</p><p className="mt-3 text-sm font-bold leading-6 text-[#33594d]">{task.text}</p></div>)}</div>
          </section>

          <section id="decisao" className="scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-end">
              <SectionTitle eyebrow="06 · Gate de decisão" title="Avance quando a rota estiver comprovada." description="O teste não precisa provar que o produto está pronto para lançamento. Ele precisa reduzir incerteza suficiente para justificar a próxima iteração funcional." />
              <div className="relative overflow-hidden rounded-md border-t-[3px] border-[#d69b42] bg-[#fffaf0] p-6 sm:p-8"><img src={topoTexture} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.11]" /><div className="relative"><Flag className="h-8 w-8 text-[#b87324]" /><p className="mt-6 text-lg font-extrabold tracking-[-0.035em]">O protótipo pode avançar quando:</p><ul className="mt-5 space-y-3">{["A maioria conclui as três tarefas sem ajuda relevante.", "Nenhum erro crítico bloqueia rota ou contato.", "A cidade, a categoria e a ação seguinte são compreendidas.", "Problemas recorrentes foram convertidos em backlog P0 ou P1."].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#4d655a]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#2b8a3e]" />{item}</li>)}</ul><Button onClick={() => goTo("visao")} className="mt-8 bg-[#174c45] text-[#fffaf0] hover:bg-[#0f3833]">Voltar ao início <ArrowUpRight className="h-4 w-4" /></Button></div></div>
            </div>
          </section>

          <footer className="border-t border-[#174c45]/10 px-5 py-8 sm:px-8 lg:px-12 xl:px-16"><div className="flex flex-col justify-between gap-3 text-xs text-[#64766a] sm:flex-row"><p>Guia Bora Piauí · UI/UX, design system e teste de usabilidade.</p><p>Use este material para alinhar a equipe antes de ampliar o escopo.</p></div></footer>
        </main>
      </div>
    </div>
  );
}
