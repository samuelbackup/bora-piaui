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

**Nota:** Rotas externas, regras de visitação, operação de atrativos e condições climáticas devem ser confirmadas pelo visitante nos canais responsáveis antes da viagem.
