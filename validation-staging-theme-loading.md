# Validação — staging, modo escuro e abertura suave

## Escopo

A branch local `staging` foi criada a partir de `main` para isolar testes antes da produção. A home recebeu uma alternância de **modo escuro** dentro do menu compacto e uma camada de abertura curta com a marca Bora Piauí.

## Acessibilidade e comportamento

O controle de tema usa `role="switch"`, informa o estado com `aria-checked` e alterna o rótulo entre modo claro e escuro. A escolha fica persistida no navegador pelo `ThemeProvider`. A camada de abertura é decorativa (`aria-hidden`), não bloqueia interações e é removida imediatamente para pessoas que usam `prefers-reduced-motion`.

## Evidências

Foram concluídos com sucesso `pnpm check`, `pnpm test` e `pnpm build`, com **42 testes** aprovados. A home foi inspecionada em **1280 × 720** e **375 × 812**, confirmando o cabeçalho compacto, a marca, Meu roteiro e o menu sem sobreposição.

## Pendência de publicação

A etapa restante é enviar a branch `staging` ao GitHub e confirmar a URL de prévia criada pela Vercel. A branch `main` não será alterada nesta entrega.
