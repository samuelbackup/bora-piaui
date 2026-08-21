# Fontes de apoio — blueprint de back-end

## tRPC

O [guia oficial do tRPC](https://trpc.io/docs) descreve contratos de API com inferência de tipos entre cliente e servidor, sem geração de código, e recomenda migração gradual ao adicionar tRPC a uma aplicação existente. Isso sustenta a migração dos módulos ainda locais para routers novos, sem reescrever de uma vez os módulos de destinos, agenda e parceiros já existentes.

## Drizzle ORM

A [documentação de migrações do Drizzle](https://orm.drizzle.team/docs/migrations) apresenta o fluxo *codebase-first* com schema TypeScript versionado, geração de SQL por `drizzle-kit generate` e aplicação posterior das migrações. Esse será o fluxo recomendado para mudanças de domínio.

## OWASP

O [Authorization Cheat Sheet da OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) diferencia autenticação de autorização e recomenda privilégio mínimo, negação por padrão e validação de permissão em cada requisição. Essas diretrizes embasam a separação entre rotas públicas, protegidas e administrativas.

## Railway

O [guia de deployments do Railway](https://docs.railway.com/guides/deployments) documenta comandos de pré-deploy, health checks, políticas de reinício e deploy automático a partir do GitHub. Essas capacidades justificam sua recomendação como serviço de API Node/Express separado do front-end estático.
