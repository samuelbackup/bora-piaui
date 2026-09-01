# Validação da integração de feedbacks

## Escopo

A integração foi validada sem inserir mensagens artificiais no banco de produção. Os formulários públicos usam `trpc.feedbacks.submit`; o painel administrativo usa `trpc.feedbacks.adminList` e `trpc.feedbacks.markRead`.

## Evidências

| Verificação | Resultado |
| --- | --- |
| Contrato de entrada (`feedbackFields`) | 3 testes passando: categorias válidas, limites de mensagem, slug contextual e descarte de campos `name`/`email` fora do contrato. |
| Submissão contextual | Teste isolado do procedure confirma `category`, `message`, `destinationSlug`, `destinationName`, `rating: null` e `isRead: false` enviados ao helper de persistência. |
| Proteção administrativa | Teste isolado confirma `adminList` e `markRead` bloqueados para sessão anônima e usuário comum com `FORBIDDEN`. |
| Listagem e leitura | Teste isolado confirma que o admin recebe `listFeedbacks`, consulta o registro e chama `markFeedbackRead` com o id e o novo status. |
| Banco ativo | Consulta somente leitura confirmou a existência da tabela `feedbacks`, com 0 registros no momento da verificação. Nenhum dado de teste foi criado. |
| Frontend publicado localmente | `/feedback` e o detalhe de ponto turístico renderizados com o formulário persistente; `/admin/feedbacks` exibiu o bloqueio de área restrita sem sessão administrativa. |
| Qualidade | 23 arquivos de teste e 76 testes passando; TypeScript sem erros; build de produção concluído. |

## Limite deliberado

O fluxo que cria uma linha real e depois a marca como lida não foi executado contra o banco ativo porque isso exigiria inserir uma mensagem de teste que apareceria no painel editorial. A cobertura equivalente está isolada nos procedures, enquanto a disponibilidade do schema foi verificada por consulta somente leitura. A validação final com um feedback real deve ser feita por um usuário autorizado em staging ou por uma mensagem real de um participante do teste de usabilidade.
