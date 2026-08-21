# Validação — diretórios de restaurantes e serviços curados

## Cenários verificados

| Cenário | Evidência |
|---|---|
| Serviço publicado | Em São Raimundo Nonato, o diretório de serviços exibiu **Canais de atendimento do ICMBio**, com fonte institucional, botão de contato e botão de fonte. |
| Restaurante sem curadoria publicada | Em São Raimundo Nonato e Teresina, o diretório exibiu o estado “Restaurantes em curadoria”, sem listar estabelecimento ou contato não verificado. |
| Serviço sem curadoria publicada | Em Teresina, o diretório exibiu “Serviços em curadoria”, sem criar canais de apoio fictícios. |
| Desktop | As duas colunas mantiveram hierarquia, ações e fontes legíveis na página completa de Teresina e São Raimundo Nonato. |
| Mobile, 375 × 812 px | Os diretórios passaram para uma coluna; os botões de contato e fonte permaneceram legíveis e com áreas de toque separadas. |
| Regressão | `pnpm check`, Vitest com 32 testes, build de produção e o cenário `validate-mvp-city-journey.mjs` foram concluídos sem erros. O cenário agora confirma título, contato e fonte de “Canais de atendimento do ICMBio”. |

## Decisão editorial

O componente aceita restaurantes e serviços por contrato tipado, mas somente mostra registros com `status: "published"`, fonte e contato quando existirem. A lista vazia é um resultado editorial válido: ela preserva o espaço visual e informa a curadoria pendente, sem inventar negócios, horários, preços, contatos ou avaliações.

## Confirmação no domínio publicado

| Cidade | URL validada | Resultado observado |
|---|---|---|
| Teresina | `https://borapiaui-ffk8iyz3.manus.space/cidades/teresina?publication=f71a8fba` | Diretórios “Restaurantes curados” e “Serviços curados” confirmados explicitamente, ambos nos estados “em curadoria”, sem registros, contatos ou ações operacionais fictícias. |
| São Raimundo Nonato | `https://borapiaui-ffk8iyz3.manus.space/cidades/sao-raimundo-nonato?publication=f71a8fba` | Diretório “Restaurantes curados” confirmado no estado “em curadoria”. No diretório “Serviços curados”, “Canais de atendimento do ICMBio” foi confirmado no DOM público, com ações “Contato” e “Ver fonte” para o canal institucional. |
| Cajueiro da Praia | `https://borapiaui-ffk8iyz3.manus.space/cidades/cajueiro-da-praia?publication=f71a8fba` | Diretórios “Restaurantes curados” e “Serviços curados” confirmados explicitamente, ambos nos estados “em curadoria”, sem inserir negócios, contatos ou condições operacionais não verificados. |
