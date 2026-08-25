import { useState } from "react";
import { ArrowRight, Compass, ExternalLink, Info, Landmark, MapPinned, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const originsSource = {
  name: "UNESCO · Parque Nacional Serra da Capivara",
  url: "https://whc.unesco.org/en/list/606/",
  note: "Referência pública para o patrimônio cultural do território.",
};

const museumSource = {
  name: "FUMDHAM · Museu do Homem Americano",
  url: "https://fumdham.org.br/cpt_home/museu-do-homem-americano/",
  note: "Consulte a instituição para informações atualizadas de visitação.",
};

const editorialPrinciples = [
  "Cada ponto publicado mantém fonte pública identificada.",
  "Condições de visita, serviços e programação dependem de confirmação oficial.",
  "O protótipo não anuncia reservas, preços ou parcerias comerciais.",
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="home-shell min-h-screen bg-[#F5ECD8] text-[#2E3222] transition-colors duration-200">
      <header className="home-header sticky top-0 z-40 border-b border-[#3C482D]/10 bg-[#F5ECD8]/95 backdrop-blur-xl transition-colors duration-200">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => goTo("inicio")} className="tap flex items-center gap-3" aria-label="Ir ao início">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#B9572D] text-lg font-black text-white shadow-[0_6px_0_rgba(185,87,45,.16)]" aria-hidden="true">BP</span>
            <span className="display-font text-[1.5rem] leading-none tracking-[-0.07em]">bora <span className="text-[#B9572D]">piauí</span></span>
          </button>
          <button type="button" onClick={() => setMenuOpen(value => !value)} className="tap grid h-10 w-10 place-items-center rounded-full border border-[#3C482D]/15 bg-[#F5ECD8]" aria-controls="home-navigation-menu" aria-expanded={menuOpen} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div id="home-navigation-menu" className="border-t border-[#3C482D]/10 bg-[#F5ECD8] px-4 py-4 sm:px-6 lg:px-8">
            <nav aria-label="Navegação principal" className="mx-auto grid max-w-6xl gap-1 sm:grid-cols-2">
              <button type="button" onClick={() => goTo("polo-origens")} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Conhecer o Polo Origens</button>
              <button type="button" onClick={() => goTo("criterios-editoriais")} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Critérios editoriais</button>
              <button type="button" onClick={() => goTo("proximos-passos")} className="tap rounded-xl px-3 py-3 text-left text-sm font-bold hover:bg-[#EDE0C4] focus-visible:bg-[#EDE0C4]">Em breve</button>
              <div className="home-theme-control flex items-center justify-between gap-4 rounded-xl bg-[#FFFDF6] px-3 py-3">
                <div><p className="text-sm font-extrabold">Modo escuro</p><p className="mt-0.5 text-xs text-[#68705C]">Use o tema mais confortável.</p></div>
                <button type="button" role="switch" aria-checked={theme === "dark"} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} onClick={() => toggleTheme?.()} className="tap inline-flex h-10 items-center gap-2 rounded-full border border-[#3C482D]/15 bg-[#F5ECD8] px-3 text-xs font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2"><span>{theme === "dark" ? "Claro" : "Escuro"}</span>{theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}</button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main id="inicio">
        <section className="relative overflow-hidden bg-[#3C482D] px-4 pb-12 pt-8 text-white sm:px-6 sm:pb-16 lg:px-8 lg:pt-12">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div className="relative z-10 py-6 lg:py-14">
              <div className="sun-chip inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.15em]"><Compass className="h-3.5 w-3.5" /> Recorte de MVP · Polo Origens</div>
              <h1 className="display-font mt-7 max-w-3xl text-5xl leading-[0.92] tracking-[-0.065em] sm:text-6xl lg:text-7xl">Histórias antigas, caminhos de agora.</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/78 sm:text-lg">Uma primeira jornada pelo território de São Raimundo Nonato e Coronel José Dias, com foco em patrimônio, paisagem e fontes verificáveis.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => goTo("polo-origens")} className="tap inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#cd6d45]">Conhecer o polo <ArrowRight className="h-4 w-4" /></button>
                <button type="button" onClick={() => goTo("criterios-editoriais")} className="tap inline-flex items-center gap-2 rounded-full border border-white/28 bg-white/8 px-5 py-3 text-sm font-extrabold text-white hover:bg-white/14">Como cuidamos das informações <Info className="h-4 w-4" /></button>
              </div>
            </div>
            <aside className="border border-white/18 bg-[#556B37] p-6 sm:p-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#F2D478]">Território em foco</p>
              <div className="mt-7 space-y-5">
                <div className="border-b border-white/15 pb-5"><p className="display-font text-3xl tracking-[-0.05em]">São Raimundo Nonato</p><p className="mt-2 text-sm leading-6 text-white/72">Base de descoberta do patrimônio arqueológico e das narrativas do território.</p></div>
                <div><p className="display-font text-3xl tracking-[-0.05em]">Coronel José Dias</p><p className="mt-2 text-sm leading-6 text-white/72">Parte do recorte territorial do Polo Origens nesta versão do protótipo.</p></div>
              </div>
            </aside>
          </div>
          <div className="route-line absolute bottom-0 left-0 h-[3px] w-full" />
        </section>

        <section id="polo-origens" className="scroll-mt-20 border-b border-[#3C482D]/10 bg-[#FFFDF6] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div><span className="stop-chip">Parada 01 · Origens</span><h2 className="display-font mt-4 text-4xl leading-none tracking-[-0.055em] sm:text-5xl">Um único polo para explorar com profundidade.</h2></div>
              <p className="max-w-2xl text-sm leading-7 text-[#68705C]">O Bora Piauí começa por uma escala que o projeto consegue sustentar editorialmente. Em vez de prometer cobertura estadual, esta versão apresenta referências públicas do Polo Origens e indica quando uma confirmação local ainda é necessária.</p>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <article className="flex min-h-[260px] flex-col justify-between border border-[#3C482D]/13 bg-[#F5ECD8] p-6">
                <div><span className="grid h-10 w-10 place-items-center rounded-full bg-[#B9572D] text-white"><Landmark className="h-5 w-5" /></span><h3 className="display-font mt-8 text-3xl tracking-[-0.05em]">Serra da Capivara</h3><p className="mt-3 text-sm leading-7 text-[#66705E]">O parque reúne paisagens e sítios arqueológicos que orientam a descoberta inicial do polo.</p></div>
                <a href={originsSource.url} target="_blank" rel="noopener noreferrer" className="tap mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#B9572D] underline decoration-[#B9572D]/35 underline-offset-4">Consultar a fonte <ExternalLink className="h-4 w-4" /></a>
              </article>
              <article className="flex min-h-[260px] flex-col justify-between border border-[#3C482D]/13 bg-[#F5ECD8] p-6">
                <div><span className="grid h-10 w-10 place-items-center rounded-full bg-[#3C482D] text-white"><MapPinned className="h-5 w-5" /></span><h3 className="display-font mt-8 text-3xl tracking-[-0.05em]">Memória e pesquisa</h3><p className="mt-3 text-sm leading-7 text-[#66705E]">O Museu do Homem Americano é uma referência institucional para contextualizar pesquisas e patrimônio da região.</p></div>
                <a href={museumSource.url} target="_blank" rel="noopener noreferrer" className="tap mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#B9572D] underline decoration-[#B9572D]/35 underline-offset-4">Consultar a fonte <ExternalLink className="h-4 w-4" /></a>
              </article>
            </div>
            <p className="mt-5 text-xs leading-5 text-[#68705C]">{originsSource.note} {museumSource.note}</p>
          </div>
        </section>

        <section id="criterios-editoriais" className="scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
            <div><span className="stop-chip">Compromisso editorial</span><h2 className="display-font mt-4 text-4xl leading-none tracking-[-0.055em] sm:text-5xl">Informar sem prometer além do que podemos confirmar.</h2></div>
            <div className="border-y border-[#3C482D]/12 bg-[#FFFDF6] py-2">{editorialPrinciples.map((principle, index) => <div key={principle} className="flex gap-4 border-b border-[#3C482D]/10 py-5 last:border-b-0"><span className="pt-0.5 text-sm font-black text-[#B9572D]">0{index + 1}</span><p className="text-base leading-7 text-[#48513B]">{principle}</p></div>)}</div>
          </div>
        </section>

        <section id="proximos-passos" className="scroll-mt-20 border-t border-[#3C482D]/10 bg-[#3C482D] px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div><span className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#F2D478]">Em breve</span><h2 className="display-font mt-4 text-4xl leading-none tracking-[-0.055em] sm:text-5xl">A expansão do mapa só acontece depois que este polo estiver validado.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/74">Agenda, parceiros, outros destinos e recursos administrativos não fazem parte desta experiência pública enquanto os dados e a operação ainda estão sendo estruturados.</p></div>
            <span className="inline-flex h-fit items-center gap-2 border border-white/20 px-4 py-3 text-sm font-extrabold text-white/85"><Info className="h-4 w-4" /> Protótipo em evolução</span>
          </div>
        </section>
      </main>

      <footer className="bg-[#2E3222] px-4 py-8 text-white/72 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 text-xs sm:flex-row"><p>© 2026 Bora Piauí · Protótipo editorial do Polo Origens.</p><p>São Raimundo Nonato e Coronel José Dias.</p></div></footer>
    </div>
  );
}
