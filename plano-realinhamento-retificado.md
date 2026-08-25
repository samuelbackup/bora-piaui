# Plano de realinhamento do Bora Piauí ao documento retificado

## Objetivo

Reorientar o Bora Piauí para o recorte autorizado de **um único polo turístico — Origens, composto por São Raimundo Nonato e Coronel José Dias** — antes de desenvolver qualquer funcionalidade nova. O trabalho será realizado em uma sequência deliberada: primeiro eliminar a exposição indevida de operações editoriais; em seguida, reduzir a interface e as rotas públicas ao escopo aprovado; depois, tornar a publicação externa honesta quanto à disponibilidade da API; e, por fim, substituir o catálogo local por dados persistidos e administráveis.

As capturas recebidas confirmam dois sintomas concretos do desalinhamento atual: a home ainda afirma que explora “um estado inteiro” e mantém o bloco de três cidades-piloto, enquanto os três cartões apresentam o fallback **“NO IMAGE AVAILABLE”**. Esses elementos serão removidos ou substituídos pelo novo recorte, não tratados como correções visuais isoladas.

| Decisão de produto | Diretriz adotada |
|---|---|
| Documento de autoridade | O documento retificado prevalece sobre as decisões incorporadas em versões anteriores do código. |
| Recorte público inicial | Polo Origens: São Raimundo Nonato e Coronel José Dias. |
| Segurança | Nenhuma escrita editorial poderá ser executada por procedure pública. |
| Vercel | Não será divulgado como aplicativo funcional enquanto depender de API indisponível; uma interface publicada deverá ser integralmente estática e sem ações enganosas, ou apontar para uma API real. |
| Monetização | O preço de **R$ 49/mês** e toda leitura comercial do Plano Destaque serão removidos até haver telemetria persistida e decisão de negócio posterior. |

## Fase 0 — Congelamento, inventário e critérios de corte

Será preparado um inventário rastreável de rotas, menus, componentes, dados locais e operações tRPC que estejam fora do recorte Origens. A referência será o documento retificado e, na ausência dele no repositório, a definição formal registrada nesta solicitação. O inventário separará itens a remover, a ocultar como “Em breve” e a preservar apenas como código não exposto, evitando apagar prematuramente material que ainda possa ser útil no futuro.

O principal alvo inicial é a home atual: `Home.tsx` contém uma narrativa estadual, mapa e dados de nove âncoras; `mvpPilot.ts` mantém Teresina, Cajueiro da Praia e São Raimundo Nonato; e `App.tsx` expõe rotas de Patrimônios, Sabores, Dados, Agenda, Parceiros e administração. Também será identificado o componente que produz o fallback de imagem para impedir que a versão de Origens renderize placeholders quebrados.

| Saída | Critério de aceite |
|---|---|
| Matriz de escopo | Cada rota, menu, CTA e conjunto de dados é classificado como “Origens”, “Em breve” ou “fora da versão pública”. |
| Matriz de risco | As procedures públicas de leitura e escrita, inclusive listagens editoriais, são classificadas por impacto e acesso esperado. |
| Registro de evidência | As capturas de home com texto estadual, três cartões e placeholders são vinculadas aos critérios de remoção. |

## Fase 1 — Correção de autorização antes de nova publicação

Será eliminado o acesso público às mutações demonstrativas. Em especial, `agenda.demoCreate`, `agenda.demoUpdate`, `agenda.demoDelete` e `partners.demoUpdateEditorialStatus` deixarão de usar `publicProcedure` e passarão a exigir `adminProcedure`. A revisão alcançará também as listagens demonstrativas e quaisquer chamadas da interface administrativa que dependam delas, para que rascunhos, propostas e eventos não sejam expostos a visitantes anônimos por uma rota alternativa.

O painel editorial será conectado apenas às procedures administrativas já previstas, preservando respostas explícitas para usuários sem sessão ou sem papel de administrador. Não será adotada uma proteção meramente visual no front-end: a autorização permanecerá aplicada no servidor, com `adminProcedure`, e o cliente exibirá estados de acesso negado em vez de tentar executar a operação.

| Alteração | Validação obrigatória |
|---|---|
| Mutations editoriais | Uma chamada anônima e uma chamada de usuário comum retornam `FORBIDDEN`; uma chamada administrativa autorizada conclui a operação esperada. |
| Listagens internas | Rascunhos, propostas e dados de revisão não podem ser obtidos por procedures públicas. |
| Interface administrativa | Ações de criar, editar, publicar, despublicar, remover e revisar propostas usam apenas contracts administrativos. |
| Regressão | Testes de fluxo existentes são reescritos com contextos anônimo, usuário comum e administrador; não se aceita teste que injete contexto vazio e trate a mutação como pública. |

## Fase 2 — Redução da experiência pública ao Polo Origens

A home será reestruturada como uma porta de entrada para o **Polo Origens**, substituindo “Um estado inteiro de caminhos”, “nove âncoras” e “três cidades-piloto” por uma proposta editorial compatível com São Raimundo Nonato e Coronel José Dias. A navegação principal exibirá somente entradas que pertençam ao recorte aprovado; os conteúdos não disponíveis deixarão de concorrer no menu e, caso se decida mantê-los navegáveis, serão agrupados em uma única experiência não interativa intitulada “Em breve”.

As cidades e itens fora do polo serão removidos da apresentação pública e do estado inicial. Será criada a modelagem mínima necessária para Coronel José Dias como parte do mesmo polo, sem reabrir a cobertura estadual. O conjunto de pontos, roteiro, textos, fontes, mapa e CTAs ficará limitado a registros editorialmente aprovados para o território. O bloco de três cartões será substituído por uma jornada única de polo ou retirado por completo; nenhuma imagem será exibida sem um ativo verificável. Onde não houver imagem validada, a interface usará composição tipográfica e cartográfica deliberada, e não o placeholder “NO IMAGE AVAILABLE”.

Também serão removidos da interface pública o preço de referência de **R$ 49/mês**, elementos de comparação de plano e CTAs que sugiram contratação. O histórico de parceiros poderá ser preservado no código, mas não será parte da navegação, da home ou da proposta demonstrada até que métricas e regras de negócio sejam definidas.

| Elemento atual | Tratamento no recorte Origens |
|---|---|
| Narrativa de atlas estadual, filtros de polos e nove âncoras | Remover da home e substituir pela narrativa territorial de Origens. |
| Teresina e Cajueiro da Praia | Retirar de menus, cards, rotas de descoberta e dados carregados na experiência pública. |
| São Raimundo Nonato e Coronel José Dias | Consolidar como um polo único, com conteúdos e fontes aprovados. |
| Patrimônios, Sabores, Dados, Agenda e Parceiros | Ocultar da navegação pública ou concentrar em “Em breve”, sem ações que dependam de backend indisponível. |
| Fallback de imagens | Eliminar da versão pública: somente mídia validada ou layout sem mídia. |
| Plano Destaque com preço | Remover da interface pública e de qualquer mensagem de monetização. |

## Fase 3 — Contenção e decisão de publicação na Vercel

Antes de promover uma nova versão, será feita uma validação do comportamento do build estático no domínio Vercel. Hoje, operações tRPC dependentes do mesmo domínio podem parecer disponíveis na interface, mas não possuem uma API externa confirmada; por isso o domínio não deverá ser divulgado como plataforma operacional durante a transição.

O plano adota uma regra de decisão objetiva. Se uma API Railway real, com URL estável, CORS, autenticação e health check estiver disponível, o build receberá `VITE_API_BASE_URL` durante a construção e as interações passarão por testes de ponta a ponta. Caso contrário, a Vercel hospedará apenas a versão de demonstração **estritamente sem escrita e sem painel administrativo público**; CTAs que impliquem envio, publicação, parceria ou revisão serão removidos ou desativados com explicação transparente. Não haverá configuração de URL provisória, segredo no cliente ou simulação que o usuário possa confundir com operação real.

| Cenário confirmado | Ação de implantação |
|---|---|
| API Railway disponível e testada | Configurar a base de API no ambiente de build, restringir CORS à origem publicada, validar autenticação e publicar primeiro em staging. |
| API Railway indisponível | Manter a Vercel como demonstração read-only do Polo Origens, retirar controles dependentes de API e suspender a divulgação como produto funcional. |
| Falha de API após publicação | Mostrar estado de indisponibilidade explícito, não oferecer persistência local enganosa e permitir rollback imediato para a versão estática segura. |

## Fase 4 — Migração controlada de `mvpPilot.ts` para dados persistidos

Somente após o corte de escopo, a autorização e a estratégia de publicação estarem aprovados, o catálogo local será migrado gradualmente para o domínio previsto no blueprint: `cities`, `city_places`, `itineraries` e `place_proximity_relations`. A primeira migração conterá apenas São Raimundo Nonato, Coronel José Dias e seus itens aprovados; não transferirá automaticamente registros de Teresina, litoral ou demais polos.

Será criada uma migration Drizzle revisável, helpers de banco específicos, contracts tRPC de leitura pública somente para conteúdo publicado e contracts administrativos protegidos para a gestão editorial. Os componentes públicos deixarão de importar o catálogo como fonte de verdade e passarão a consumir os contracts tipados; durante a transição, será preservado um fallback de leitura claramente controlado para não quebrar a demonstração. O painel administrativo somente será reativado após funcionar sobre os dados persistidos e sob autorização real.

| Camada | Mudança planejada |
|---|---|
| Banco de dados | Criar e migrar as quatro tabelas do blueprint, com chaves, status de publicação, fontes e relações de proximidade. |
| Back-end | Implementar helpers e procedures tRPC tipadas para leitura pública publicada e escrita administrativa protegida. |
| Front-end | Adaptar a home, detalhes e roteiro de Origens aos queries tRPC, com estados de carregamento, vazio e erro. |
| Administração | Usar somente `adminProcedure`, com auditoria mínima de mudanças e nenhum dado simulado apresentado como persistido. |

## Fase 5 — Validação, staging e produção

A qualidade será medida por testes de autorização, integridade de dados, rotas, acessibilidade e comportamento visual, antes de qualquer divulgação. A publicação seguirá `staging` primeiro e `main`/produção apenas depois da aprovação dos gates. Cada release terá checkpoint e possibilidade de rollback, sem promover mudanças de escopo, segurança e migração de dados em um único deploy sem verificação intermediária.

| Categoria | Casos de teste |
|---|---|
| Autorização | Anônimo e usuário comum não escrevem, não alteram status e não listam rascunhos; administrador autorizado conclui os fluxos. |
| Escopo | A home, o menu, a busca e os CTAs expõem somente Origens; Teresina, Cajueiro da Praia, preço e narrativa estadual não aparecem na versão pública. |
| Imagens | Não há `NO IMAGE AVAILABLE`, URL de mídia quebrada ou área de mídia vazia sem tratamento deliberado em desktop e celular. |
| Dados | A migration é reversível, não duplica registros e preserva referências de fonte; apenas registros publicados são visíveis publicamente. |
| Publicação | Staging e produção respondem com os assets corretos; no cenário com API, health check e operações autorizadas funcionam; no cenário estático, nenhum CTA promete persistência. |
| Acessibilidade e responsividade | Navegação por teclado, foco visível, contraste, leitura por leitor de tela e layouts em 375 px, 400 px e desktop são verificados. |

## Sequência de entregas e dependências

O primeiro checkpoint conterá apenas a correção de autorização, com testes de acesso e sem mudanças cosméticas. O segundo checkpoint entregará o Polo Origens estático, a remoção dos menus e cartões fora de escopo, a retirada de preço e a ausência dos placeholders. O terceiro definirá a publicação Vercel em modo seguro conforme a disponibilidade comprovada da API. O quarto checkpoint introduzirá banco, procedures e painel real, iniciado exclusivamente depois que os três anteriores forem aprovados.

| Ordem | Dependência | Resultado esperado |
|---|---|---|
| 1 | Nenhuma | Escritas e dados editoriais protegidos no servidor. |
| 2 | Segurança concluída | Interface pública reduzida, coerente e sem imagens quebradas. |
| 3 | Escopo público concluído | Vercel não induz o visitante a acreditar em uma API inexistente. |
| 4 | API e banco aprovados | Polo Origens passa do catálogo local para dados persistidos e gerenciáveis. |

## Premissas e riscos abertos

Este plano pressupõe que a definição textual fornecida — Origens formado por São Raimundo Nonato e Coronel José Dias — representa corretamente o documento retificado. O arquivo do documento de autoridade não está presente na cópia restaurada do projeto; quando disponibilizado, ele será confrontado com a matriz de escopo antes da implementação da Fase 2. A inclusão de Coronel José Dias é tratada como alinhamento obrigatório do polo, mas seus textos, pontos e imagens só entrarão após confirmação editorial e fonte verificável.

Há ainda uma dependência externa explícita: a decisão de integrar Railway só poderá ser executada com endpoint real, estratégia de autenticação, configuração de CORS e credenciais definidas fora do repositório. Enquanto esses requisitos não existirem, a versão Vercel deverá permanecer demonstrativa e sem qualquer operação que pareça persistente. A retirada da monetização é deliberada e será revista somente após telemetria persistida, dados de uso e uma decisão comercial documentada.
