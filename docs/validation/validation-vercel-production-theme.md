# Validação — tema na produção Vercel

Em 21 de agosto de 2026, o domínio de produção [bora-piaui.vercel.app](https://bora-piaui.vercel.app) carregou uma versão que exibia o menu compacto, mas não incluía o controle de alternância de modo escuro. A inspeção do DOM confirmou a ausência de `.home-theme-control` e de `[role="switch"]`; o HTML ainda referenciava o bundle antigo `assets/index-7scKd0ch.js`.

O diagnóstico identificou que `scripts/prepare-vercel-static-deployment.mjs` mantinha hashes de assets fixos. A correção substituiu essa lista por descoberta dinâmica dos arquivos em `dist/public/assets` e configurou a Vercel para executar `pnpm vite build` e publicar `dist/public` a cada push. O commit [`4ce2260`](https://github.com/samuelbackup/bora-piaui/commit/4ce226001c4a9c554751e60208bcab4dac35880b) iniciou a implantação de produção [bora-piaui-n3sqs24p8-samuel-levi.vercel.app](https://bora-piaui-n3sqs24p8-samuel-levi.vercel.app), que estava em compilação no último acompanhamento.

## Validação final

No domínio [bora-piaui.vercel.app](https://bora-piaui.vercel.app/?theme-release=4ce2260), o menu compacto passou a exibir o bloco **Modo escuro**. A alternância foi acionada manualmente e a home adotou imediatamente o tema escuro, com o rótulo do controle alterado para **Claro**. A abertura suave continua presente na inicialização e não há sobreposição no cabeçalho.
