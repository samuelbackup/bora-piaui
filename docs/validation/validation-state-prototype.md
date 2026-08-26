# Validação — Protótipo estadual

**Data:** 20 de agosto de 2026

| Fluxo validado | Resultado observado |
| --- | --- |
| Filtro por polo | Ao selecionar **Costa do Delta**, a descoberta passou a exibir apenas Delta do Parnaíba e Barra Grande. |
| Sincronia com mapa | Após o filtro, o mapa mostrou dois marcadores correspondentes aos dois destinos exibidos. |
| Metadados | O título e a descrição passaram a identificar a experiência como um atlas estadual, e não mais como produto exclusivo de Teresina. |
| Disponibilidade dos dados | Os blocos de Cadastur, escala ambiental e visitação da Serra da Capivara renderizaram com fonte e ano visíveis. |
| Compilação | `pnpm run build` concluído sem erros. |
| Responsividade | Capturas em 1280×720 e 375×812 concluídas; navegação e conteúdo mantiveram acesso visual. |
| Mapa de patrimônios | O Google Maps carregou os quatro marcadores geocodificados; ao selecionar Oeiras, o mapa aproximou a referência correspondente. |
| Galeria de Sabores | A página completa exibiu quatro itens de galeria sem imagens quebradas; os controles regionais e as descrições de fonte permaneceram visíveis. |
| Filtro regional | Teste automatizado confirmou um resultado para Teresina, dois para Interior e sertões e quatro itens para Todos. |
| Visual móvel | As trilhas de Patrimônios e Sabores foram revisadas em 375 × 812 px, com navegação horizontal íntegra, tipografia legível e início das seções sem sobreposição. |
| Transparência visual | Os cards cuja imagem mostra território, e não o preparo, passaram a informar explicitamente essa condição sobre o próprio visual. |
| Descoberta — Opção 1 | A prévia local e o domínio publicado exibem filtros principais em uma única faixa, resumo editorial e polos discretos; a propagação foi confirmada após a publicação da versão 68c08a7d. |
| Encontro dos Rios | O domínio publicado passou a exibir a imagem institucional do Mapa da Cultura PI no card do destino. |
| Polos turísticos | No domínio publicado, a seleção de Teresina filtrou a lista. O foco por teclado exibiu anel de 4 px e, no polo apontado, o hover alterou fundo, cor, borda e sombra (7 px × 16 px), conforme inspeção dos estilos computados. |
| Contexto de polos — móvel | Em 375 × 812 px, tocar Teresina exibiu a prévia do Encontro dos Rios, reduziu a lista a esse card e destacou o botão correspondente no mapa. A suíte automatizada concluiu 22 testes e a compilação de produção foi aprovada. |
| Contexto de polos — seleção local | Ao selecionar Teresina, a interface exibiu o microtexto contextual, a imagem do Encontro dos Rios e o estado ativo do polo; o recorte também reduziu a lista e o mapa ao destino correspondente. |
| Contexto de polos — domínio publicado | Na versão pública, selecionar Teresina exibiu “Contexto do polo”, a imagem de prévia do Encontro dos Rios, o microtexto explicativo, uma lista com um destino e o marcador correspondente no mapa. |
| Transição entre prévias — desktop | O cenário automatizado alternou Teresina, Costa do Delta e Aventura e Mistério. A troca por hover exibiu a animação `pole-preview-enter`; ao aplicar o último polo, filtro, prévia e o mapa convergiram para **2 destinos**, em **112 ms**. |
| Transição entre prévias — móvel | Em 375 × 812 px com toque, a troca de Teresina para Costa do Delta preservou a prévia e o estado ativo do filtro; o mapa passou a anunciar **2 destinos**, concluindo em **164 ms**. |
| Regressão de interface | Após a implementação, `pnpm check`, a suíte Vitest com 22 testes e a compilação de produção foram concluídos sem erros. |
| Indicador de destino ativo | O mapa agora exibe um painel textual persistente com o rótulo “Destino ativo no mapa” e o nome do destino mais município. O cenário automatizado confirmou que o texto acompanha a prévia em desktop e em 375 × 812 px. |
| Indicador — marcadores | No cenário automatizado, o clique direto em **Serra dos Matões** no desktop e em **Barra Grande** no viewport móvel atualizou o indicador para o destino e município correspondentes, preservando o recorte ativo do mapa. |
| Detalhes do destino ativo | O painel do mapa passou a oferecer a ação “Ver detalhes”. A validação automatizada confirmou, em desktop e viewport móvel, que o link acompanha o marcador selecionado e abre a ficha correspondente: Serra dos Matões e Barra Grande, respectivamente. |
| MVP de três cidades — interface | A página de cidade foi revisada em desktop e 375 × 812 px. A hierarquia de descoberta, filtros, estado de confirmação, mapa sincronizado e CTAs permaneceram legíveis; o roteiro de Teresina apresentou paradas e mapa lado a lado no desktop. |
| MVP de três cidades — estados e roteiro | As capturas em desktop e 375 × 812 px confirmaram o aviso reutilizável de contato não publicado, a ação de rota, a fonte rastreável, o indicador de destino ativo e o enquadramento “Proposta de 1 dia · Operação a confirmar”, sem afirmar duração ou operação não confirmadas. |
| Regressão MVP | `pnpm check`, Vitest (10 arquivos e 27 testes), build de produção e o cenário navegável de Teresina e Cajueiro da Praia foram concluídos sem erros. |
| Catálogo local controlável | A jornada de cidade passou a carregar por adaptador assíncrono local. O cenário com `?mvpLoading=1` confirmou a exibição de “Preparando a cidade” antes de renderizar Teresina; o fluxo não realiza chamadas de servidor. |
| Contato institucional | O cartão do Parque Nacional Serra da Capivara passou a exibir a ação “Contato” para os [Canais de Atendimento do ICMBio](https://www.gov.br/icmbio/pt-br/canais_atendimento). O cenário automatizado confirmou destino e abertura em nova aba; os demais itens preservam o aviso de contato não publicado. |
| Regressão MVP — final | Tipagem, build, 28 testes automatizados e o cenário de navegador com loading, contato, filtros, roteiro, detalhes e mobile foram concluídos sem erros. |

**Nota:** Rotas externas, regras de visitação, operação de atrativos e condições climáticas devem ser confirmadas pelo visitante nos canais responsáveis antes da viagem.
