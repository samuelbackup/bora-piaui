# Validação da integração de feedbacks

## Escopo

A integração conecta os formulários públicos à persistência via `trpc.feedbacks.submit` e o painel administrativo às consultas e mutations protegidas `trpc.feedbacks.adminList` e `trpc.feedbacks.markRead`. Os feedbacks não coletam nome, e-mail ou outro identificador pessoal.

## Evidências

| Verificação | Resultado |
| --- | --- |
| Contrato de entrada (`feedbackFields`) | 3 testes passando: categorias válidas, limites de mensagem, slug contextual e descarte de campos `name`/`email` fora do contrato. |
| Submissão contextual | Teste isolado confirma `category`, `message`, `destinationSlug`, `destinationName`, `rating: null` e `isRead: false` enviados ao helper de persistência. |
| Proteção administrativa | Teste isolado confirma `adminList` e `markRead` bloqueados para sessão anônima e usuário comum com `FORBIDDEN`. |
| Listagem e leitura | Teste isolado confirma que o admin recebe `listFeedbacks`, consulta o registro e chama `markFeedbackRead` com o id e o novo status. |
| Ensaio real autorizado | Em produção, um feedback técnico sem PII foi enviado por `/feedback`, apareceu em `/admin/feedbacks`, foi marcado como lido e o KPI de não lidos passou de 1 para 0 após recarregar a página. |
| Limpeza do ensaio | O registro técnico foi removido com filtro simultâneo por id e prefixo da mensagem; consulta posterior confirmou `remaining_test_records = 0`. |
| Schema de autenticação | Foi identificada e corrigida a ausência de `users.passwordHash`; a migration de reconciliação `server/database/0006_reconcile_password_hash.sql` foi aplicada sem alterar dados de usuários. |
| Frontend publicado | `/feedback` exibiu confirmação após o envio; `/admin/feedbacks` carregou a listagem persistida, filtros, detalhe e controle de leitura com sessão admin. |
| Qualidade | 23 arquivos de teste e 76 testes passando; TypeScript sem erros; build de produção concluído. |

## Limites e segurança

O ensaio real foi executado somente após confirmação explícita e usou uma mensagem identificada como teste técnico. O registro foi removido ao final, sem alterar feedbacks de usuários. A credencial temporária criada para habilitar o ensaio foi removida após o uso; a conta ensaiada ficou sem senha configurada. A senha não foi gravada no código nem em arquivos do projeto. O próximo passo operacional é implementar ou executar um fluxo seguro para o titular definir uma credencial própria.

A validação não cobre carga, abuso de rate limit ou uma sessão de usuário final em múltiplos navegadores. Esses cenários devem ser exercitados em staging antes de um uso público ampliado.
