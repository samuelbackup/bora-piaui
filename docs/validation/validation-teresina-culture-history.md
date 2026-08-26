# Validação — Cultura e História de Teresina

## Resultado

Os diretórios **“Restaurantes curados”** e **“Serviços curados”** não são mais exibidos nas páginas das cidades-piloto. Em Teresina, o espaço foi substituído por dois blocos editoriais: **Cultura** e **História**.

| Critério | Desktop, 1280 × 720 px | Celular, 375 × 812 px | Resultado |
|---|---|---|---|
| Retirada dos diretórios | Validado | Validado | Os títulos e estados vazios de restaurantes e serviços não aparecem. |
| Cultura | Validado | Validado | O bloco apresenta o Polo Cerâmico e a cena cultural da capital com fonte pública acessível. |
| História | Validado | Validado | O bloco apresenta o contexto de fundação e planejamento urbano de Teresina com a mesma fonte pública. |
| Curadoria responsável | Validado | Validado | A definição editorial solicitada aparece antes dos dois blocos e informa que cada cartão possui fonte pública para consulta. |
| Layout | Validado | Validado | Em desktop os blocos são exibidos em duas colunas; em celular, em coluna única, mantendo títulos, texto e fonte legíveis. |

## Regressão

`pnpm check`, Vitest com 37 testes, build de produção e `scripts/validate-mvp-city-journey.mjs` concluíram sem erros. O cenário verifica Cultura, História, a fonte do G20 Brasil e a ausência dos dois diretórios removidos.

## Confirmação pública

A página publicada de [Teresina](https://borapiaui-ffk8iyz3.manus.space/cidades/teresina?publication=7bb8b5e3&probe=propagated) confirmou os dois blocos, suas fontes acessíveis e a ausência de “Restaurantes curados” e “Serviços curados”.

## Correção de escopo — tópicos básicos preservados

Após a revisão de escopo, os tópicos **“Para comer”** e **“Para organizar a visita”** foram restaurados antes da seção editorial. Eles continuam descrevendo a curadoria pendente sem inventar negócios, enquanto **Cultura** e **História** ocupam a área complementar abaixo.

| Conteúdo em Teresina | Desktop, 1280 × 720 px | Celular, 375 × 812 px | Ordem validada |
|---|---|---|---|
| Para comer | Validado | Validado | Antes de Cultura e História. |
| Para organizar a visita | Validado | Validado | Antes de Cultura e História. |
| Cultura | Validado | Validado | Após os tópicos básicos. |
| História | Validado | Validado | Após os tópicos básicos. |

`pnpm check`, Vitest com 37 testes, build e a jornada das cidades foram repetidos após a restauração. A jornada confirma os quatro conteúdos sem listar negócios não verificados.

## Confirmação pública da correção

A [página publicada de Teresina](https://borapiaui-ffk8iyz3.manus.space/cidades/teresina?publication=ef48e7e0&probe=basics-restored) confirmou a sequência **Para comer → Para organizar a visita → Cultura → História**. Os dois primeiros tópicos preservam o planejamento básico com curadoria pendente, enquanto os dois últimos permanecem como contexto editorial com fonte pública.
