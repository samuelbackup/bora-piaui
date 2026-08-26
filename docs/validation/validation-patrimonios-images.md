# Validação — imagens de patrimônios materiais

## 25 de agosto de 2026

- A rota local `/patrimonios` exibiu quatro imagens, textos alternativos, créditos e links de licença nos cartões de Oeiras, Parnaíba, Serra da Capivara e Sete Cidades, em desktop e celular.
- `pnpm check`, `pnpm test` e `pnpm build` foram executados após a integração, sem falhas.
- O checkpoint `f94a9813` foi criado e o commit `f94a981` foi enviado à branch `main` do repositório GitHub.
- Na primeira verificação de `https://bora-piaui.vercel.app/patrimonios?revision=f94a981`, o conteúdo editorial ainda aparecia sem os créditos de Wikimedia Commons; portanto, a propagação externa ainda não foi declarada confirmada nesta etapa.

Na verificação posterior, a mesma rota externa passou a apresentar as quatro imagens e as respectivas atribuições: Arysson Rios (Oeiras), GLandovsky (Parnaíba), Mateus S. Figueiredo (Serra da Capivara) e Otávio Nogueira (Sete Cidades), com links de licença visíveis. A publicação externa do commit `f94a981` foi, assim, confirmada.
