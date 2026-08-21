# Documento de integração — front-end e back-end do Bora Piauí

**Objetivo:** migrar o front-end existente de dados locais para serviços persistidos, sem alterar os fluxos já testados e sem introduzir informação turística não verificada.

## 1. Contrato de integração adotado

O contrato primário será tRPC, acessado pelo cliente já configurado em `client/src/lib/trpc.ts`. Essa escolha preserva tipagem ponta a ponta e detecta incompatibilidades entre entrada, saída e consumo durante o build.[1] A API continuará exposta em uma única origem configurável; a URL não ficará fixada no código da interface.

| Ambiente | `VITE_API_BASE_URL` | Regra CORS da API |
|---|---|---|
| Desenvolvimento | `http://localhost:<porta>` | `http://localhost:3000` |
| Staging | URL do serviço Railway de staging | Preview Vercel da branch `staging` |
| Produção | `https://api.borapiaui.<domínio>` | Domínio Vercel de produção e domínio próprio |

O adaptador tRPC deve montar `VITE_API_BASE_URL + /api/trpc`; quando a variável não estiver definida em desenvolvimento, usa a origem local. O front-end nunca acessa banco, S3 ou tokens de administração diretamente.

## 2. Superfícies do front-end e destino no back-end

| Tela ou componente atual | Fonte atual | Contrato alvo | Estratégia de troca |
|---|---|---|---|
| `CityPage` | `loadPilotCatalog()` | `trpc.cities.bySlug.useQuery({ slug })` | Trocar o carregador local por query e manter os componentes visuais |
| `PilotPlacePage` | `getPilotItem()` | `trpc.cityPlaces.bySlug.useQuery({ citySlug, slug })` | Usar estados `loading`, `not found` e `error` explícitos |
| Roteiros | `getPilotItinerary()` | `trpc.itineraries.byCity.useQuery({ citySlug })` | Renderizar aviso de confirmação vindo do servidor |
| Próximos locais | `getPilotNearbyItems()` | Campo `nearby` de `cities.bySlug` ou query própria | Não calcular relação por distância no cliente |
| Cultura e História | `getPilotEditorialHighlights()` | `trpc.cityEditorial.highlights.useQuery({ citySlug })` | Mostrar fonte e link devolvidos pela API |
| Tópicos básicos | `getPilotCurationTopics()` | `trpc.cityEditorial.topics.useQuery({ citySlug })` | Preservar o estado “em curadoria” |
| Agenda | `trpc.agenda.list` | Manter contrato | Migrar somente os endpoints administrativos `demo*` |
| Parcerias | `trpc.partners.submit` | Manter contrato | Adicionar rate limit e retorno de protocolo seguro |
| Admin de destinos | Estado demonstrativo | `destinations.admin*` | Conectar mutations existentes, com invalidação de cache |

## 3. DTOs de leitura pública

O backend deve devolver dados já filtrados por publicação. Uma resposta pública não deve incluir rascunhos, notas internas, telefone de parceiro não publicado ou registros de auditoria.

```ts
type SourceReferenceDto = {
  name: string;
  url: string;
  verifiedAt: string;
  responsible?: string | null;
};

type CityPlaceDto = {
  slug: string;
  kind: "attraction" | "business";
  title: string;
  category: string;
  summary: string;
  image?: { url: string; alt: string; credit?: string | null } | null;
  mapQuery: string;
  routeUrl?: string | null;
  contactUrl?: string | null;
  externalUrl?: string | null;
  operationalStatus: "confirmed" | "verify" | "unavailable";
  source: SourceReferenceDto;
};

type CityDetailDto = {
  slug: string;
  name: string;
  eyebrow: string;
  summary: string;
  accent: string;
  source: SourceReferenceDto;
  attractions: CityPlaceDto[];
  curationTopics: Array<{ title: string; description: string; category: "gastronomy" | "service"; status: "curating" }>;
  editorialHighlights: Array<{ title: "Cultura" | "História"; description: string; source: SourceReferenceDto }>;
  itinerary: { slug: string; title: string; durationLabel: string; summary: string; confirmationNotice: string; stops: CityPlaceDto[] } | null;
  nearby: Array<{ anchorSlug: string; place: CityPlaceDto; category: string; editorialReason: string; source: SourceReferenceDto }>;
};
```

| Procedure | Entrada | Saída | Acesso |
|---|---|---|---|
| `cities.list` | — | Resumo de cidades publicadas | Público |
| `cities.bySlug` | `{ slug }` | `CityDetailDto` | Público |
| `cityPlaces.bySlug` | `{ citySlug, slug }` | `CityPlaceDto` | Público |
| `itineraries.byCity` | `{ citySlug }` | Roteiros publicados | Público |
| `agenda.list` | — | Eventos confirmados e publicados | Público |
| `partners.submit` | Proposta validada | `{ id, receivedAt }` | Público, limitado por taxa |
| `*.admin*` | DTO de criação/edição | Registro persistido | Admin |

## 4. Escrita administrativa e publicação

O painel deve substituir procedimentos `demo*` por procedimentos `admin*`; um botão visível não é autorização. A API precisa exigir papel administrativo em cada mutation, conforme o princípio de validar permissões em todas as requisições.[2]

| Ação no painel | Mutation | Validações obrigatórias | Efeito posterior |
|---|---|---|---|
| Criar/editar destino ou local | `*.adminCreate`, `*.adminUpdate` | Slug único, textos mínimos, fonte válida | Invalidar listas e detalhe afetados |
| Publicar/despublicar | `*.setPublication` | Fonte preenchida; conteúdo completo; papel admin | Criar auditoria; invalidar cache público |
| Cadastrar fonte | `sources.create` | URL HTTPS/HTTP válida, nome e data de verificação | Reutilizável por outros conteúdos |
| Subir imagem | `*.uploadImage` | PNG/JPEG/WebP, até 8 MB, `altText` obrigatório | Enviar ao S3 e persistir somente URL/metadados |
| Revisar parceiro | `partners.updateEditorialStatus` | Status permitido e nota opcional | Nunca publicar automaticamente |
| Excluir programação | `agenda.delete` | Confirmação no cliente e papel admin | Criar auditoria e invalidar agenda |

## 5. Migração de dados e rollout

O seed inicial deve importar as três cidades e todo conteúdo que hoje vive em `mvpPilot.ts`. Essa operação é uma **migração de conteúdo**, não um scraper: cada item conserva a fonte, a URL e o estado editorial originais. Nenhum registro novo deve ser inventado para preencher lacunas.

| Etapa | Alteração | Verificação | Rollback |
|---|---|---|---|
| 1 | Criar schema e migrations | Migration aplicada em staging; IDs e slugs únicos | Reverter migration somente antes de escrita editorial real |
| 2 | Executar seed idempotente | Contagens e slugs iguais ao catálogo local | Reexecutar seed sem duplicar |
| 3 | Adicionar routers de leitura | Testes de contrato e Zod | Feature flag mantém catálogo local |
| 4 | Migrar uma cidade por vez | Screenshot e jornada Playwright por cidade | Voltar flag da cidade à fonte local |
| 5 | Conectar painel admin | Testes de autorização e auditoria | Desativar mutation sem apagar conteúdo |
| 6 | Remover catálogo local | Só após cobertura completa e backup | Restaurar release anterior |

As migrations devem ser geradas e revisadas em SQL antes da aplicação. Drizzle oferece suporte explícito ao schema TypeScript versionado e às migrations SQL geradas.[3]

## 6. Tratamento de estados e erros

| Situação | Tratamento no front-end | Resposta esperada |
|---|---|---|
| Carregamento | Skeleton localizado; manter cabeçalho e navegação | Query pendente |
| Cidade/local inexistente | Página de não encontrado com volta às cidades | `NOT_FOUND` |
| Fonte indisponível | Exibir conteúdo já publicado; não ocultar a atribuição | Sem fetch externo no carregamento público |
| Sem autenticação | Direcionar ao login somente em ação administrativa | `UNAUTHORIZED` |
| Sem permissão | Toast sem detalhar regra interna | `FORBIDDEN` |
| Falha de validação | Exibir mensagem do campo e preservar formulário | `BAD_REQUEST` |
| Falha de rede | Ação de tentar novamente sem perder filtros | Erro tRPC normalizado |

## 7. Variáveis e operação

| Variável | Onde fica | Finalidade |
|---|---|---|
| `VITE_API_BASE_URL` | Vercel | Origem pública da API tRPC |
| `DATABASE_URL` | Railway | Conexão MySQL/TiDB; nunca exposta ao Vite |
| `CORS_ALLOWED_ORIGINS` | Railway | Produção e previews Vercel autorizados |
| `OIDC_ISSUER`, `OIDC_AUDIENCE`, `OIDC_CLIENT_ID` | Railway | Validação da identidade da sessão |
| `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Railway | Armazenamento de imagens e mídia |
| `LOG_LEVEL` | Railway | Observabilidade sem expor dados sensíveis |

O serviço Railway deve expor `GET /healthz`, aplicar migrations antes do start e registrar o identificador da requisição. Deploys por GitHub, health checks e comandos de pré-deploy são recursos documentados pela plataforma.[4]

## 8. Critérios de aceite da integração

| Área | Critério mensurável |
|---|---|
| Leitura | As três cidades-piloto renderizam pela API com os mesmos slugs, fontes e blocos do catálogo atual |
| Editorial | 100% dos destaques Cultura/História e relações de proximidade publicados possuem fonte e URL |
| Segurança | Toda mutation administrativa retorna `FORBIDDEN` para usuário não administrador em testes |
| Dados | Seeds são idempotentes e não criam duplicatas de slug |
| Operação | Staging tem banco separado, migration aplicada e `/healthz` respondendo antes do deploy |
| Front-end | Filtros, mapa, menu, dark mode e estados de erro mantêm funcionamento nas páginas migradas |

## Referências

[1]: https://trpc.io/docs "tRPC — documentação oficial"
[2]: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html "OWASP — Authorization Cheat Sheet"
[3]: https://orm.drizzle.team/docs/migrations "Drizzle ORM — migrations"
[4]: https://docs.railway.com/guides/deployments "Railway — Deployments"
