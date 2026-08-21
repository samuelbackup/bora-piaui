# Relatório resumido de status — Bora Piauí

**Data:** 21 de agosto de 2026  
**Escopo deste relatório:** front-end, documentação de integração e preparação do fluxo de entrega.  
**Situação geral:** o protótipo navegável está funcional e publicado; a principal etapa pendente é implementar e integrar o back-end real conforme o blueprint técnico.

## Resumo executivo

O Bora Piauí evoluiu de um protótipo de uma cidade para uma experiência estadual navegável, com mapa interativo, filtros, páginas de destinos, três cidades-piloto, conteúdos editoriais rastreáveis e fluxos demonstrativos de agenda e parcerias. O trabalho manteve a regra editorial de não criar avaliações, contatos, horários, preços ou negócios sem confirmação pública.

O front-end está preparado para receber dados reais: existe um adaptador local assíncrono, estados de carregamento e erro, contratos tRPC já mapeados e uma estratégia de migração gradual. A documentação técnica recomenda manter o front-end na Vercel e publicar a API Node/tRPC no Railway, com o banco e mídia tratados como serviços separados.

| Indicador | Estado atual |
|---|---|
| Checklist histórico | 210 itens concluídos; este relatório conclui o último item registrado |
| Cidades-piloto | Teresina, Cajueiro da Praia e São Raimundo Nonato |
| Conteúdo editorial | Cultura e História nas três cidades, com fontes públicas indicadas |
| Testes mais recentes da interface | 42 testes aprovados na validação de staging |
| Branches | `main` para produção e `staging` para testes |
| Hospedagem do front-end | Manus publicado e Vercel com prévias automáticas da `staging` |

## O que já foi feito

| Frente | Entregas concluídas |
|---|---|
| Descoberta turística | Atlas estadual, mapa Google Maps integrado, filtros por categoria, polos turísticos, estados ativos e acesso a detalhes. |
| Conteúdo e destinos | Páginas individuais, patrimônios, sabores, dados, galerias e informações editoriais com fontes verificáveis. |
| Cidades-piloto | Jornada por cidade, navegação contextual entre cidades, descoberta por proximidade, tópicos de planejamento e roteiros demonstrativos. |
| Agenda e parceiros | Agenda Cultural, formulário demonstrativo de parceria, Revisão Editorial, publicar/despublicar, período de evento e remoção confirmada. |
| Experiência e acessibilidade | Menu compacto, navegação por teclado, feedback de hover/foco, modo escuro persistente e abertura suave com respeito a redução de movimento. |
| Qualidade | Validações em desktop e celular, testes unitários, jornadas automatizadas e registros de evidência. |
| Entrega técnica | Repositório privado GitHub, deploy Vercel, branch `staging`, prévias automáticas e documentação de blueprint/integracão. |

## O que falta fazer

### Prioridade imediata — back-end real

O próximo ciclo deve implementar o que já está especificado em `backend-blueprint-bora-piaui.md` e `frontend-backend-integration-bora-piaui.md`. A primeira entrega deve incluir migrations, catálogo de cidades e destinos, fontes editoriais, agenda, propostas de parceria e roteiros. A API deve expor procedimentos tRPC de leitura pública e mutações editoriais protegidas por papel de usuário.

| Prioridade | Próxima entrega | Critério de conclusão |
|---|---|---|
| P0 | Banco e migrations de staging | Schema versionado, migration aplicada e rollback documentado. |
| P0 | API pública inicial | `cities.bySlug`, atrações, destaques editoriais e fontes respondem dados persistidos. |
| P0 | Integração gradual na interface | `CityPage` usa a API sob feature flag, preservando fallback local em caso de indisponibilidade. |
| P0 | Segurança e operação | Papéis editoriais, validação de entrada, logs, CORS restritivo, segredos configurados e backups do banco. |
| P1 | Agenda e parceiros persistidos | Fluxos demonstrativos substituídos por operações reais com auditoria editorial. |
| P1 | Administração de mídia | Upload para S3, metadados persistidos, créditos e remoção segura de arquivos. |
| P2 | Curadoria operacional ampliada | Restaurantes, serviços, contatos, horários e preços somente após processo contínuo de verificação. |

## Estado de entrega e atenção necessária

O código de `staging` está configurado para gerar prévias automáticas na Vercel quando recebe novos pushes. No momento do levantamento, a branch local possuía um commit do blueprint ainda à frente do remoto; antes de iniciar o back-end, esse material deve ser revisado e enviado ao GitHub para manter a documentação sincronizada com a prévia.

O projeto publicado continua sendo um **protótipo de front-end**. Embora a interface exiba fluxos de agenda, parcerias e revisão, a integração definitiva não deve ser considerada pronta até que a API, o banco, a autenticação editorial e o armazenamento de mídia estejam em produção.

> A regra de conteúdo permanece: informação operacional só deve aparecer após confirmação atual e fonte verificável. O back-end deve reforçar essa regra com campos de origem, status editorial, datas de revisão e trilha de auditoria.

## Recomendação de arquitetura para a próxima etapa

| Camada | Destino recomendado | Papel |
|---|---|---|
| Front-end | Vercel | SPA React, prévias da `staging` e produção pela `main`. |
| API | Railway | Serviço Node/Express com tRPC, validação, autorização e jobs futuros. |
| Banco | TiDB/MySQL gerenciado | Dados editoriais, agenda, parceiros, usuários e auditoria. |
| Arquivos | S3 compatível | Imagens, créditos, metadados e URLs assinadas. |
| Observabilidade | Logs da plataforma e monitoramento de erros | Diagnóstico de API, falhas de integração e revisão editorial. |

## Referências internas

1. `backend-blueprint-bora-piaui.md` — arquitetura, dados, segurança e implantação proposta.
2. `frontend-backend-integration-bora-piaui.md` — contratos, feature flags e plano de migração.
3. `validation-staging-theme-loading.md` — validação de staging, tema e prévia Vercel.
4. `validation-github-vercel-autodeploy.md` — integração GitHub–Vercel.
5. `todo.md` — histórico consolidado das entregas e verificações.
