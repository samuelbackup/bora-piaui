# Validação — navegação entre cidades-piloto

## Escopo validado

O seletor **Cidades-piloto** foi incluído abaixo da abertura de cada página de cidade. Ele mantém o retorno ao Atlas no cabeçalho e permite alternar entre Teresina, Cajueiro da Praia e São Raimundo Nonato sem passar pela Home.

| Critério | Desktop, 1280 × 720 px | Celular, 375 × 812 px | Resultado |
|---|---|---|---|
| Teresina ativa | Validado | Validado | Teresina recebe destaque visual; Cajueiro da Praia e São Raimundo Nonato permanecem como links. |
| Cajueiro da Praia ativa | Validado | Validado | Cajueiro da Praia recebe destaque visual; as demais cidades permanecem acessíveis. |
| São Raimundo Nonato ativa | Validado | Validado | São Raimundo Nonato recebe destaque visual; as demais cidades permanecem acessíveis. |
| Tela estreita | Não aplicável | Validado | Os links usam rolagem horizontal, preservando os nomes completos e os alvos de toque sem quebrar o layout. |
| Acessibilidade | Validado | Validado | A navegação possui rótulo “Cidades-piloto”, foco visível e a cidade atual usa `aria-current="page"`. |

## Regressão

`pnpm check`, Vitest com 33 testes, build de produção e `scripts/validate-mvp-city-journey.mjs` concluíram sem erros. O cenário automatizado confirma o ciclo Teresina → Cajueiro da Praia → São Raimundo Nonato → Teresina e a disponibilidade do seletor em celular.

## Confirmação pública

Após a propagação do checkpoint `05e35393`, o domínio público confirmou o seletor em duas cidades:

| Cidade ativa | URL verificada | Links disponíveis |
|---|---|---|
| Teresina | `https://borapiaui-ffk8iyz3.manus.space/cidades/teresina?publication=05e35393&probe=public-confirmed` | Cajueiro da Praia e São Raimundo Nonato. |
| Cajueiro da Praia | `https://borapiaui-ffk8iyz3.manus.space/cidades/cajueiro-da-praia?publication=05e35393&probe=public-confirmed` | Teresina e São Raimundo Nonato. |
| São Raimundo Nonato | `https://borapiaui-ffk8iyz3.manus.space/cidades/sao-raimundo-nonato?publication=05e35393&probe=public-confirmed` | Teresina e Cajueiro da Praia. |

As três páginas públicas exibem a cidade atual como item ativo e as outras duas como links diretos.
