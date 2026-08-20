import { ArrowLeft, ArrowUpRight, Landmark, MapPin, Sparkles } from "lucide-react";
import { Link } from "wouter";

const material = [
  {
    title: "Oeiras: a cidade e seus vestígios",
    place: "Oeiras",
    text: "Capital da província do Piauí entre 1758 e 1852, a então Vila da Mocha cresceu ao redor da Matriz de Nossa Senhora da Vitória, construída em 1733. A Ponte Grande, de 1846, e o Sobrado Nepomuceno concentram parte dessa memória arquitetônica.",
    source: "Iphan · Patrimônio Material",
    url: "https://www.gov.br/iphan/pt-br/superintendencias/piaui/patrimonio-material",
  },
  {
    title: "Parnaíba: porto, comércio e cidade",
    place: "Parnaíba",
    text: "Tombado pelo Iphan em 2011, o conjunto histórico e paisagístico reúne cerca de 830 imóveis em cinco setores, entre eles Porto das Barcas, Praças da Graça e Santo Antônio, Estação Ferroviária e Avenida Getúlio Vargas.",
    source: "Iphan · Patrimônio Material",
    url: "https://www.gov.br/iphan/pt-br/superintendencias/piaui/patrimonio-material",
  },
  {
    title: "Serra da Capivara: paisagem documentada em pedra",
    place: "São Raimundo Nonato e entorno",
    text: "Criado em 1979 para preservar vestígios arqueológicos, o parque reúne centenas de sítios com pinturas e gravuras rupestres. Foi inscrito na Lista do Patrimônio Mundial da UNESCO em 1991 e no Livro do Tombo Arqueológico, Etnográfico e Paisagístico do Iphan em 1993.",
    source: "Iphan · Patrimônio Arqueológico",
    url: "https://www.gov.br/iphan/pt-br/superintendencias/piaui/patrimonio-arqueologico",
  },
  {
    title: "Sete Cidades: tempo geológico e inscrições rupestres",
    place: "Piracuruca e Brasileira",
    text: "O parque foi criado em 1961. Seus monumentos rochosos resultam de processos erosivos de longa duração; no local, o Iphan registra sítios com vestígios pré-coloniais e inscrições rupestres, como as do Salão do Pajé.",
    source: "Iphan · Patrimônio Arqueológico",
    url: "https://www.gov.br/iphan/pt-br/superintendencias/piaui/patrimonio-arqueologico",
  },
];

const immaterial = [
  {
    title: "Cajuína: técnica, casa e hospitalidade",
    tag: "Reconhecida em 2014",
    text: "A produção tradicional e as práticas socioculturais associadas à cajuína foram reconhecidas como patrimônio cultural imaterial. O Iphan relaciona seu preparo aos rituais de hospitalidade e às redes familiares de produção no Piauí.",
    source: "Iphan · Patrimônio Imaterial",
    url: "https://www.gov.br/iphan/pt-br/superintendencias/piaui/patrimonio-imaterial",
  },
  {
    title: "Arte Santeira em Madeira do Piauí",
    tag: "Registrada em 2023",
    text: "Esculturas de santos, anjos, caboclos, oratórios e mobiliário em madeira formam uma expressão marcada por autoria e formas estilizadas. O registro reconhece a singularidade de cada peça e a trajetória de artistas de diferentes cidades piauienses.",
    source: "Iphan · Bem Cultural Brasileiro",
    url: "https://bcr.iphan.gov.br/acoes-de-salvaguarda/registro-da-arte-santeira-em-madeira-do-piaui-como-patrimonio-cultural-do-brasil/",
  },
  {
    title: "Saberes que seguem em inventário",
    tag: "Referências culturais",
    text: "O Iphan informa inventários sobre comunidades quilombolas em 17 municípios, Arte Santeira em seis municípios, Tambor de Crioula do Piauí e patrimônio imaterial relacionado à Serra da Capivara. Inventário não é sinônimo de registro, mas documenta referências e detentores.",
    source: "Iphan · Patrimônio Imaterial",
    url: "https://www.gov.br/iphan/pt-br/superintendencias/piaui/patrimonio-imaterial",
  },
];

function Topbar() {
  return <header className="sticky top-0 z-40 border-b border-[#3C482D]/10 bg-[#F5ECD8]/95 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-2 text-sm font-extrabold text-[#3C482D] hover:text-[#B9572D]"><ArrowLeft className="h-4 w-4" /> Voltar ao atlas</Link><nav className="flex items-center gap-4 text-xs font-extrabold sm:gap-6 sm:text-sm"><Link href="/patrimonios" className="text-[#B9572D]">Patrimônios</Link><Link href="/sabores" className="hover:text-[#B9572D]">Sabores</Link><Link href="/dados" className="hover:text-[#B9572D]">Dados</Link></nav></div></header>;
}

export default function PatrimoniosPage() {
  return <div className="min-h-screen bg-[#F5ECD8] text-[#2E3222]"><Topbar /><main>
    <section className="relative overflow-hidden bg-[#3C482D] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_.75fr]"><div><span className="inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.16em]"><Landmark className="h-3.5 w-3.5" /> Trilha cultural</span><h1 className="display-font mt-6 max-w-3xl text-5xl leading-[.92] tracking-[-.06em] sm:text-6xl">Patrimônio é matéria, memória e prática.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">Uma leitura inicial de lugares, técnicas e referências culturais que ajudam a contar o Piauí. Os textos distinguem o que é tombado, registrado e inventariado.</p></div><div className="relative border-l border-white/20 pl-6 lg:mt-16"><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#E9DCC0]">Como ler esta página</p><p className="mt-3 text-lg font-bold leading-7">Material são os bens, conjuntos e paisagens preservados. Imaterial são saberes, fazeres, expressões e formas de viver que passam entre pessoas.</p><div className="mt-8 h-2 w-full bg-[#B9572D]" /></div></div></section>
    <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-6"><div><span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#B9572D]">01 · Lugares que permanecem</span><h2 className="display-font mt-3 text-4xl tracking-[-.05em] sm:text-5xl">Patrimônios materiais</h2></div><span className="hidden text-sm font-bold text-[#566B37] sm:block">Arquitetura, arqueologia e paisagem</span></div><div className="mt-9 grid gap-5 md:grid-cols-2">{material.map((item, index) => <article key={item.title} className={`overflow-hidden rounded-[1.75rem] border border-[#3C482D]/10 bg-[#FFFDF6] ${index === 0 ? "md:col-span-2" : ""}`}><div className="flex min-h-[190px] flex-col justify-between bg-[linear-gradient(115deg,#E9DCC0,#FDF5E6)] p-6"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#3C482D] text-sm font-extrabold text-white">{String(index + 1).padStart(2, "0")}</span><MapPin className="h-5 w-5 text-[#B9572D]" /></div><p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-[#566B37]">{item.place}</p></div><div className="p-6"><h3 className="display-font text-3xl tracking-[-.04em]">{item.title}</h3><p className="mt-4 max-w-3xl text-sm leading-6 text-[#566457]">{item.text}</p><a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#B9572D] hover:underline">{item.source} <ArrowUpRight className="h-4 w-4" /></a></div></article>)}</div></div></section>
    <section className="border-y border-[#3C482D]/10 bg-[#E9DCC0] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#B9572D]">02 · Saberes que circulam</span><h2 className="display-font mt-3 text-4xl tracking-[-.05em] sm:text-5xl">Patrimônios imateriais</h2><p className="mt-4 text-base leading-7 text-[#566457]">Aqui, o centro não é um objeto isolado: são técnicas, repertórios, relações e pessoas que mantêm uma prática viva.</p></div><div className="mt-9 grid gap-5 lg:grid-cols-3">{immaterial.map((item) => <article key={item.title} className="rounded-[1.75rem] bg-[#FFFDF6] p-6"><div className="flex items-center justify-between gap-3"><Sparkles className="h-5 w-5 text-[#B9572D]" /><span className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#566B37]">{item.tag}</span></div><h3 className="display-font mt-6 text-3xl tracking-[-.04em]">{item.title}</h3><p className="mt-4 text-sm leading-6 text-[#566457]">{item.text}</p><a href={item.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#B9572D] hover:underline">{item.source} <ArrowUpRight className="h-4 w-4" /></a></article>)}</div></div></section>
  </main></div>;
}
