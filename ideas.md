# Direção de design — Guia Bora Piauí

## Abordagens consideradas

### 1. Caderno de Campo

**Tema:** Um guia editorial inspirado em anotações de expedição e cartografia local, com calor humano e forte legibilidade.

**Probabilidade:** 0.07

### 2. Sala de Operações

**Tema:** Um painel técnico de decisão, estruturado por métricas, checklists e estados de prontidão.

**Probabilidade:** 0.03

### 3. Biblioteca de Produto

**Tema:** Um repositório calmo e modular, com navegação densa e aparência de documentação digital.

**Probabilidade:** 0.09

## Direção escolhida — Caderno de Campo

### Movimento de design

**Editorial cartográfico contemporâneo**: a clareza de um manual de campo encontra o ritmo visual de mapas e cadernos de viagem. O site deve parecer uma ferramenta de alinhamento de equipe, não uma landing page genérica.

### Princípios centrais

1. **Orientação antes de ornamentação:** cada bloco responde a uma decisão concreta do time.
2. **Camadas de leitura:** títulos fortes, metadados discretos e detalhes expansíveis apoiam leitura rápida ou aprofundada.
3. **Território como estrutura:** linhas de rota, marcas de coordenada e divisões topográficas organizam o conteúdo.
4. **Evidência visível:** estados, metas e critérios são mostrados como instrumentos de trabalho, não como marketing.

### Filosofia de cor

O fundo areia muito claro transmite materialidade e repouso visual. Verde profundo representa orientação e confiança; o ocre solar sinaliza decisões, prioridades e movimento. Azul-petróleo é reservado a links, rotas e elementos interativos. A paleta evita a estética corporativa azul-padrão e remete discretamente à paisagem semiárida.

### Paradigma de layout

Uma **coluna de navegação fixa** funciona como índice de campo no desktop; o conteúdo avança em uma trilha vertical de seções assimétricas. Cada seção alterna entre texto editorial, quadros de decisão e matrizes de teste. No celular, a navegação se transforma em um índice compacto no topo.

### Elementos de assinatura

1. Um monograma circular “BP” com linhas de coordenada.
2. Trilhas pontilhadas e microcoordenadas como divisores e marcadores de progresso.
3. Etiquetas de caderno de campo: `DECISÃO`, `TESTAR`, `PRONTO`, `ATENÇÃO`.

### Filosofia de interação

Interações devem reforçar navegação e foco: índice destaca a seção ativa, cartões expandem detalhes apenas quando necessário e checklists permitem marcar uma leitura local durante a sessão. Não há gamificação nem efeitos decorativos sem função.

### Animação

Usar transições rápidas de opacidade e deslocamento leve (160–220 ms) para o índice, os detalhes expansíveis e os estados de botão. A animação deve respeitar `prefers-reduced-motion`. Evitar animações contínuas, parallax e transições que ocultem o conteúdo.

### Sistema tipográfico

**DM Serif Display** para títulos e momentos de decisão; **Manrope** para texto, navegação e componentes. Títulos mantêm alto contraste e poucas palavras; números, tags e metadados usam caixa alta com espaçamento de letras controlado.

### Essência de marca

**Posicionamento:** um guia prático para a equipe transformar o Bora Piauí em uma experiência turística digital clara, confiável e validada com usuários.

**Personalidade:** territorial, criteriosa, acolhedora.

### Voz da marca

Headlines são diretas e orientadas à decisão; CTAs descrevem a ação com precisão. Microcopy evita abstrações e explica o próximo passo.

Exemplos: “Antes de expandir, valide uma cidade.” e “Faça a rota funcionar antes de adicionar recursos.”

### Wordmark e símbolo

O símbolo combina as iniciais **BP** dentro de um círculo de coordenadas, com um traço de rota aberto no quadrante inferior. O wordmark usa Manrope em caixa baixa, com espaçamento levemente ampliado.

### Cor de assinatura

**Verde Rota — `#174C45`**.

## Style Decisions

- O monograma BP aparece como um selo circular de coordenadas, com rota aberta, em pontos de orientação do guia.
- Ocre é reservado para decisões, prioridades e movimento; petróleo identifica rotas, links e estados ativos.
- Painéis seguem linguagem de instrumento de campo: folhas planas, tabelas pautadas, carimbos e checklists, sem profundidade genérica de SaaS.
- Linhas de rota, microcoordenadas e divisores cartográficos organizam a progressão das seções, não apenas decoram o conteúdo.
