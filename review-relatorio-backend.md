# Revisão do Relatório de Análise — requisitos de back-end

**Fonte analisada:** `Relatorio-Analise-Bora-Piaui.pdf`, enviado pelo usuário em 25 de agosto de 2026.  
**Método do relatório:** análise estática de aproximadamente 140 arquivos; o próprio documento informa que não executou Node.js, TypeScript ou Vite. Portanto, seus achados precisam de verificação no código e nos testes atuais antes de serem tratados como defeitos confirmados.

## Achados extraídos do relatório

| ID | Achado no relatório | Página | Relevância para back-end/migração |
|---|---|---|
| C1 | CRUD demonstrativo de eventos está exposto com `publicProcedure` | 1 | Bloqueador de produção; eliminar ou proteger rotas legadas antes de migrar escrita administrativa |
| C2 | `demoList` de parceiros expõe contatos e status editorial sem autenticação | 1 | Bloqueador de privacidade; o novo banco não deve ampliar essa exposição |
| C3 | Moderação de parceiros pode ser executada por visitante anônimo | 1 | Bloqueador de integridade editorial; exigir autorização no servidor |
| A3 | Segredo de sessão vazio não falha a inicialização | 1 | Pré-requisito de deploy; exigir configuração fail-fast |
| A4 | Escritas públicas de parceiros e métricas sem rate limiting | 1 | Requisito de proteção contra abuso e custos de banco |
| A5 | Sessões JWT longas, sem revogação no servidor | 1 | Requisito para estratégia de autenticação e transição OIDC |
| A6 | URLs aceitas por schema podem admitir esquemas inseguros | 1 | Requisito de allowlist HTTP/HTTPS antes da renderização de links |
| M1 | Listagens e consultas de imagem sem paginação/índice adequado | 2 | Requisito de escala e desempenho do novo banco |
| M2 | CSV pode permitir formula injection | 2 | Requisito de exportação segura para painel administrativo |
| M3 | Parser de corpo global muito permissivo | 2 | Requisito de limites de requisição por rota |
| M4 | Falhas de mapa e corridas assíncronas sem estados robustos | 2 | Dependência de contrato de erro da API; não é bloqueador da migração de dados |
| P1 | Links de detalhe incompatíveis entre catálogos e rotas | 1–2 | Requisito de chaves canônicas e migração de slugs |
| P2 | Pesquisa “Para comer” fixa Teresina em cidades diferentes | 1 | Requisito de o novo domínio sempre transportar `citySlug`/consulta por cidade |

## Verificação direta já realizada no código atual

| Achado | Estado | Evidência |
|---|---|---|
| C1/C2/C3 | **Confirmado** | `server/routers/agendaPartners.ts` mantém `demoCreate`, `demoUpdate`, `demoDelete`, `demoList` e `demoUpdateEditorialStatus` com `publicProcedure`; o cliente `AdminEditorial.tsx` chama os procedimentos `demo*`. |
| A3 | **Confirmado como risco de configuração** | `server/_core/env.ts` usa `process.env.JWT_SECRET ?? ""` sem validação de presença. A explorabilidade depende do comportamento subsequente do SDK, que deve ser testado ao implementar o fail-fast. |
| A4 | **Confirmado como lacuna** | `metrics.track` e `partners.submit` são procedures públicas; não há limitação de taxa no router. |
| A5 | **Confirmado** | `server/_core/oauth.ts` cria sessão por um ano; não há lista de revogação/versão de sessão no fluxo lido. |
| A6 | **A confirmar com teste** | Schemas usam `z.string().url()`. Deve-se criar teste para rejeitar esquemas fora de `https:` e, quando necessário, `http:` em ambientes locais. |
| P1 | **Confirmado** | `PiauiMap.tsx`, `Home.tsx` e `ItineraryPage.tsx` usam `/destinos/{id ou slug}` enquanto parte da jornada das cidades usa rotas próprias. |
| P2 | **Confirmado** | `CityPage.tsx` monta a pesquisa externa de alimentação com `Teresina, PI` fixo. |

## Decisões para incorporar ao roteiro de migração

1. Criar um **gate de segurança pré-migração**: desativar/remover procedures `demo*` públicas ou torná-las `adminProcedure`; separar a listagem pública sem PII da administrativa paginada.
2. Exigir no novo runtime: segredo de sessão não vazio, allowlist de URLs, CORS de origem explícita, limite de corpo por rota e rate limit para `partners.submit` e `metrics.track`.
3. Modelar identidade com `sessionVersion` ou store de sessão revogável e manter a vinculação OIDC dupla; não copiar cookies/tokens Manus.
4. Adicionar paginação, índices de FK/slug/status e limites de consulta nos novos routers; validar unicidade de slug com erro de domínio amigável.
5. Fazer o importador canônico de lugares usar `citySlug` e URLs de rota próprias; remover qualquer valor de cidade hardcoded no front-end durante a integração.
6. Proteger exportação CSV de fórmulas com escape de valores que iniciem em `=`, `+`, `-` ou `@` e limitar a operação a administradores.

## Itens que não serão incorporados como fato sem nova validação

- Contagem de linhas de código morto e avaliação visual geral do relatório.
- Alegação de loading infinito ou race condition nos mapas, que requer reprodução em runtime.
- Divergência de dados públicos sobre população, que exige voltar às fontes oficiais antes de alterar conteúdo.
