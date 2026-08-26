# Validação — destaques editoriais nas cidades-piloto

## Escopo validado

As páginas de **Teresina**, **Cajueiro da Praia** e **São Raimundo Nonato** exibem a mesma seção complementar **Cultura e História**, depois dos tópicos básicos de planejamento. Cada cartão contém uma síntese editorial, fonte pública com link externo e a indicação de consulta editorial.

| Cidade | Cultura | História | Fonte(s) verificável(is) |
|---|---|---|---|
| Teresina | Identidade cultural, patrimônio local e Polo Cerâmico | Fundação como capital em 1852 e cidade planejada | [Presidência da República · G20 Brasil](https://www.gov.br/g20/en/about-the-g20/host-cities/teresina) |
| Cajueiro da Praia | Pesca artesanal e herança Tremembé | Origem do nome e fundação municipal em 1995 | [Prefeitura de Cajueiro da Praia](https://cajueirodapraia.pi.gov.br/cidade) |
| São Raimundo Nonato | Contexto arqueológico da Serra da Capivara | Formação administrativa e elevação a cidade em 1912 | [UNESCO · Serra da Capivara](https://whc.unesco.org/en/list/606/) e [Prefeitura de São Raimundo Nonato](https://saoraimundononato.pi.gov.br/2025/10/16/historico-da-cidade-de-sao-raimundo-nonato/) |

## Interação e responsividade

Em desktop, o cartão usa uma elevação discreta e realça o bloco de **Fonte** em areia mais contrastante no hover. A mesma ênfase está disponível para navegação por teclado por meio de foco interno. A seção mantém uma coluna por cartão em telas de 375 × 812 e duas colunas em desktop.

## Evidências técnicas

Foram concluídos com sucesso `pnpm check`, `pnpm test` (**37 testes**), `pnpm build` e `node scripts/validate-mvp-city-journey.mjs`. A jornada cobre as três cidades, as fontes de Cultura e História e o destaque de fonte em desktop. A inspeção visual foi concluída em 1280 × 720 e 375 × 812.
