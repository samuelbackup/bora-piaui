# Bora Piauí

Atlas editorial de turismo do Piauí com curadoria verificada: só entra no mapa o que tem fonte pública, período e dados operacionais confirmados.

## Estrutura

```
client/            Frontend React + Vite (páginas, componentes, estilos)
server/            API Node/Express + tRPC
  database/        Schema Drizzle, relations e migrations SQL
  _core/           Infra do servidor (auth, sessão, storage, trpc)
  routers/         Contratos tRPC por domínio
shared/            Constantes e tipos compartilhados entre client e server
scripts/           Ferramentas de manutenção (criar admin, validações E2E)
docs/              Documentação do projeto
  architecture/    Blueprint técnico e contratos de integração
  research/        Pesquisas e fontes editoriais das cidades-piloto
  planning/        Planejamento, ideias e relatórios de status
patches/           Patches de dependências (pnpm)
```

## Comandos

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Servidor de desenvolvimento (API + Vite) |
| `pnpm build` | Build de produção (frontend + backend) |
| `pnpm start` | Roda o bundle de produção |
| `pnpm check` | Verificação de tipos (`tsc --noEmit`) |
| `pnpm lint` | ESLint |
| `pnpm test` | Suíte de testes (Vitest) |
| `pnpm db:push` | Gera e aplica migrations do Drizzle |
| `pnpm format` | Formatação com Prettier |

## Requisitos

- Node.js **>= 20**
- pnpm 10 (gerenciador fixado em `packageManager`)

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | MySQL (obrigatória) |
| `SESSION_JWT_SECRET` | Segredo de assinatura de sessão (obrigatória em produção) |
| `BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY` | Upload e proxy de imagens |
| `VITE_FRONTEND_FORGE_API_KEY` | Proxy do Google Maps no frontend |

Sem `SESSION_JWT_SECRET` em produção o servidor **recusa o boot** por segurança.

## Painel editorial

- Página pública: `/` (atlas, cidades, agenda, patrimônios, sabores)
- Login da curadoria: `/login`
- Painéis: `/admin/editorial` e `/admin/destinos` (exigem conta com `role: admin`)

Crie o primeiro administrador com:

```bash
npx tsx scripts/create-admin.ts email@exemplo.com senhaMin8 "Nome"
```
