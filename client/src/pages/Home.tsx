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

const heroImage = "/manus-storage/teresina-visitbrasil_35903112.jpg";
const markImage = "/manus-storage/bora-piaui-route-mark_13f422fa.png";
const topoTexture = "/manus-storage/bora-piaui-topographic-texture_996c6da6.png";
const sourceGov = "https://www.gov.br/g20/en/about-the-g20/host-cities/teresina";
const sourceVisitBrasil = "https://visitbrasil.com/en/location/teresina/";
const teresinaRoutes = [
  { title: "Parque Ambiental Encontro dos Rios", type: "Natureza · Poti Velho", detail: "Poti encontra o Parnaíba", href: "https://www.google.com/maps/dir/?api=1&destination=Parque%20Ambiental%20Encontro%20dos%20Rios%2C%20Teresina%2C%20PI" },
  { title: "Mirante da Ponte Estaiada", type: "Vista panorâmica · Rio Poti", detail: "Ação final da jornada", href: "https://www.google.com/maps/dir/?api=1&destination=Mirante%20da%20Ponte%20Estaiada%2C%20Teresina%2C%20PI" },
  { title: "Museu do Piauí", type: "História · Centro", detail: "Primeira parada do roteiro", href: "https://www.google.com/maps/dir/?api=1&destination=Museu%20do%20Piaui%2C%20Teresina%2C%20PI" },
  { title: "Polo Cerâmico do Poty Velho", type: "Cultura · Poty Velho", detail: "Artesanato e território", href: "https://www.google.com/maps/dir/?api=1&destination=Polo%20Ceramico%20do%20Poty%20Velho%2C%20Teresina%2C%20PI" },
];

const navigation = [
  { id: "visao", label: "Visão geral", number: "01" },
  { id: "principios", label: "Princípios", number: "02" },
  { id: "sistema", label: "Sistema enxuto", number: "03" },
  { id: "telas", label: "6 telas de Teresina", number: "04" },
  { id: "teste", label: "Teste em Teresina", number: "05" },
  { id: "decisao", label: "Critério de avanço", number: "06" },
];

const principles = [
  { icon: Users, title: "Mobile-first", text: "Comece na tela estreita. A experiência deve funcionar com uma mão e leitura rápida." },
  { icon: Target, title: "Uma ação por tela", text: "Destaque a próxima decisão sem criar competição entre botões e caminhos." },
  { icon: ShieldCheck, title: "Confiança explícita", text: "Mostre fonte, data de verificação e pendências; não complete lacunas com suposições." },
  { icon: Search, title: "Escaneabilidade", text: "Organize informação prática para ser compreendida em poucos segundos." },
];

const screens = [
  { number: "01", title: "Início — Conheça Teresina", action: "Explorar Teresina", goal: "Apresentar Teresina como capital entre os rios Poti e Parnaíba e iniciar a descoberta.", blocks: "Chamada de cidade, busca, categorias natureza, cultura e mirante, além de acesso ao roteiro piloto.", question: "A pessoa percebe que Teresina é o destino do protótipo e sabe por onde começar?" },
  { number: "02", title: "Cidade — Teresina", action: "Ver lugares para visitar", goal: "Contextualizar a cidade com uma seleção pequena e verificável de pontos de interesse.", blocks: "Encontro dos Rios, Mirante da Ponte Estaiada, Museu do Piauí e Polo Cerâmico do Poty Velho.", question: "A pessoa entende a diversidade de experiências sem precisar navegar por listas extensas?" },
  { number: "03", title: "Descobrir — Natureza e cultura", action: "Abrir Parque Ambiental Encontro dos Rios", goal: "Permitir comparar locais reais de Teresina por interesse, sem depender de avaliações fictícias.", blocks: "Filtros Natureza, Cultura e Vista panorâmica; cards com categoria, resumo, fonte e ação de rota.", question: "A pessoa consegue escolher entre uma experiência de natureza, história ou paisagem?" },
  { number: "04", title: "Detalhe — Encontro dos Rios", action: "Abrir rota", goal: "Apresentar o parque onde Poti e Parnaíba se encontram e encaminhar a pessoa para uma ação real.", blocks: "Resumo, artesanato local como contexto, fonte, data de verificação e botão de rota externa.", question: "A pessoa entende por que visitar o local e reconhece o que está verificado?" },
  { number: "05", title: "Roteiro — Rios e história", action: "Começar roteiro", goal: "Conectar patrimônio, paisagem urbana e encontro dos rios em uma sequência de visita.", blocks: "Museu do Piauí, Praça Pedro II, Mirante da Ponte Estaiada e Parque Ambiental Encontro dos Rios.", question: "A pessoa entende a proposta do roteiro sem receber uma promessa indevida de duração ou horário?" },
  { number: "06", title: "Ação — Rota para a Ponte Estaiada", action: "Abrir rota no Google Maps", goal: "Concluir a jornada com uma rota para o Mirante da Ponte Estaiada sobre o Rio Poti.", blocks: "Nome do local, ação de mapa, orientação de verificação operacional e alternativa de retorno ao roteiro.", question: "A pessoa percebe claramente que a experiência digital terminou em uma próxima ação prática?" },
];

const tokens = [
  { name: "Verde rota", hex: "#174C45", role: "Ações, links e orientação", color: "#174C45" },
  { name: "Ocre solar", hex: "#D69B42", role: "Prioridades e destaques", color: "#D69B42" },
  { name: "Areia", hex: "#F7F1E5", role: "Fundo e repouso visual", color: "#F7F1E5" },
  { name: "Petróleo", hex: "#0B7285", role: "Rota e elementos ativos", color: "#0B7285" },
];

const checklist = [
  "Teresina definida como cidade-piloto do cenário.",
  "Conteúdo preenchido para Encontro dos Rios, Ponte Estaiada, Museu do Piauí e roteiro Rios e história.",
  "Rotas reais do Google Maps estão disponíveis para os pontos do cenário.",
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

function FieldSeal({ label, detail }: { label: string; detail: string }) {
  return <div className="field-seal"><span className="field-stamp"><img src={markImage} alt="Selo de orientação Bora Piauí" /></span><p>{label}<span>{detail}</span></p></div>;
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
    const brief = "Teste Bora Piauí — Teresina: 1) encontre o Parque Ambiental Encontro dos Rios; 2) escolha o roteiro Rios e história; 3) mostre como abrir uma rota para o Mirante da Ponte Estaiada; 4) diga o que faz você confiar — ou não — na informação.";
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
            <p className="mt-6 text-xs leading-5 text-[#5f7065]">Cenário do protótipo: Teresina, entre os rios Poti e Parnaíba.</p>

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
              <p className="mt-2 text-xs leading-5 text-[#607369]">Próximo foco: validar a jornada completa em Teresina.</p>
            </div>
          </div>
        </aside>

        <main>
          <section id="visao" className="route-section scroll-mt-20 border-b border-[#174c45]/10 px-5 py-7 sm:px-8 lg:px-12 lg:py-12 xl:px-16">
            <div className="mb-7 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#5d6f64]">
              <span>Guia interno · 2026</span><span>v1.0</span>
            </div>
            <div className="grid overflow-hidden rounded-sm border border-[#174c45]/12 bg-[#174c45] lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative flex min-h-[520px] flex-col justify-between px-7 py-8 text-[#fffaf0] sm:px-10 sm:py-11 lg:px-12">
                <img src={topoTexture} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.11] mix-blend-screen" />
                <div className="relative">
                  <div className="flex flex-wrap items-center justify-between gap-4"><p className="inline-flex items-center gap-2 rounded-full border border-[#fffaf0]/20 bg-[#fffaf0]/8 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#f4ca82]"><Compass className="h-3.5 w-3.5" /> Caderno de Campo</p><FieldSeal label="Eixo piloto 01" detail="Teresina · PI" /></div>
                  <h1 className="display-font mt-7 max-w-lg text-5xl leading-[0.94] tracking-[-0.055em] sm:text-6xl xl:text-7xl">Teresina é o ponto de partida da nossa rota.</h1>
                  <p className="mt-7 max-w-md text-base leading-7 text-[#f9efdb]/75 sm:text-lg">O cenário-piloto usa lugares reais da capital piauiense para validar a jornada de descoberta, decisão e ação.</p>
                </div>
                <div className="relative mt-10 flex flex-wrap gap-3">
                  <Button onClick={() => goTo("telas")} className="bg-[#d69b42] text-[#173f39] hover:bg-[#ecc077]">Ver cenário de Teresina <ArrowDownRight className="h-4 w-4" /></Button>
                  <Button onClick={() => goTo("teste")} variant="outline" className="border-[#fffaf0]/30 bg-transparent text-[#fffaf0] hover:bg-[#fffaf0]/10 hover:text-[#fffaf0]">Planejar teste</Button>
                </div>
              </div>
              <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
                <img src={heroImage} alt="Ponte Estaiada sobre o Rio Poti, em Teresina" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#173f39]/48 via-transparent to-transparent" />
                <div className="map-frame" />
                <div className="absolute bottom-6 left-6 right-6 z-[2] flex items-end justify-between border-t border-white/30 pt-4 text-white">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Mapa-piloto · Teresina</p><p className="mt-1 text-sm font-semibold">Poti + Parnaíba → descoberta</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">Ref. Visit Brasil · 20 AGO 2026</p></div>
                  <MapPinned className="h-7 w-7 text-[#f6c66f]" />
                </div>
              </div>
            </div>

            <div className="field-matrix mt-8 grid gap-px overflow-hidden sm:grid-cols-3">
              {[{ number: "01", title: "Teresina", text: "Capital entre os rios Poti e Parnaíba." }, { number: "04", title: "Pontos reais", text: "Encontro dos Rios, Museu, Ponte e Poty Velho." }, { number: "03", title: "Tarefas de teste", text: "Encontrar, escolher e abrir uma rota sem ajuda." }].map((item) => (
                <div key={item.title} className="bg-[#fffaf0] px-5 py-5"><p className="eyebrow">{item.number}</p><p className="mt-3 text-base font-extrabold tracking-[-0.03em]">{item.title}</p><p className="mt-1 text-sm leading-5 text-[#5c6b62]">{item.text}</p></div>
              ))}
            </div>
          </section>

          <section id="principios" className="route-section scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <span className="marginalia absolute right-4 top-20">Caderno · 02</span>
            <SectionTitle eyebrow="02 · Princípios" title="Teresina como cenário que reduz incerteza." description="O protótipo não precisa apresentar toda a cidade. Ele deve permitir que uma pessoa descubra o Encontro dos Rios, escolha um roteiro verificável e avance para uma rota real." />
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

          <section id="sistema" className="route-section route-section-tint scroll-mt-20 bg-[#eee3cf] px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <span className="marginalia absolute right-4 top-20">Matriz · 03</span>
            <SectionTitle eyebrow="03 · Sistema enxuto" title="Uma seleção pequena, específica e verificável." description="O pacote de conteúdo inicial reúne apenas lugares citados por fontes institucionais. Horários, preços e contatos ficam fora do protótipo até confirmação operacional." />
            <div className="mt-11 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="overflow-hidden rounded-md border border-[#174c45]/12 bg-[#fffaf0]">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[#174c45]/10 px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#6c7b70]"><span>Token</span><span>Hex</span><span>Função</span></div>
                {tokens.map((token) => <div key={token.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#174c45]/8 px-5 py-4 last:border-0"><div className="flex items-center gap-3"><span className="h-7 w-7 rounded-full border border-black/10" style={{ background: token.color }} /><span className="text-sm font-extrabold">{token.name}</span></div><code className="text-xs font-bold text-[#6f7c71]">{token.hex}</code><span className="hidden max-w-32 text-right text-xs leading-4 text-[#67766c] sm:block">{token.role}</span></div>)}
              </div>
              <div className="space-y-5">
                <div className="instrument-panel p-6"><p className="eyebrow">Tipografia</p><p className="display-font mt-4 text-4xl leading-none">DM Serif Display</p><p className="mt-2 text-sm leading-6 text-[#586a60]">Títulos, decisões e frases de orientação.</p><p className="mt-7 text-xl font-extrabold tracking-[-0.04em]">Manrope</p><p className="mt-2 text-sm leading-6 text-[#586a60]">Texto, navegação, metadados e controles.</p></div>
                <div className="instrument-panel p-6"><p className="eyebrow">Conteúdo inicial de Teresina</p><div className="mt-5 flex flex-wrap gap-2">{["Encontro dos Rios", "Ponte Estaiada", "Museu do Piauí", "Poty Velho", "Natureza", "Cultura", "Mirante", "Fonte"].map((item) => <span key={item} className="rounded-full border border-[#174c45]/14 bg-[#fffaf0] px-3 py-1.5 text-xs font-bold text-[#34574d]">{item}</span>)}</div></div>
              </div>
            </div>
          </section>

          <section id="telas" className="route-section scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <span className="marginalia absolute right-4 top-20">Rota · 04</span>
            <SectionTitle eyebrow="04 · Arquitetura do protótipo" title="Seis telas, uma jornada por Teresina." description="Cada tela agora usa um local ou uma ação concreta da cidade-piloto. A intenção é testar se a pessoa consegue sair de uma curiosidade para uma rota, sem explicação da equipe." />
            <div className="mt-11 grid gap-8 xl:grid-cols-[0.77fr_1.23fr]">
              <div className="rounded-md border-t-[3px] border-[#0b7285] bg-[#174c45] p-6 text-[#fffaf0] sm:p-8"><Route className="h-8 w-8 text-[#d69b42]" /><p className="eyebrow mt-9 !text-[#f0c476]">Fluxo prioritário em Teresina</p><p className="display-font mt-4 text-4xl leading-[0.95]">Rios.<br />História.<br />Rota.</p><div className="mt-9 space-y-4 border-t border-[#fffaf0]/15 pt-6 text-sm leading-6 text-[#fffaf0]/72"><p><b className="text-[#fffaf0]">Descobrir:</b> Encontro dos Rios e pontos de interesse.</p><p><b className="text-[#fffaf0]">Decidir:</b> roteiro e informação verificável.</p><p><b className="text-[#fffaf0]">Agir:</b> rota para Ponte Estaiada ou parque.</p></div></div>
              <Accordion type="single" collapsible className="border-y border-[#174c45]/20 bg-[#fffaf0] px-5 sm:px-7">
                {screens.map((screen) => <AccordionItem key={screen.number} value={screen.number} className="border-[#174c45]/10"><AccordionTrigger className="py-5 text-left hover:no-underline"><span className="flex items-center gap-4"><span className="text-xs font-extrabold tracking-[0.15em] text-[#b87324]">{screen.number}</span><span className="text-base font-extrabold tracking-[-0.025em] sm:text-lg">{screen.title}</span></span></AccordionTrigger><AccordionContent className="pb-6"><div className="grid gap-4 text-sm leading-6 text-[#53685e] sm:grid-cols-2"><p><b className="text-[#174c45]">Objetivo:</b> {screen.goal}</p><p><b className="text-[#174c45]">Blocos:</b> {screen.blocks}</p><p className="sm:col-span-2 rounded-xl bg-[#efe6d4] px-4 py-3"><b className="text-[#174c45]">Ação dominante:</b> {screen.action} <span className="mx-2 text-[#b87324]">·</span> <b className="text-[#174c45]">No teste:</b> {screen.question}</p></div></AccordionContent></AccordionItem>)}
              </Accordion>
            </div>
            <div className="mt-8 border-y border-[#174c45]/18 py-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Ação real do protótipo</p><h3 className="display-font mt-2 text-3xl leading-none">Abrir rota para um ponto de Teresina.</h3></div><p className="max-w-sm text-sm leading-6 text-[#5b6d62]">Os botões abrem o Google Maps em uma nova aba. O ponto de origem é definido pelo dispositivo da pessoa.</p></div>
              <div className="field-matrix mt-6 grid overflow-hidden md:grid-cols-2">
                {teresinaRoutes.map((route, index) => <a key={route.title} href={route.href} target="_blank" rel="noopener noreferrer" aria-label={`Abrir rota para ${route.title} no Google Maps`} className="group flex min-h-36 flex-col justify-between border-b border-[#174c45]/12 bg-[#fffaf0] p-5 transition-colors hover:bg-[#efe6d4] md:border-r md:[&:nth-child(2n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Ponto {String(index + 1).padStart(2, "0")}</p><p className="mt-3 text-base font-extrabold tracking-[-0.025em] text-[#174c45]">{route.title}</p><p className="mt-1 text-xs font-bold text-[#0b7285]">{route.type}</p></div><MapPinned className="h-5 w-5 shrink-0 text-[#b87324] transition-transform duration-200 group-hover:-translate-y-1" /></div><span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#174c45]">Ver rota <ArrowUpRight className="h-4 w-4 text-[#0b7285]" /></span><span className="mt-1 text-xs text-[#617269]">{route.detail}</span></a>)}
              </div>
            </div>
          </section>

          <section id="teste" className="route-section route-section-soft scroll-mt-20 bg-[#f1e8d8] px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <span className="marginalia absolute right-4 top-20">Teste · 05</span>
            <div className="mb-8"><FieldSeal label="Porta de campo" detail="validar com pessoas" /></div>
            <SectionTitle eyebrow="05 · Teste com pessoas reais" title="Teste Teresina com uma jornada real." description="Comece com cinco ou seis sessões de 20 a 25 minutos. A sessão deve observar se a pessoa encontra o Encontro dos Rios, escolhe o roteiro Rios e história e abre a rota para a Ponte Estaiada." />
            <div className="mt-11 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="instrument-panel p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="eyebrow">Roteiro de sessão</p><h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">20–25 minutos</h3></div><ClipboardCheck className="h-9 w-9 text-[#b87324]" /></div><div className="mt-8 space-y-0">{[{ time: "02 min", label: "Abertura", text: "Objetivo, consentimento e contexto." }, { time: "03 min", label: "Contexto", text: "Como a pessoa planeja uma viagem curta." }, { time: "12 min", label: "3 tarefas", text: "Atração, roteiro e ação externa." }, { time: "05–08 min", label: "Encerramento", text: "Confiança, clareza e fricção." }].map((stage) => <div key={stage.label} className="grid grid-cols-[64px_1fr] gap-4 border-t border-[#174c45]/10 py-4"><p className="text-xs font-extrabold tracking-[0.08em] text-[#b87324]">{stage.time}</p><div><p className="text-sm font-extrabold">{stage.label}</p><p className="mt-1 text-sm leading-5 text-[#5d6d63]">{stage.text}</p></div></div>)}</div><Button onClick={copyTestBrief} variant="outline" className="mt-5 border-[#174c45]/18 bg-transparent text-[#174c45] hover:bg-[#174c45]/7"><Copy className="h-4 w-4" /> Copiar roteiro das tarefas</Button></div>
              <div className="rounded-md border-t-[3px] border-[#0b7285] bg-[#174c45] p-6 text-[#fffaf0] sm:p-8"><div className="flex items-start justify-between"><div><p className="eyebrow !text-[#f0c476]">Prontidão do teste</p><h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">Checklist de preparação</h3></div><span className="rounded-full bg-[#fffaf0]/10 px-3 py-1 text-xs font-bold text-[#f6cf90]">{completion}%</span></div><div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-[#d69b42] transition-all duration-200" style={{ width: `${completion}%` }} /></div><div className="mt-7 space-y-3">{checklist.map((item) => { const done = checked.includes(item); return <button key={item} onClick={() => toggleCheck(item)} className="flex w-full items-start gap-3 text-left group"><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${done ? "border-[#d69b42] bg-[#d69b42] text-[#174c45]" : "border-white/35 text-transparent group-hover:border-[#f0c476]"}`}><Check className="h-3.5 w-3.5" /></span><span className={`text-sm leading-5 ${done ? "text-white/52 line-through" : "text-white/88"}`}>{item}</span></button> })}</div></div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">{[{ n: "Tarefa 1", text: "Encontre o Parque Ambiental Encontro dos Rios." }, { n: "Tarefa 2", text: "Escolha o roteiro Rios e história para conhecer Teresina." }, { n: "Tarefa 3", text: "Mostre como abriria uma rota para o Mirante da Ponte Estaiada." }].map((task) => <div key={task.n} className="instrument-panel p-5"><p className="eyebrow">{task.n}</p><p className="mt-3 text-sm font-bold leading-6 text-[#33594d]">{task.text}</p></div>)}</div>
          </section>

          <section id="decisao" className="route-section scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12 lg:py-24 xl:px-16">
            <span className="marginalia absolute right-4 top-20">Gate · 06</span>
            <div className="grid gap-10 xl:grid-cols-[0.92fr_1.08fr] xl:items-end">
              <SectionTitle eyebrow="06 · Gate de decisão" title="Avance quando Teresina estiver comprovada." description="O teste não precisa provar que o produto está pronto para lançamento. Ele deve mostrar que a jornada entre Encontro dos Rios, roteiro e rota funciona antes de acrescentar cidades ou funcionalidades." />
              <div className="relative overflow-hidden rounded-md border-t-[3px] border-[#d69b42] bg-[#fffaf0] p-6 sm:p-8"><img src={topoTexture} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.11]" /><div className="relative"><Flag className="h-8 w-8 text-[#b87324]" /><p className="mt-6 text-lg font-extrabold tracking-[-0.035em]">O protótipo pode avançar quando:</p><ul className="mt-5 space-y-3">{["A maioria conclui as três tarefas sem ajuda relevante.", "Nenhum erro crítico bloqueia rota ou contato.", "A cidade, a categoria e a ação seguinte são compreendidas.", "Problemas recorrentes foram convertidos em backlog P0 ou P1."].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#4d655a]"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#2b8a3e]" />{item}</li>)}</ul><Button onClick={() => goTo("visao")} className="mt-8 bg-[#174c45] text-[#fffaf0] hover:bg-[#0f3833]">Voltar ao início <ArrowUpRight className="h-4 w-4" /></Button></div></div>
            </div>
          </section>

          <footer className="border-t border-[#174c45]/10 px-5 py-8 sm:px-8 lg:px-12 xl:px-16"><div className="flex flex-col justify-between gap-3 text-xs text-[#64766a] sm:flex-row"><p>Guia Bora Piauí · Teresina como cidade-piloto.</p><p>Fontes: <a href={sourceGov} target="_blank" rel="noreferrer" className="font-bold text-[#0b7285] underline underline-offset-2">G20 Brasil</a> e <a href={sourceVisitBrasil} target="_blank" rel="noreferrer" className="font-bold text-[#0b7285] underline underline-offset-2">Visit Brasil</a> · consultadas em 20 ago. 2026.</p></div></footer>
        </main>
      </div>
    </div>
  );
}
