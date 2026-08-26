# Modelo de conteúdo — Bora Piauí

## Regra editorial

Cada destino possui uma página pública. Informações operacionais não são presumidas: **horários, preços, formas de acesso, contatos e condição de visitação** devem trazer fonte, data de verificação e um estado explícito.

| Entidade | Campos essenciais | Uso |
| --- | --- | --- |
| Destino | título, slug, resumo, descrição, polo, categoria, município, coordenada/consulta de mapa e fonte institucional | Descoberta, mapa e página individual. |
| Informação operacional | status, horário informado, preço informado, acesso, contato/link, observação, fonte, verificado em | Bloco de planejamento da página individual. |
| Imagem de galeria | URL, texto alternativo, legenda, ordem e capa | Galeria acessível por destino. |

## Estados de visitação

| Estado | Exibição pública |
| --- | --- |
| `confirmado` | Informação operacional disponível, com fonte e data de verificação. |
| `verificar` | O destino é exibido, mas a página pede confirmação antes da saída. |
| `indisponível` | Alerta que a visitação não está disponível ou não foi confirmada. |

## Permissões

Visitantes acessam a descoberta e as páginas públicas. Usuários autenticados com papel **admin** podem criar, editar, publicar ou retirar destinos, galerias e condições operacionais. Operações de escrita não serão disponibilizadas no navegador sem autorização no servidor.
