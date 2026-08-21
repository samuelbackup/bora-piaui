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
