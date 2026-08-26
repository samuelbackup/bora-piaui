# Roteiro de migração para o novo back-end — Bora Piauí

**Status:** proposta técnica para execução em staging antes de produção  
**Objetivo:** transportar os dados hoje mantidos no ambiente atual para o novo back-end sem perda editorial, sem quebrar créditos de imagens e sem transferir sessões, tokens ou credenciais de usuários.

> Este documento não autoriza a exportação ampla de dados pessoais. A migração deve operar com mínimo privilégio, acesso restrito, arquivos criptografados em repouso e eliminação dos artefatos temporários após validação.

## 1. Ponto de partida confirmado

O repositório contém o schema Drizzle, helpers de banco, routers tRPC e a integração de autenticação atual. O banco gerenciado consultado na preparação possui, no momento deste plano, cinco usuários, nove destinos, nove registros de imagens, dois eventos culturais, uma proposta de parceiro e vinte e sete eventos de uso anonimizados. O catálogo das cidades-piloto ainda possui também conteúdo editorial local em `client/src/lib/mvpPilot.ts`; ele deve ser tratado como uma fonte adicional de seed, e não ser esquecido durante a migração.

| Conjunto atual | Fonte de verdade hoje | Destino recomendado |
|---|---|---|
| Destinos e imagens relacionadas | Tabelas `destinations` e `destination_images` | Tabelas equivalentes no banco novo, mantendo slug e metadados de atribuição |
| Agenda e propostas de parceiros | `cultural_events` e `partner_submissions` | Banco novo, com acesso administrativo e campos pessoais restritos |
| Cidades-piloto, lugares, roteiros e relações | `mvpPilot.ts` | Novo domínio editorial (`cities`, `city_places`, `itineraries`, fontes e relações) |
| Imagens | URLs `/manus-storage/...` e referências do catálogo | Bucket S3 compatível do novo ambiente, com novos URLs e manifest de migração |
| Usuários e papéis | `users` + identidade Manus OAuth | Tabelas de usuário e identidade do novo provedor OIDC |
| Métricas de uso | `usage_events` com identificador de sessão pseudônimo | Preferencialmente agregados diários, sem reaproveitar identificadores de sessão |

O schema atual usa MySQL/TiDB e Drizzle, portanto o caminho com menor risco é manter a compatibilidade MySQL/TiDB no ambiente novo e aplicar migrations versionadas pelo Drizzle.[1]

## 2. Ordem de execução

| Etapa | Resultado esperado | Condição para avançar |
|---|---|---|
| 0. Preparar staging | Banco, bucket e provedor OIDC de staging isolados | Segredos fora do Git e acesso de migração com privilégio mínimo |
| 1. Criar schema | Todas as migrations aplicadas no banco novo | Migration auditada e execução repetível em banco vazio |
| 2. Extrair e normalizar | Arquivos CSV/JSON de trabalho e manifesto de mídia | Contagens, tipos e referências verificados; PII separado |
| 3. Migrar mídia | Todos os objetos enviados ao novo bucket | Hash, MIME, tamanho, crédito e licença conferidos |
| 4. Importar conteúdo | Dados editoriais e relações inseridos | Chaves, slugs, fontes e imagens preservados |
| 5. Configurar identidade | Novo login funcional e usuários vinculados | Nenhum token/sessão antiga copiado; papéis revisados |
| 6. Validar em staging | Front-end funciona contra a nova API | Testes, contagens e amostras editoriais aprovados |
| 7. Cortar produção | Nova API passa a receber leituras/escritas | Backup, plano de rollback e janela de mudança aprovados |

## 3. Exportação e importação de banco de dados

### 3.1 Preparar o banco novo

Crie um banco de **staging** separado do banco de produção e aplique o schema pelo fluxo normal: alterar `drizzle/schema.ts`, gerar a migration, revisar o SQL e aplicá-lo. O schema TypeScript deve permanecer como fonte de verdade; não crie tabelas manualmente apenas no painel do provedor.[1]

Além das tabelas existentes, o novo domínio deve incluir as entidades previstas no blueprint: `cities`, `editorial_sources`, `city_places`, `city_place_media`, `city_editorial_highlights`, `city_curation_topics`, `itineraries`, `itinerary_stops`, `place_proximity_relations` e `editorial_audit_logs`. Os dados existentes de destinos gerais não devem ser duplicados automaticamente como lugares de cidade; a primeira carga deve conter somente as referências editoriais que pertencem às cidades-piloto.[2]

Inclua tabelas de controle de migração, por exemplo `migration_runs` e `media_migration_map`. Elas devem registrar apenas IDs técnicos, status, timestamp, checksum e erros sanitizados, nunca conteúdo de sessão, e-mail, telefone ou endereço completo.

### 3.2 Extrair por conjuntos e preservar a ordem relacional

A exportação precisa ser feita com uma conta de banco **somente leitura** e em uma janela em que escritas administrativas estejam pausadas, ou então registrando uma marca temporal de corte. A sequência mínima é:

1. Exportar destinos antes de `destination_images`, pois a imagem depende do identificador do destino.
2. Exportar eventos culturais e conteúdo editorial sem dependência de usuário.
3. Exportar propostas de parceiros em arquivo separado e protegido, pois incluem nome comercial, telefone, endereço e descrição fornecida por terceiros.
4. Exportar usuários em fluxo separado e minimizado: `id`, identificador legado, papel, datas técnicas; nome e e-mail só quando indispensáveis para a vinculação consentida.
5. Agregar `usage_events` por data, evento, cidade e item, descartando `sessionId` antes de transportar histórico analítico.

Para preservar referências sem obrigar a manter os mesmos IDs autoincrementais, crie um campo `legacy_id` temporário ou uma tabela de mapeamento `legacy_id → new_id` para cada entidade. Preserve `slug` como chave natural quando ele já for único. A importação deve usar upsert idempotente por `slug` ou `legacy_id`, permitindo retomar uma execução interrompida sem duplicar conteúdo.

### 3.3 Formato e guarda dos artefatos

Use CSV para tabelas simples e JSON para dados com relações e campos longos, todos codificados em UTF-8. Cada lote deve conter um manifesto com nome de arquivo, contagem de linhas, hash SHA-256, schema de origem, versão da migration e data de extração. Guarde os arquivos em bucket privado criptografado ou em armazenamento temporário com acesso restrito; não os adicione ao GitHub, não os envie por chat e não deixe cópias no diretório do projeto.

Uma consulta de contagem é suficiente para a primeira validação. A migração deve comparar pelo menos: total de destinos, imagens, eventos, propostas e usuários; quantidade de slugs únicos; e quantidade de registros sem fonte, sem status ou sem relação obrigatória. Para parceiros e usuários, a verificação deve produzir apenas totais e falhas técnicas, sem imprimir registros em logs.

### 3.4 Métricas de uso

Os eventos atuais não guardam texto livre nem dados de conta, mas carregam um identificador de sessão pseudônimo. Para reduzir reidentificação indireta, exporte o histórico somente como agregação diária, por exemplo `data`, `eventName`, `citySlug`, `itemId` e `total`. No novo back-end, reinicie a geração de sessões pseudônimas e documente a política de retenção. Não transporte o valor de `sessionId` para o ambiente novo.

## 4. Migração das imagens para o storage novo

As imagens em uso não estão versionadas no Git; elas são objetos no storage atual e as URLs `/manus-storage/{key}` representam caminhos entregues por redirecionamento.[3] Por isso, uma cópia do banco sozinha **não** transfere a mídia.

### 4.1 Montar um manifesto de mídia

Antes de baixar qualquer arquivo, gere um manifesto único combinando:

| Campo | Origem | Finalidade |
|---|---|---|
| `legacy_url` | `destination_images.imageUrl` e catálogo local | Localizar o objeto atual |
| `entity_type` e `entity_slug` | Tabela ou catálogo | Ligar a imagem ao conteúdo correto |
| `alt_text` | Banco ou catálogo | Acessibilidade |
| `credit`, `source_url`, `license`, `license_url` | Catálogo e pesquisas de curadoria | Preservar atribuição e licença |
| `checksum`, `mime_type`, `byte_size` | Processo de cópia | Integridade e deduplicação |
| `target_key`, `target_url`, `status` | Processo de importação | Reexecução e rastreabilidade |

Os campos de crédito e licença precisam virar colunas estruturadas na nova tabela de mídia; não os armazene somente em um texto de legenda. Isso permite renderização acessível, auditoria e troca futura de storage sem perder atribuição.

### 4.2 Processo de cópia por objeto

1. Leia o manifesto e obtenha a URL de leitura autorizada no ambiente atual.
2. Baixe para um diretório temporário privado, verificando resposta HTTP, tipo MIME permitido e limite de tamanho.
3. Calcule SHA-256. Se o hash já existir no bucket novo, reutilize o objeto e registre o mapeamento; não duplique bytes.
4. Envie o arquivo ao bucket novo em uma chave estável, como `media/{sha256}.{ext}` ou `destinations/{slug}/{sha256}.{ext}`.
5. Grave ou atualize a linha de mídia apenas após o upload retornar sucesso; associe `target_key`, URL de entrega, texto alternativo e metadados de atribuição.
6. Teste leitura pública ou URL assinada conforme a política do novo produto. Em seguida, atualize o front-end/API para apontar apenas ao novo endpoint.

O banco deve guardar URL ou chave do objeto, crédito, fonte e licença; bytes não devem ser armazenados em colunas do banco. O bucket é a fonte dos arquivos e o banco é a fonte dos metadados e relações.[3]

### 4.3 Rollback e encerramento

Mantenha os caminhos antigos intactos até validar que cada URL nova responde, que nenhuma imagem perdeu crédito e que as páginas principais renderizam corretamente. Durante o corte, habilite uma flag de configuração para alternar entre o host antigo e o novo. Após período de estabilidade definido pela equipe, revogue os acessos temporários, elimine arquivos de trabalho e mantenha somente o manifesto sem dados pessoais e os logs agregados de auditoria.

## 5. Estratégia de autenticação e migração de usuários

A autenticação atual recebe `openId`, nome, e-mail e método de login do OAuth Manus, atualiza `users` e cria uma sessão com validade de um ano. O banco não contém senha do usuário, token OAuth reutilizável ou segredo que possa ser copiado para outro provedor.[4]

> **Decisão recomendada:** não “migrar login” como se fosse uma cópia de senha. Migre o perfil interno e faça cada pessoa vincular uma identidade verificada no novo provedor OIDC.

### 5.1 Modelo-alvo de identidade

Mantenha `users` como perfil interno e crie uma relação de identidade externa, por exemplo:

| Campo | Regra |
|---|---|
| `user_id` | Referência ao perfil interno |
| `provider` | Nome fixo do provedor OIDC escolhido |
| `provider_subject` | Valor `sub` do token validado no servidor |
| `legacy_manus_open_id` | Apenas para vínculo temporário, com acesso administrativo restrito |
| `linked_at`, `last_login_at` | Auditoria técnica |
| `role` | Mantido somente no banco e verificado no servidor |

Imponha unicidade em `(provider, provider_subject)`. A API deve validar assinatura, emissor, audiência e expiração do token antes de criar sessão. Papéis administrativos não devem vir de parâmetros do cliente nem de claims não verificadas; a autorização deve ser aplicada em cada procedimento administrativo.[5]

### 5.2 Fluxo de transição recomendado

1. Escolher e configurar o provedor OIDC novo em staging, com callback, domínio permitido e segredos mantidos apenas no serviço de API.
2. Publicar o login novo sem desativar imediatamente o caminho Manus para os cinco usuários existentes.
3. Quando a pessoa iniciar a vinculação, exigir **duas provas no mesmo fluxo**: sessão válida da conta atual e autenticação concluída no novo provedor. O servidor antigo emite um código de transferência de uso único, curto e assinado; o servidor novo o troca por uma associação `legacy_user_id → provider_subject`.
4. Registrar a vinculação em auditoria e pedir novo login no sistema novo para confirmar a sessão independente.
5. Para as contas administrativas, realizar revisão manual do papel após a vinculação. Não conceder `admin` automaticamente apenas porque o e-mail parece igual.
6. Depois que todas as contas necessárias forem vinculadas, expirar sessões antigas, remover o callback legado e eliminar o identificador Manus temporário conforme a política de retenção.

Não faça vinculação automática apenas por e-mail. Endereços podem mudar, ser compartilhados ou estar ausentes; usar uma identificação textual como prova de posse abre risco de associação indevida. Também não copie cookies, sessões de um ano, tokens de acesso ou refresh tokens entre serviços.

### 5.3 Propostas de parceiros e dados de contato

As propostas de parceiros contêm dados de contato e devem ser tratadas como um conjunto separado. Antes de migrá-las, defina quem poderá acessar, por quanto tempo, para qual finalidade e como será solicitado eventual consentimento adicional. Exporte somente as colunas necessárias para o fluxo editorial e limite a visualização aos administradores. Listagens públicas não devem retornar telefone, endereço ou notas editoriais internas.

## 6. Validação, corte e rollback

### Critérios de aceite em staging

- As migrations são aplicadas do zero sem etapas manuais no banco.
- As contagens e os slugs únicos de conteúdo conferem com o inventário de origem.
- Cada imagem tem objeto legível, texto alternativo, crédito, fonte e licença quando aplicável.
- As páginas de cidade e os patrimônios renderizam com URLs novas; nenhuma URL `/manus-storage/` fica como dependência de produção após o corte.
- Login novo cria ou vincula apenas a identidade autenticada; uma conta comum não acessa routers administrativos.
- Propostas de parceiros e dados de usuário não aparecem em logs, respostas públicas, backups compartilhados ou builds front-end.
- A restauração em staging a partir do último backup é testada antes da troca de produção.

### Janela de corte

Primeiro migre e valide em staging. Em produção, congele temporariamente as escritas de administração e envio de parceiros, execute a carga incremental desde a marca de corte, rode as conferências, altere a URL pública da API e monitore erros. Mantenha o ambiente anterior em modo somente leitura até a equipe aprovar o resultado. Se houver falha, retorne a configuração da API e das URLs de mídia ao ambiente anterior; não tente corrigir apagando dados do banco novo sem backup.

## 7. Backlog imediato da equipe

| Prioridade | Ação concreta | Responsável sugerido |
|---|---|---|
| P0 | Escolher banco, bucket S3 e provedor OIDC do novo ambiente | Responsável técnico do projeto |
| P0 | Criar staging isolado, secrets e backup testável | Responsável técnico do projeto |
| P0 | Criar migrations para o domínio de cidades-piloto e tabelas de mídia/identidade | Back-end |
| P0 | Produzir manifest e script idempotente de migração de mídia | Back-end |
| P1 | Converter `mvpPilot.ts` em seed editorial com fontes e créditos | Conteúdo + back-end |
| P1 | Implementar ponte de vinculação de identidade e revisão manual de papéis | Back-end + administrador |
| P1 | Integrar front-end por feature flag e executar testes de regressão | Front-end + QA |

## Referências

[1]: https://orm.drizzle.team/docs/migrations "Drizzle ORM — migrations"
[2]: https://github.com/samuelbackup/bora-piaui/blob/main/backend-blueprint-bora-piaui.md "Bora Piauí — blueprint de back-end"
[3]: https://github.com/samuelbackup/bora-piaui/blob/main/server/storage.ts "Bora Piauí — helpers de armazenamento"
[4]: https://github.com/samuelbackup/bora-piaui/blob/main/server/_core/oauth.ts "Bora Piauí — callback OAuth atual"
[5]: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html "OWASP — Authorization Cheat Sheet"
