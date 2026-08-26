# Bora Piauí 🌵

Atlas editorial de percursos turísticos do Piauí: cidades-piloto com curadoria verificável, agenda cultural, patrimônios e rede local de parceiros.

## Stack

- **Frontend**: React 19 + Vite + TailwindCSS + Wouter + tRPC client
- **Backend**: Node/Express + tRPC + Drizzle ORM (MySQL/TiDB) + Zod
- **Testes**: Vitest (unit/integração) · Playwright (validações E2E em `scripts/`)
- **Deploy**: Vercel (`vercel.json`)

## Estrutura

```
client/   Frontend React (páginas, componentes, libs e adaptadores)
server/   API Express/tRPC, routers, acesso a dados e server/drizzle (schema + migrations)
shared/   Schemas Zod e tipos compartilhados entre client e server
docs/     Documentação: architecture/ · research/ · validation/ · plans/
scripts/  Validações E2E Playwright
```

## Scripts

| Comando | Função |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento (Vite + API na mesma porta) |
| `pnpm check` | Checagem de tipos TypeScript (`tsc --noEmit`) |
| `pnpm test` | Suíte Vitest |
| `pnpm lint` | Prettier --check em `client/server/shared` |
| `pnpm build` | Build de produção (frontend + bundle do servidor) |
| `pnpm db:push` | Gera e aplica migrations do Drizzle |
| `pnpm db:migrate` | Aplica migrations pendentes |
| `pnpm db:seed` | Popula o catálogo canônico de cidades-piloto (idempotente) |

## Configuração

Copie `.env.example` para `.env` e preencha: `DATABASE_URL` (MySQL), `JWT_SECRET` (obrigatório; 32+ caracteres em produção), `OAUTH_SERVER_URL`, `VITE_APP_ID` e `OWNER_OPEN_ID` (eleva o primeiro admin). Detalhes de validação nos comentários do próprio `.env.example`.

## Documentação

- **Arquitetura e migração**: [`docs/architecture/`](docs/architecture/) — blueprint de backend, plano de migração e contratos de integração
- **Pesquisa editorial**: [`docs/research/`](docs/research/) — fontes de Teresina, patrimônios e cidades-piloto
- **Validações**: [`docs/validation/`](docs/validation/) — relatórios históricos de E2E/staging
- **Planos**: [`docs/plans/`](docs/plans/) — ideias, TODOs e planos editoriais
