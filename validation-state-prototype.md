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

**Nota:** Rotas externas, regras de visitação, operação de atrativos e condições climáticas devem ser confirmadas pelo visitante nos canais responsáveis antes da viagem.
