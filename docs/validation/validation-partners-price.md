# Validação de preço — plano Mais visibilidade

## Validação local

- A rota `/parceiros` exibe **R$ 49/mês** no plano **Mais visibilidade** em 400 × 689 px e 1280 × 720 px.
- A nota informa que o valor é uma referência para o MVP e que não há cobrança neste protótipo.
- `pnpm check`, `pnpm test` e `pnpm build` concluíram com êxito: 13 arquivos e 45 testes aprovados.

## Produção Vercel

O commit `fa21346` foi enviado para `main` em 22/08/2026. Depois da propagação do deploy automático, a URL `https://bora-piaui.vercel.app/parceiros?ver=fa21346&retry=1` confirmou o plano Mais visibilidade com **R$ 49/mês** e a nota: “Valor de referência para o MVP; não há cobrança neste protótipo.”
