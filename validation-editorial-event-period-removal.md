# Validação — período e remoção de programação editorial

## Resultado

O formulário da Revisão Editorial agora permite informar uma **data de término opcional**. Quando o evento tem período de mais de um dia, a listagem mostra início e término. Os controles de **Publicar** e **Despublicar** foram preservados e a ação **Remover** solicita confirmação antes de excluir o registro persistido.

| Critério | Desktop, 1280 × 720 px | Celular, 375 × 812 px | Resultado |
|---|---|---|---|
| Data de término | Validado | Validado | Campo opcional exibido ao lado da data de início no desktop e abaixo dela em celular. |
| Período completo | Validado | Validado | Registro de validação apresentou `12/09/2026 — 14/09/2026` na Revisão Editorial. |
| Publicar e despublicar | Validado | Validado | O evento publicado exibiu o controle **Despublicar**, preservando o ciclo editorial existente. |
| Remoção segura | Validado | Validado | O botão **Remover** aparece ao lado do controle de publicação e aciona confirmação antes da exclusão persistida. |
| Layout | Validado | Validado | Campos e ações permanecem legíveis e com áreas de toque separadas. |

## Regressão

`pnpm check`, Vitest, build de produção e `scripts/validate-editorial-agenda.mjs` concluíram sem erros. O cenário automatizado percorre criação com data final, publicação, despublicação, remoção confirmada e limpeza do registro temporário.
