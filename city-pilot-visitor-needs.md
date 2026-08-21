# Cidades-piloto: necessidades do visitante e descoberta por proximidade

## Decisão de produto

O público prioritário do MVP é o **visitante**. A interface deve ajudá-lo a responder, a partir de um ponto de visita: **onde estou, o que vale conhecer por perto, onde encontrar uma pausa de alimentação ou serviço curado, como chegar e o que preciso confirmar antes de sair**. Negócios locais entram como conteúdo editorial aprovado; a gestão ou o cadastro desses negócios não fazem parte desta fatia de front-end.

> “Perto” será uma relação editorial de território, não uma promessa de distância ou tempo. Quilometragem, duração de percurso, horários, capacidade e preço só devem aparecer depois de confirmação no contrato de dados.

## Necessidades por cidade-piloto

| Cidade e âncora | Necessidade imediata do visitante | Conteúdo prioritário de proximidade | Limite de publicação atual |
|---|---|---|---|
| Teresina — Encontro dos Rios | Transformar a parada paisagística em uma escolha de continuidade: história, artesanato e uma pausa de alimentação ou serviço. | O Polo Cerâmico do Poti Velho é uma relação editorial prioritária de “história e artesanato no mesmo território”. A SEMDEC o classifica como atrativo turístico e vincula sua produção às tradições locais, à lenda do Cabeça de Cuia e ao encontro dos rios. [1] | Não publicar nomes, horários ou contatos de restaurantes e artesãos enquanto não forem curados. |
| Cajueiro da Praia — Barra Grande | Entender o que pode ser feito ao redor da praia sem confundir descoberta com confirmação de operação. | Separar claramente experiências de litoral e natureza de alimentação e serviços curados. A ação principal continua sendo consultar rota e confirmar maré, condução e operação local. | Não incluir relações novas de negócios, passeios ou horários até haver fonte institucional ou cadastro aprovado. |
| São Raimundo Nonato — Serra da Capivara | Planejar uma visita cultural com contexto, condução e alternativas de interesse. | Organizar descoberta por arqueologia, história, natureza e acessibilidade. O ICMBio informa sítios arqueológicos e históricos, circuitos e pontos acessíveis, além de condução obrigatória para os programas. [2] | Manter aviso de confirmação de circuito, condutor e condições; não estimar duração de visitas ou deslocamentos. |

## Prioridades de experiência

| Prioridade | Entrega de front-end | Critério de aceite |
|---|---|---|
| P0 | **Bloco “O que há por perto”** no contexto de uma âncora visitada. | Exibe relações editoriais com categoria, motivo da relação, fonte e ação de detalhe ou rota. Sem coordenadas confiáveis, não mostra distância numérica. |
| P0 | **Categorias de decisão**: história e cultura, natureza, gastronomia e serviços. | Filtros distinguem conteúdo já curado de categorias ainda sem resultado, sem esconder a cidade ou inventar estabelecimentos. |
| P0 | **Próxima ação clara** em todo item. | Cada cartão oferece ao menos uma ação válida: ver detalhe, abrir rota, consultar fonte ou contato institucional. Ações ausentes recebem fallback explícito. |
| P0 | **Condição de visitação visível**. | Itens sujeitos a maré, condução ou operação variável mostram “confirme antes de sair” perto da ação principal. |
| P1 | **Pausa de alimentação e serviços curados**. | Só aparece após cada negócio ter nome, categoria, fonte, canal público, status de publicação e atualização editorial. |
| P1 | **Roteiro de proximidade**. | A âncora e os itens relacionados podem ser adicionados ao roteiro de um dia sem calcular tempo, preço ou viabilidade operacional. |

## Matriz de aceitação da primeira versão

| Fluxo | Resultado esperado |
|---|---|
| Abrir Encontro dos Rios | O visitante identifica o Polo Cerâmico do Poti Velho como próxima descoberta de história e artesanato, com fonte municipal e rota separada. |
| Filtrar gastronomia em uma cidade sem negócios aprovados | O visitante encontra um estado vazio editorial: a curadoria ainda não publicou locais; não há card fictício. |
| Abrir Serra da Capivara | O visitante encontra interesses por tipo, aviso de condução e condições variáveis, fonte oficial e contato institucional. |
| Abrir Barra Grande | O visitante encontra a âncora de litoral e um aviso de confirmação de maré e operação; relações sem fonte não são apresentadas como recomendação. |

## Dados necessários para integrar depois

O front-end precisará, por relação de proximidade, de `anchorItemId`, `relatedItemId`, `relationType`, `editorialReason`, `publicationStatus`, `source`, `routeUrl?`, `contactUrl?`, `operationalStatus` e `verifiedAt`. `distanceMeters` e `travelDurationMinutes` ficam opcionais, pois só podem ser exibidos quando calculados ou fornecidos por uma fonte confirmada.

## Referências

[1] [SEMDEC Teresina — Polo Cerâmico do Poti Velho](https://semdec.pmt.pi.gov.br/secretario-municipal-de-turismo-visita-polo-ceramico-de-teresina/)

[2] [ICMBio — Informações sobre visitação do Parque Nacional Serra da Capivara](https://www.gov.br/icmbio/pt-br/assuntos/unidade-de-conservacao/unidades-de-biomas/caatinga/lista-de-ucs/parna-da-serra-da-capivara/informacoes-sobre-visitacao-2013-parna-da-serra-da-capivara)
