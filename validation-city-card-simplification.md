# Validação — simplificação dos cartões das cidades-piloto

## Recorte aprovado

Os cartões de atrações nas três cidades-piloto deixaram de exibir os blocos expansivos **“Confirmação necessária”** e **“Contato não publicado”**. A versão atual prioriza título, descrição, fonte e ações que efetivamente existirem, preservando o escopo de demonstração estudantil.

| Cidade | Desktop, 1280 × 720 px | Celular, 375 × 812 px | Resultado |
|---|---|---|---|
| Teresina | Validado | Validado | Cartões de Encontro dos Rios e Polo Cerâmico do Poti Velho sem os dois blocos removidos. |
| Cajueiro da Praia | Validado | Validado | Cartões de Barra Grande e Cajueiro-rei do Piauí sem os dois blocos removidos. |
| São Raimundo Nonato | Validado | Validado | Cartões do Parque Nacional Serra da Capivara e Museu do Homem Americano sem os dois blocos removidos; o contato institucional do ICMBio continua disponível somente onde foi publicado. |

## Limite de escopo

O rótulo discreto **“Operação a confirmar”** permanece como contexto mínimo editorial. Um fluxo mais detalhado de confirmação de horários, contatos e condições operacionais foi deliberadamente adiado para uma versão futura do Bora Piauí, quando houver capacidade de curadoria contínua.

## Regressão

`pnpm check`, Vitest com 32 testes, build de produção e `scripts/validate-mvp-city-journey.mjs` concluíram sem erros. O cenário automatizado confirma a ausência dos dois avisos removidos em Teresina, São Raimundo Nonato e Cajueiro da Praia.

## Confirmação no domínio publicado

| Cidade | URL | Situação |
|---|---|---|
| Teresina | `https://borapiaui-ffk8iyz3.manus.space/cidades/teresina?publication=7ba33499` | A rota pública ainda respondeu com os blocos removidos em `2026-08-21`; a confirmação permanece pendente até a propagação da nova versão. |
| Cajueiro da Praia | `https://borapiaui-ffk8iyz3.manus.space/cidades/cajueiro-da-praia?publication=7ba33499&probe=cajueiro` | A rota pública ainda respondeu com os blocos removidos em `2026-08-21`; a confirmação permanece pendente até a propagação da nova versão. |
| São Raimundo Nonato | `https://borapiaui-ffk8iyz3.manus.space/cidades/sao-raimundo-nonato?publication=7ba33499&probe=sao-raimundo` | A rota pública ainda respondeu com os blocos removidos em `2026-08-21`; a confirmação permanece pendente até a propagação da nova versão. |
