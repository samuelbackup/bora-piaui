# Validação — navegação compacta da home

## Resultado

O cabeçalho da home foi simplificado em todas as larguras de tela: a faixa horizontal de links foi removida e as rotas públicas passaram a ficar no menu de três barras, posicionado ao lado de **Meu roteiro**. O menu começa fechado, preservando uma leitura limpa da página inicial.

## Acessibilidade e comportamento

O acionador informa o estado expandido por `aria-expanded`, referencia o painel por `aria-controls` e alterna o rótulo entre **Abrir menu** e **Fechar menu**. Os links internos fecham o painel ao navegar; ações de rolagem utilizam o fechamento já existente na função de navegação.

## Evidências

`pnpm check`, `pnpm test` e `pnpm build` foram concluídos com sucesso. A suíte reúne **39 testes**. A home foi inspecionada visualmente em **1280 × 720** e **375 × 812**, confirmando que marca, Meu roteiro e botão de menu permanecem legíveis e sem sobreposição.
