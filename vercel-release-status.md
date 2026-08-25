# Estado da publicação Vercel

## Escopo atual

O domínio Vercel serve uma **prévia pública limitada** do Bora Piauí. A interface disponível apresenta somente o Polo Origens, com São Raimundo Nonato e Coronel José Dias, e deixa explícito que o protótipo não oferece reservas, pagamentos, propostas comerciais ou edição de conteúdo.

## Proteções aplicadas

| Aspecto | Situação atual |
| --- | --- |
| Indexação pública | Bloqueada por `robots.txt` e pelo cabeçalho `X-Robots-Tag: noindex, nofollow, noarchive`. |
| Operações editoriais | Restringidas por `adminProcedure` no servidor do projeto. |
| Rotas fora do MVP | Exibem uma tela de indisponibilidade, sem formulários nem acesso à jornada estadual anterior. |
| API externa | Não integrada à publicação estática da Vercel. |

## Condição para reabrir áreas públicas

As rotas de agenda, parceiros, dados, patrimônios, sabores e administração somente devem ser reativadas após a API persistida estar disponível e o build estático apontar explicitamente para a URL da API aprovada por meio de `VITE_API_BASE_URL`.

## Verificação externa pendente

Em 25 de agosto de 2026, o domínio `bora-piaui.vercel.app` ainda retornava a versão estadual anterior, embora a branch `main` local e remota já apontassem para o checkpoint de realinhamento. O conector Vercel não encontrou projetos na equipe disponível e o acesso à conta que atende o domínio requer autenticação no navegador, cuja ativação não foi aprovada. Portanto, esta versão não deve ser divulgada como atualizada até que o deployment seja confirmado na conta Vercel proprietária.
