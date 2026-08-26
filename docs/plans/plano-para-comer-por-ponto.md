# Plano de experiência — “Para comer perto deste ponto”

## Objetivo

Transformar o bloco genérico **Para comer** em uma descoberta contextual: a pessoa escolhe uma atração de Teresina e vê somente opções gastronômicas cuja relação com aquele ponto tenha sido **curada e publicada**. O fluxo deve ajudar na organização da visita sem apresentar restaurantes como recomendação, sem inferir distância e sem criar dados operacionais.

## Decisão recomendada

>A melhor opção é um **modelo híbrido, centrado em uma única seção “Para comer”**: cada ponto turístico conduz a pessoa a esse mesmo bloco já contextualizado pela atração escolhida.

Não é recomendado criar uma lista diferente dentro de cada cartão turístico. Isso duplicaria conteúdo, aumentaria a poluição visual da grade de atrações e multiplicaria o trabalho de curadoria. Também não é recomendado manter apenas o bloco genérico atual, pois ele não responde à pergunta prática de quem está planejando uma visita a um local específico.

| Elemento | Decisão | Justificativa |
|---|---|---|
| Origem da ação | Detalhe da atração e âncora selecionada no mapa | A pessoa já está no contexto do ponto que pretende visitar. |
| Rótulo da ação | **Ver opções para comer perto deste ponto** | Explicita o contexto sem prometer distância ou qualidade. |
| Destino | Uma única seção `Para comer` na página de Teresina | Evita duplicação e mantém a descoberta organizada. |
| Contexto exibido | “Opções relacionadas a: [nome da atração]” | Torna a seleção visível, compreensível e reversível. |
| Sem opções publicadas | Estado “Em curadoria” + ação neutra “Buscar no mapa” | Não inventa estabelecimentos e ainda oferece continuidade à visita. |

## Fluxo proposto

A pessoa visualiza uma atração, como o **Theatro 4 de Setembro**, e abre seu detalhe. Abaixo das ações de rota e fonte, encontra a chamada secundária “Ver opções para comer perto deste ponto”. Ao acioná-la, a página rola até a seção Para comer, seleciona o Theatro como âncora e anuncia a mudança para leitores de tela.

O bloco passa a mostrar apenas relações gastronômicas vinculadas editorialmente àquela atração. Cada opção publicada deve apresentar seu nome, uma explicação objetiva da relação territorial, a fonte institucional ou editorial e os únicos links permitidos: rota, contato ou site — quando confirmados. A relação não deve usar expressões como “a poucos minutos”, “o melhor”, “imperdível” ou avaliações.

| Estado | Interface esperada |
|---|---|
| Atração selecionada com opções validadas | Título contextual, cartões curados, fonte e ação de rota/contato confirmada. |
| Atração selecionada sem opções validadas | “Opções para comer em curadoria para este ponto”; botão opcional e neutro para pesquisa no mapa. |
| Entrada direta em Para comer | Seletor “Escolha um ponto de partida” com as atrações publicadas de Teresina. |
| Troca de atração pelo mapa | Atualização do título e dos cartões da seção, sem recarregar a página. |

## Escopo de implementação futura

1. Manter o bloco atual como seção única, mas torná-lo dependente de uma `atração-âncora` selecionada.
2. Adicionar uma ação contextual apenas na **página de detalhe** de cada atração; na grade da cidade, preservar o cartão mais limpo com “Ver detalhes”.
3. Modelar relações explícitas entre `attraction` e `business` no catálogo local, com razão editorial e fonte. A migração futura deve reutilizar a entidade `place_proximity_relations` prevista no blueprint.
4. Publicar cartões gastronômicos somente depois de registrar fonte, canal de contato permitido e revisão editorial. Nenhuma integração automática de diretórios, avaliações ou distâncias será usada.
5. Implementar os estados vazio, carregando e erro; testar a troca de âncora, a navegação por teclado e o layout a partir de 360 px.

## Critérios de aceite

| Critério | Evidência de conclusão |
|---|---|
| Não há lista repetida em cada card turístico | A grade segue focada em atração, fonte e detalhe. |
| A ação contextual leva a uma única seção Para comer | O título da seção identifica corretamente o ponto ativo. |
| Não há restaurante sem relação e fonte publicadas | Teste automatizado rejeita cartões sem metadados editoriais obrigatórios. |
| Não há tempo, distância, preço, avaliação ou promoção não confirmados | Revisão textual e testes de regressão aprovados. |
| A mudança de ponto é clara e acessível | Estado selecionado visível, foco gerenciado e anúncio acessível. |
| O fluxo continua legível em mobile | Validação em 375 px e em desktop. |

## Premissas e riscos

O MVP ainda não mantém telemetria persistida, diretório gastronômico validado nem dados operacionais de estabelecimentos. Por isso, a primeira entrega deve priorizar a **estrutura de descoberta e os estados de curadoria**, não uma lista extensa. A disponibilidade real de opções por atração dependerá do trabalho editorial posterior e de fontes públicas verificáveis.
