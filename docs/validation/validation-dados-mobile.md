# Validação — seção Dados em mobile

O problema foi reproduzido na rota `/dados` no viewport de 400 × 689 px. A inspeção encontrou que os cartões com gráficos eram calculados com 530 px de largura no layout de uma única coluna; por isso o documento atingia 546 px e criava rolagem horizontal.

A correção definiu explicitamente uma coluna antes do breakpoint `lg` e permitiu que os cartões e gráficos reduzissem com `min-w-0`. Após a mudança, as medições automatizadas retornaram `documentWidth` e `bodyWidth` iguais ao viewport, sem elementos excedentes, em 400 × 689 px e 375 × 812 px. A revisão visual também confirmou a preservação da grade de dois gráficos em desktop (1280 × 720 px).

A checagem de tipos, a suíte automatizada e o build de produção foram concluídos com êxito: 12 arquivos de teste e 44 testes aprovados. O build apenas emitiu o aviso já conhecido sobre tamanho de chunk do bundle, sem falha de compilação.

A confirmação externa ocorreu em `https://bora-piaui.vercel.app/dados?ver=d653c34`. A página em produção passou a servir o bundle `index-DbxJC0S-.js`, que contém as classes de contenção `grid-cols-1 gap-6 lg:grid-cols-2` e `min-w-0 rounded-[2rem]`; assim, a versão Vercel recebeu a correção publicada.
