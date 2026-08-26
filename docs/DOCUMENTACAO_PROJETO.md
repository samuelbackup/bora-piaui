# Bora Piauí — Documentação Consolidada do Projeto

| | |
|---|---|
| **Documento** | Documentação executiva e técnica consolidada |
| **Versão** | 1.0 |
| **Data** | 26 de agosto de 2026 |
| **Status do projeto** | Desenvolvimento concluído · PR #1 aberto aguardando merge · Go-live pendente de banco |
| **Repositório** | `samuelbackup/bora-piaui` · fork de trabalho `Gabsz17/bora-piaui` |
| **Licença** | MIT |

---

## 1. Visão Geral da Plataforma (Produto)

### 1.1 O que é

O **Bora Piauí** é um atlas editorial de percursos turísticos do estado do Piauí. Ele transforma pesquisa cultural verificável em jornada de descoberta: atrações, eventos, patrimônios, roteiros e negócios locais aparecem **sempre com fonte pública e condição operacional declarada**.

A regra editorial central do produto é: **"sem fonte, não publica"** — nenhuma distância, preço, horário ou disponibilidade é inventado pela interface. Onde falta confirmação, a UI comunica "em curadoria" ou "operação a confirmar" em vez de preencher lacunas com dados fictícios.

### 1.2 Proposta de valor

| Para | Valor entregue |
|---|---|
| **Viajantes** | Descoberta confiável do Piauí por polo turístico, cidade e proximidade — com referências públicas para confirmar a visita |
| **Curadores locais** | Painéis administrativos para preparar, revisar e publicar conteúdo editorial com rastreabilidade de fonte |
| **Parceiros comerciais** | Formulário público de proposta com revisão humana — nenhum negócio é exposto sem validação editorial |
| **Gestão do projeto** | Métricas de uso anonimizadas, documentação de pesquisa preservada e pipeline de migração seguro |

### 1.3 Público-alvo

1. **Turistas e viajantes** planejando visitas ao Piauí (litoral, Serra da Capivara, Teresina).
2. **Equipe editorial de curadoria** responsável por validar fontes e condições operacionais.
3. **Comércios e serviços locais** que desejam entrar na rede de parceiros.
4. **Pesquisadores/consolidadores** que utilizam os relatórios de pesquisa e validação preservados em `docs/`.

### 1.4 Mapa de funcionalidades e módulos

#### Jornada pública

| Rota | Página | Funcionalidade | Fonte de dados |
|---|---|---|---|
| `/` | **Home** | Atlas estadual: destinos por polo turístico, filtros, busca, mapa sincronizado, cards de cidades-piloto, dados oficiais (IBGE/Cadastur) e planejador de roteiro | `trpc.destinations.list`, `trpc.cities.list`, `trpc.itineraries.list` |
| `/cidades/:slug` | **Cidade-piloto** | Atrações com fonte, filtros por tipo/categoria, seção "Para comer" ancorada, serviços, destaques de Cultura e História, descoberta por proximidade e mapa | `trpc.cities.getBySlug`, `trpc.cityPlaces.listByCity`, `trpc.itineraries.getByCity` |
| `/cidades/:citySlug/locais/:itemSlug` | **Local piloto** | Ficha completa do lugar: imagem creditada, rota, contato, fonte editorial | `trpc.cityPlaces.getByCityAndSlug` |
| `/roteiros/:slug` | **Roteiro de 1 dia** | Paradas ordenadas com mapa, avisos de confirmação e fontes | `trpc.itineraries.getBySlug` |
| `/destinos/:slug` | **Destino do atlas** | Ficha de destino com galeria de imagens | `trpc.destinations` |
| `/patrimonios` | **Patrimônios** | Mapa histórico interativo de patrimônios | Catálogo local |
| `/sabores` | **Sabores** | Gastronomia piauiense (recorte editorial) | Catálogo local |
| `/dados` | **Dados oficiais** | Indicadores públicos (IBGE, Observatório do Turismo) | Estático |
| `/agenda` | **Agenda cultural** | Eventos confirmados e publicados pela curadoria | `trpc.agenda.list` |
| `/parceiros` | **Seja parceiro** | Formulário público de proposta (com rate limit no servidor) | `trpc.partners.submit` |
| `/login` | **Área de acesso** | Login OAuth, sessão atual, logout, CTA para painéis | `trpc.auth.me`, `/api/oauth/login` |
| `/404` | **Não encontrado** | Página amigável para rotas inválidas | — |

#### Jornada administrativa (protegida por `adminProcedure`)

| Rota | Página | Funcionalidade |
|---|---|---|
| `/admin/editorial` | **Painel editorial** | CRUD de eventos culturais, publicação/despublicação, revisão de propostas de parceiros (status + notas), exportação CSV |
| `/admin/destinos` | **Painel de destinos** | Gestão de destinos do atlas e galerias de imagens |

> **Nota**: as páginas `/patrimonios`, `/sabores` e `/dados` ainda consomem catálogos estáticos locais — são os únicos remanescentes, mapeados como próximo passo de migração (ver §4.4).

---

## 2. Visão Geral do Código e Arquitetura Tecnológica

### 2.1 Stack tecnológica

| Camada | Tecnologia | Versão | Papel |
|---|---|---|---|
| Frontend | React | 19.2.1 | UI declarativa |
| Frontend | Vite | 7.1.9 | Dev server + build |
| Frontend | TailwindCSS | 4.1.14 | Estilização |
| Frontend | Wouter | 3.7.1 | Roteamento SPA |
| Frontend | TanStack Query + tRPC client | 5.101.4 / 11.18.0 | Estado e chamadas tipadas |
| Backend | Node.js | ≥18 (engines) | Runtime |
| Backend | Express | 4.21.2 | HTTP + middleware |
| Backend | tRPC server | 11.18.0 | API tipada ponta a ponta |
| Dados | Drizzle ORM + mysql2 | 0.44.7 / 3.23.3 | Schema, migrations e queries |
| Dados | MySQL / TiDB | 8.x compatível | Banco relacional |
| Validação | Zod | 4.1.12 | Schemas compartilhados |
| Linguagem | TypeScript (strict) | 5.9.3 | Tipagem ponta a ponta |
| Auth | jose (JWT HS256) | 6.1.0 | Sessões assinadas |
| Testes | Vitest | 2.1.9 | 77 testes automatizados |
| E2E | Playwright | 1.62.0 | Validações de jornada |
| Formatação | Prettier | 3.6.2 | `pnpm lint` |
| CI | GitHub Actions | — | `lint → check → test` |

### 2.2 Estrutura de diretórios

```
bora-piaui/
├── client/                  # Frontend React (isolado do servidor)
│   └── src/
│       ├── pages/           # 14 páginas (públicas + admin)
│       ├── components/      # UI reutilizável (PiauiMap, MvpContentState…)
│       ├── lib/             # trpc, adaptadores e catálogos locais
│       ├── contexts/        # Tema claro/escuro
│       └── hooks/
├── server/                  # Backend Node/Express (isolado do client)
│   ├── _core/               # Infra: index (boot), trpc, context, env,
│   │                        # oauth, sdk, rateLimit, url, cookies, vite
│   ├── routers/             # agendaPartners, destinations, metrics,
│   │                        # pilotContent (cities/cityPlaces/itineraries)
│   ├── db.ts                # Acesso a dados (queries por domínio)
│   ├── db/                  # seed.ts (idempotente) · ping.ts (diagnóstico)
│   └── drizzle/             # schema.ts + migrations 0000–0004 + snapshots
├── shared/                  # Contratos comuns (importados pelos dois lados)
│   ├── const.ts             # Cookies, TTL, mensagens, OAuthState
│   ├── pilotContent.ts      # Schemas Zod das linhas de inserção
│   └── types.ts             # Barrel de tipos (reexporta schema Drizzle)
├── docs/                    # architecture/ · research/ · validation/ · plans/
├── scripts/                 # Validações E2E Playwright
└── docker-compose.yml       # MySQL 8 local (pnpm db:up)
```

**Regras de isolamento**: `client` nunca importa `server`; contratos traficam exclusivamente por tRPC; validação Zod vive em `shared/`; o backend é o único dono de `drizzle/`.

### 2.3 Domínio de dados

**14 tabelas** gerenciadas pelo Drizzle, em 5 migrations versionadas:

| Migration | Conteúdo |
|---|---|
| `0000_futuristic_lizard` | Bootstrap: `users`, `destinations`, `destination_images`, `cultural_events`, `partner_submissions`, `usage_events` |
| `0001_odd_mad_thinker` / `0002_cultured_shard` | Evoluções incrementais |
| `0003_add_sessions_invalidated_at` | Revogação de sessão (upstream) |
| `0004_pilot-cities-domain` | Domínio das cidades-piloto: `cities`, `city_places`, `curated_businesses`, `itineraries`, `itinerary_stops`, `place_proximity_relations`, `curation_topics`, `editorial_highlights` |

Características do domínio piloto: FKs `ON DELETE CASCADE`, chaves de idempotência por `slug`/`externalId`, enums para `kind`/`operationalStatus`/`editorialStatus`, fontes editoriais embutidas (`sourceName/Url/VerifiedAt/Responsible`) e imagens em coluna JSON.

### 2.4 Segurança, autenticação e validação

| Mecanismo | Implementação |
|---|---|
| **Fail-fast de ambiente** | `validateEnv()` roda na primeira linha do boot: `JWT_SECRET` é obrigatório em todos os ambientes e exige ≥32 caracteres em produção — o servidor **não abre portas** sem configuração válida |
| **Autorização** | CRUD editorial exclusivamente em `adminProcedure` (papel verificado no servidor a cada chamada); chamadas anônimas recebem `FORBIDDEN` |
| **Sanitização de URLs** | `externalUrl()`: apenas `https:` em produção (http liberado só fora de produção); `javascript:`/`data:` bloqueados sempre |
| **Rate limit** | Escritas públicas protegidas (ex.: `partners.submit`: 5 envios / 10 min por origem) |
| **Autenticação** | OAuth com fluxo completo: `GET /api/oauth/login` inicia o fluxo (nonce CSRF em cookie `__Host-`, `state` assinado), callback troca código por token, cria sessão JWT HS256 (7 dias) e honra redirect pós-login validado |
| **Sessões revogáveis** | Coluna `sessions_invalidated_at` permite invalidação em massa |
| **Health check honesto** | `/healthz` executa `SELECT 1` real e reporta `database: up/down/unconfigured` |
| **Blindagem de repositório** | `.gitignore` bloqueia `.env*` (exceto `.env.example`), logs, builds e cobertura; CI executa `lint → check → test` em cada PR |

---

## 3. Relatório de Alterações Recentes (Changelog de Engenharia)

> Branch de trabalho: `feat/security-hardening-and-dynamic-content` · Pull Request: **#1** (`samuelbackup/bora-piaui`)

### 3.1 Blindagem de Segurança (P0) — commit `1c3afb4`

- Remoção das rotas públicas `demo*` de agenda/parceiros (`demoList`, `demoCreate`, `demoUpdate`, `demoDelete`, `demoUpdateEditorialStatus`) — o CRUD editorial passou a existir **somente** em `adminProcedure`.
- `validateEnv()` com fail-fast no boot para `JWT_SECRET` (ausente/vazio aborta; produção exige ≥32 caracteres).
- Helper `externalUrl()` restringindo os schemas Zod de URL ao esquema `https:` em produção.
- Painel `AdminEditorial` migrado aos contratos administrativos; testes de `FORBIDDEN` para chamadas anônimas.

### 3.2 Banco de Dados e Seed (P1/P2) — commit `028b630`

- Criação do domínio relacional das cidades-piloto (8 tabelas) com FKs cascade e chaves de idempotência.
- Schemas Zod de inserção em `shared/pilotContent.ts` — **parse-before-write**: nenhuma linha entra no banco sem validação.
- `server/db/seed.ts`: seed idempotente do catálogo canônico (`pnpm db:seed`), com `assertCatalogIntegrity()` para referências quebradas.

### 3.3 API tRPC de leitura (P3) — commit `c4e72db`

- `cities.list` / `cities.getBySlug` · `cityPlaces.listByCity` (payload agregado) / `cityPlaces.getByCityAndSlug` · `itineraries.list/getByCity/getBySlug`.
- Erros `NOT_FOUND` semânticos e validação de entrada por Zod em todas as rotas.

### 3.4 Refatoração Dinâmica (P4/P5) — commits `11a4423`, `3433c54`

- **Transição completa do protótipo estático para API**: `Home`, `CityPage`, `ItineraryPage` e `PilotPlacePage` consomem exclusivamente tRPC através do adaptador `pilotContentAdapter`.
- Correção de links internos quebrados (`/destinos/…` em contexto piloto) via campo `detailHref` contextual no mapa.
- Estados amigáveis de carregamento, erro com retry e 404 por slug em todas as páginas dinâmicas.
- Remoção de código morto: `ComponentShowcase.tsx` e `AIChatBox.tsx` (−1.8 mil linhas).
- Organização da raiz: 44 documentos movidos para `docs/` e `README.md` de apresentação criado.

### 3.5 Limpeza e Qualidade — commits `768cdb4`/`bad023b`/`b6d57ab`

- `drizzle/` movido para `server/drizzle/` (backend como dono do domínio de dados) com 6 pontos de importação atualizados.
- `.gitignore` endurecido; `engines.node >=18`; scripts `lint`, `verify`, `db:migrate`, `db:up/down/ping`.
- Formatação Prettier aplicada aos fontes (78 arquivos, apenas estilo).

### 3.6 Integração com Upstream — commit `0025c2d`

- O repositório principal recebeu 3 commits paralelos do mantenedor (`rate limit`, `sessão revogável`, `proteção de rotas editoriais`).
- Reconciliação sem perdas: mecanismos do mantenedor **preservados**; camadas mais restritivas do fork **mantidas** (`externalUrl` substituiu o `safeUrl` http-permissivo; `validateEnv` fail-fast permaneceu).
- **Colisão de migration resolvida**: domínio piloto renumerado `0003 → 0004` (journal + snapshot reconciliados).
- Adotada a extração `client/src/lib/mvpPlaces.ts` da upstream.

### 3.7 Autenticação integrada e maturidade operacional — commit `bd802fa`

- Rota `GET /api/oauth/login` (início de fluxo com nonce CSRF `__Host-` e redirect pós-login validado) + página `/login` (sessão atual, logout, estado de provedor não configurado).
- `/healthz` com ping real de banco (`up/down/unconfigured`).
- `docker-compose.yml` do MySQL 8 (`pnpm db:up`) · `db:ping` diagnóstico · workflow de CI · README de apresentação com badges e diagrama Mermaid.

### 3.8 Qualidade final

| Métrica | Valor |
|---|---|
| Testes automatizados | **77/77 aprovados** (19 suítes) |
| Tipagem | `tsc --noEmit` sem erros (strict) |
| Formatação | Prettier: 100% dos fontes conformes |
| CI | `lint → check → test` em push/PR |

---

## 4. Status Atual e Guia de Implantação (Go-Live)

### 4.1 Status atual

| Item | Estado |
|---|---|
| Código | ✅ Completo, tipado e testado (77/77) |
| Pull Request | ✅ PR #1 aberto, sem conflitos, aguardando review/merge do mantenedor |
| Banco de dados | ⚠️ `DATABASE_URL` configurada no `.env`, porém **nenhum servidor MySQL ativo** (`ECONNREFUSED :3306`) — diagnóstico via `pnpm db:ping` |
| Autenticação | ⚠️ Requer `OAUTH_SERVER_URL` + `VITE_APP_ID` do provedor para o fluxo completo |

**Caminhos para ativar o banco** (escolha um):

1. **Docker local** — instalar Docker Desktop e executar `pnpm db:up` (sobe MySQL 8 em `localhost:3306`, root/root, banco `bora_piaui` — a URL do `.env.example` já casa).
2. **MySQL nativo** — instalar o MySQL Server localmente, criar o banco `bora_piaui` e ajustar usuário/senha na `DATABASE_URL`.
3. **Nuvem gratuita** — Railway, Aiven ou PlanetScale; substituir a `DATABASE_URL` pela URL fornecida (com TLS, se exigido pelo provedor).

### 4.2 Checklist de variáveis de ambiente (`.env.example`)

| Variável | Obrigatória | Regra de validação |
|---|---|---|
| `NODE_ENV` | Sim | `development` \| `production` — produção ativa https-only nas URLs e exigência de segredo forte |
| `PORT` | Não (default 3000) | Porta preferida; as 20 seguintes são testadas se ocupada |
| `DATABASE_URL` | Sim | Formato `mysql://usuario:senha@host:3306/bora_piaui` |
| `JWT_SECRET` | **Sempre** | Não pode ser vazio em nenhum ambiente; **≥32 caracteres em produção** (gerar com `openssl rand -base64 48`) |
| `OAUTH_SERVER_URL` | Para login | URL base do provedor OAuth |
| `VITE_APP_ID` | Para login | ID da aplicação registrado no provedor |
| `OWNER_OPEN_ID` | Para admin | `openId` que recebe papel `admin` automaticamente no primeiro login |
| `BUILT_IN_FORGE_API_URL/KEY` | Não | Integrações opcionais (LLM/imagem) |
| `BORA_PIAUI_URL` | Não (scripts) | URL base para os Playwrights E2E |

### 4.3 Roteiro de implantação

```bash
# 0. Pós-merge do PR #1: sincronizar
git checkout main && git pull upstream main

# 1. Banco ativo (uma das 3 opções do §4.1) — validar conexão
pnpm db:ping

# 2. Estrutura relacional (migrations 0000 → 0004)
pnpm db:push

# 3. Carga inicial idempotente (3 cidades, 11 locais, 3 roteiros…)
pnpm db:seed

# 4. Variáveis de produção
#    NODE_ENV=production · JWT_SECRET (≥32) · OWNER_OPEN_ID · OAuth

# 5. Subir a aplicação
pnpm build && pnpm start        # ou deploy Vercel conforme vercel.json

# 6. Smoke de produção
curl https://SEU_DOMINIO/healthz          # {"ok":true,"database":"up",...}
#    → /cidades/teresina carrega atrações
#    → /login → OAuth → painel /admin/editorial com papel admin
#    → node scripts/validate-editorial-agenda.mjs (sessão admin)
```

### 4.4 Pendências conhecidas (roadmap)

- [ ] Migração dos catálogos estáticos restantes (`mvpPlaces`, páginas Patrimônios/Sabores/Dados) para o banco.
- [ ] Rate limit por origem nas demais escritas públicas.
- [ ] DTOs públicos/administrativos distintos para parceiros (PII).
- [ ] Paginação nas listagens administrativas.
- [ ] Harness de autenticação para os Playwrights administrativos.

---

*Documento gerado a partir do estado real do repositório (branch `feat/security-hardening-and-dynamic-content`, commit `bd802fa` + documentação). Para exportar em PDF, utilize o arquivo companion `DOCUMENTACAO_PROJETO.html` (abrir no navegador → Ctrl+P → Salvar como PDF).*
