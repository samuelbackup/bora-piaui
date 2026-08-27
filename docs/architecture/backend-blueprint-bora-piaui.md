# Blueprint de back-end — Bora Piauí

**Autor:** Manus AI  
**Status:** Proposta técnica para integração gradual  
**Escopo:** API, dados, segurança e implantação que suportam o front-end existente sem reescrever a experiência pública.

## 1. Decisão arquitetural

O Bora Piauí deve evoluir para uma arquitetura **SPA React na Vercel + API Node/Express com tRPC no Railway + banco MySQL/TiDB compatível + armazenamento S3**. A aplicação já usa TypeScript, tRPC, Drizzle e MySQL/TiDB; portanto, a recomendação é **preservar a pilha atual** e separar o serviço de API do front-end estático. O tRPC mantém o contrato tipado entre React e servidor e permite migrar módulos aos poucos, em vez de reescrever todas as rotas de uma vez.[1]

> **Princípio do produto:** nenhum dado operacional, estabelecimento, horário, preço ou contato deve ser publicado sem fonte rastreável, status editorial e data de verificação quando aplicável.

| Camada | Serviço recomendado | Responsabilidade | Não deve fazer |
|---|---|---|---|
| Interface | React + Vite, hospedado na Vercel | Navegação, filtros locais, estados de carregamento e consumo tRPC | Decidir publicação ou guardar segredos |
| API | Node.js + Express + tRPC, hospedado no Railway | Regras de negócio, autorização, validação e contratos | Servir imagens como arquivos locais |
| Dados | MySQL/TiDB compatível | Conteúdo editorial, agenda, parcerias, auditoria e publicação | Armazenar bytes de imagens |
| Mídia | S3 compatível | Imagens, créditos e URLs públicas/presignadas | Ser fonte de verdade de permissões |
| Identidade | Provedor OIDC compatível | Sessão e identidade verificável | Conceder papel administrativo por parâmetro do cliente |

O Railway é adequado para a API porque suporta deploys a partir do GitHub, comandos de pré-deploy para migrações, health checks e políticas de reinício.[4] O banco atual pode continuar MySQL/TiDB; uma migração para PostgreSQL não é necessária para esta etapa e só aumentaria o risco de integração.

## 2. Situação atual e fronteira de migração

O projeto já persiste **destinos, imagens, eventos culturais e propostas de parceiros**. Os routers `destinations`, `agenda` e `partners` já usam Zod, tRPC e Drizzle. Em contrapartida, a jornada de cidades-piloto — cidades, locais, proximidade, roteiros, tópicos de curadoria e destaques de Cultura/História — ainda é carregada do catálogo local `client/src/lib/mvpPilot.ts`.

| Módulo | Estado atual | Decisão no blueprint |
|---|---|---|
| Atlas de destinos | Persistido parcialmente | Manter o router atual e completar o painel administrativo real |
| Agenda Cultural | Persistida | Remover endpoints `demo*` da exposição pública e usar somente rotas administrativas autenticadas |
| Propostas de parceiros | Persistidas | Manter envio público; restringir revisão, exportação e status a administradores |
| Cidades-piloto | Catálogo local assíncrono | Criar domínio novo e migrar por leitura paralela, sem alterar o layout |
| Roteiros e proximidade | Catálogo local | Persistir relações editoriais e paradas ordenadas |
| Cultura e História | Catálogo local com fontes | Persistir como blocos editoriais atribuídos a fontes institucionais |

## 3. Domínio de dados proposto

O schema TypeScript deve permanecer como fonte de verdade, com migrations SQL versionadas. O Drizzle suporta esse fluxo *codebase-first* com geração de SQL e aplicação controlada das migrations.[2]

### 3.1 Entidades novas

| Tabela | Campos principais | Relações | Regra editorial |
|---|---|---|---|
| `cities` | `id`, `slug`, `name`, `eyebrow`, `summary`, `accent`, `status`, `publishedAt` | 1:N com locais, tópicos, roteiros e destaques | Cidade só aparece quando `status=published` |
| `editorial_sources` | `id`, `name`, `url`, `verifiedAt`, `responsible`, `sourceType` | 1:N com conteúdos | Fonte e URL obrigatórias; data de verificação obrigatória |
| `city_places` | `id`, `cityId`, `slug`, `kind`, `title`, `category`, `summary`, `mapQuery`, `routeUrl`, `contactUrl`, `externalUrl`, `operationalStatus`, `status` | N:1 cidade; N:1 fonte | Contato e rota são nulos até confirmação; `published` é independente de rascunho |
| `city_place_media` | `id`, `placeId`, `imageUrl`, `altText`, `credit`, `sortOrder` | N:1 local | Imagem precisa de texto alternativo e crédito quando houver |
| `city_editorial_highlights` | `id`, `cityId`, `theme`, `title`, `description`, `sourceId`, `status` | N:1 cidade/fonte | `theme` inicialmente: `culture` ou `history` |
| `city_curation_topics` | `id`, `cityId`, `category`, `title`, `description`, `status` | N:1 cidade | Inicialmente só estado `curating`; não listar negócios sem verificação |
| `curated_listings` | `id`, `cityId`, `kind`, `title`, `category`, `summary`, `routeUrl`, `contactUrl`, `sourceId`, `status` | N:1 cidade/fonte | Uso P1; publicação requer fonte e revisão |
| `itineraries` | `id`, `cityId`, `slug`, `dayScope`, `title`, `durationLabel`, `summary`, `confirmationNotice`, `status` | N:1 cidade | Aviso de confirmação obrigatório |
| `itinerary_stops` | `itineraryId`, `placeId`, `sortOrder` | N:N roteiro/local | Ordem única por roteiro |
| `place_proximity_relations` | `id`, `anchorPlaceId`, `relatedPlaceId`, `category`, `editorialReason`, `sourceId`, `status` | Auto-relação de local | Relação sem fonte não pode ser publicada |
| `editorial_audit_logs` | `id`, `actorId`, `entityType`, `entityId`, `action`, `before`, `after`, `createdAt` | N:1 usuário | Registrar publicar, despublicar, editar e excluir |

Os campos de estado devem ser enumerações explícitas: `draft`, `in_review`, `published`, `archived` para conteúdo editorial; `confirmed`, `verify`, `unavailable` para condição operacional. Isso impede que a interface deduza segurança editorial apenas pela existência de um registro.

### 3.2 Dados existentes a preservar

As tabelas `destinations`, `destination_images`, `cultural_events`, `partner_submissions` e `users` permanecem válidas. A primeira migration do novo domínio **não deve** duplicar destinos gerais em `city_places`; ela deve registrar somente a fatia das três cidades-piloto. Uma convergência posterior pode criar uma entidade canônica `places`, mas não é necessária para o MVP.

## 4. Módulos de API

| Router tRPC | Acesso | Operações P0 | Observação |
|---|---|---|---|
| `cities` | Público/admin | `list`, `bySlug`, `adminList`, `create`, `update`, `setPublication` | Resposta pública só inclui conteúdo publicado |
| `cityPlaces` | Público/admin | `list`, `bySlug`, `adminCreate`, `adminUpdate`, `setPublication`, `uploadImage` | Reutiliza padrão de imagens de `destinations` |
| `cityEditorial` | Público/admin | `highlights`, `topics`, `proximity`, `adminUpsert*` | Fonte obrigatória para highlights e proximidade |
| `itineraries` | Público/admin | `byCity`, `bySlug`, `adminUpsert`, `setStops` | Paradas precisam pertencer à mesma cidade |
| `sources` | Admin | `list`, `create`, `update`, `markVerified` | Evita URLs e nomes replicados sem governança |
| `agenda` | Público/admin | Manter `list`; manter CRUD só em `admin*` | Eliminar acesso de produção a `demoCreate`, `demoUpdate`, `demoDelete` |
| `partners` | Público/admin | Manter `submit`; revisão e exportação em `admin*` | Aplicar limitação de taxa no envio público |
| `health` | Público restrito | `live`, `ready` | Usado pelo Railway e monitoramento |

## 5. Segurança e governança editorial

O servidor deve aplicar autorização, e não confiar em controles escondidos na interface. A OWASP recomenda privilégio mínimo, negação por padrão e verificação de permissões em cada solicitação.[3] O padrão já existente de `publicProcedure`, `protectedProcedure` e `adminProcedure` deve ser mantido, com as regras abaixo.

| Perfil | Pode | Não pode |
|---|---|---|
| Visitante | Ler conteúdo publicado, consultar agenda publicada, enviar proposta | Ler rascunhos, aprovar conteúdo, exportar contatos |
| Editor/admin | Criar, revisar, publicar, despublicar e registrar fontes | Atribuir a si mesmo papel administrativo por API |
| Serviço de migração | Inserir seeds e executar migrations | Atender tráfego público |

Além de Zod em todas as entradas, a API precisa de limite de taxa no formulário de parceiros, allowlist CORS para o domínio Vercel de produção e previews, validação de MIME/tamanho de imagem, logs sem dados sensíveis e um identificador de requisição por chamada. Segredos ficam apenas no Railway; nenhum `DATABASE_URL`, token de armazenamento ou segredo OIDC entra no bundle Vite.

## 6. Implantação recomendada

| Ambiente | Front-end | API | Banco | Gatilho |
|---|---|---|---|---|
| Desenvolvimento | Vite local | Express local | Banco de desenvolvimento | Manual |
| Staging | Vercel preview da branch `staging` | Serviço Railway `bora-piaui-api-staging` | Banco/schema de staging | Push em `staging` |
| Produção | Vercel `main` | Serviço Railway `bora-piaui-api` | Banco/schema de produção | Merge em `main` |

O Railway deve executar `pnpm db:migrate` como comando de pré-deploy, iniciar a API com `pnpm start` e expor `/healthz`. A implantação deve falhar se a migration falhar ou se o health check não responder. Backups, retenção e acesso do banco devem ser configurados no provedor escolhido antes de abrir escrita administrativa em produção.

## 7. Sequência de entrega

| Fase | Entrega | Critério de saída |
|---|---|---|
| P0.1 | Criar schema/migrations das cidades-piloto e seed inicial | Dados das três cidades reproduzem o catálogo local sem perda editorial |
| P0.2 | Criar routers públicos de leitura e testes | `cities.bySlug` renderiza os mesmos campos da página atual |
| P0.3 | Integrar `CityPage`, `PilotPlacePage` e roteiros por feature flag | Comparação visual aprovada e fallback local disponível |
| P0.4 | Substituir ações demonstrativas do painel por mutations administrativas | Publicar/despublicar e remoção registram auditoria |
| P1 | Implementar gestão de fontes, mídia e curadoria | Nenhum listing público sem fonte, status e responsável |
| P2 | Remover catálogo local e rotas `demo*` | Cobertura de integração e plano de rollback aprovados |

## Referências

[1]: https://trpc.io/docs "tRPC — documentação oficial"
[2]: https://orm.drizzle.team/docs/migrations "Drizzle ORM — migrations"
[3]: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html "OWASP — Authorization Cheat Sheet"
[4]: https://docs.railway.com/guides/deployments "Railway — Deployments"
