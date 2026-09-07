# Umbora Piauí

Atlas editorial de turismo do Piauí com curadoria verificada: só entra no mapa o que tem fonte pública, período e dados operacionais confirmados.

> A marca visível do produto é **Umbora Piauí**. Identificadores técnicos (repositório, pacote, rotas de API) preservam o prefixo `bora-piaui`.

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
  architecture/    Blueprint técnico e contratos de integração (históricos)
  research/        Pesquisas e fontes editoriais das cidades-piloto
  planning/        Planejamento, ideias e relatórios de status
  validation/      Registros de validação e evidências
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

## Banco de dados

O projeto usa **PostgreSQL** com Drizzle ORM. Para preparar o ambiente:

1. Crie um PostgreSQL gerenciado (ex.: Aiven, que tem plano gratuito) e copie a connection string com `?sslmode=require`.
2. Defina `DATABASE_URL` no ambiente (o servidor e o `drizzle-kit` leem essa variável).
3. Crie o schema com `pnpm db:push` — gera e aplica as migrations versionadas em `server/database/`.
4. Crie o primeiro administrador (comando na seção abaixo).

Para importar os dados de um banco MySQL legado deste projeto:

```bash
DATABASE_URL_MYSQL="mysql://usuario:senha@host:3306/banco" \
DATABASE_URL="postgresql://usuario:senha@host:port/dbname?sslmode=require" \
npx tsx scripts/migrate-mysql-to-postgres.ts
```

O script trunca as tabelas de destino antes de copiar (usuários, destinos, imagens, eventos, parcerias, feedbacks e métricas de uso) e reajusta as sequences. Revise os horários após a cópia: a conversão de fuso entre MySQL e PostgreSQL pode exigir ajuste em eventos com data marcada.

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | PostgreSQL (obrigatória) |
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

## Convenções

- Novos registros de validação e evidências vão em `docs/validation/` — a raiz fica apenas com configurações e o README.
- Commits seguem o padrão `tipo(escopo): resumo` ou `Checkpoint:` com descrição detalhada.
- Regra editorial: informação operacional só entra com fonte verificável e estado explícito (`docs/architecture/content-model.md`).
