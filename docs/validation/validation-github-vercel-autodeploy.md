# Validação — deploy automático GitHub → Vercel

## Repositório

O código do projeto está publicado no repositório privado [samuelbackup/bora-piaui](https://github.com/samuelbackup/bora-piaui), na branch `main`.

## Integração confirmada

A página do projeto **bora-piaui** na Vercel confirma a origem no repositório GitHub e indica que a implantação de produção é atualizada com novos pushes para `main`. A implantação de produção está em estado **Ready** no domínio [bora-piaui.vercel.app](https://bora-piaui.vercel.app).

O conector de automação retornou conflito ao tentar recriar o projeto porque ele já existe; a confirmação no painel demonstra que o vínculo de origem está ativo, sem a necessidade de criar uma segunda aplicação na Vercel.

## Fluxo de atualização

1. Alterar o projeto localmente.
2. Salvar o checkpoint do Manus quando necessário.
3. Fazer `git add`, `git commit` e `git push github main`.
4. A Vercel cria a nova implantação de produção automaticamente.
