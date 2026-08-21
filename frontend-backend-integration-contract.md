# Contrato de integração — Front-end e Back-end do Bora Piauí

## Finalidade e escopo

Este documento organiza a futura integração do Bora Piauí sem deslocar a responsabilidade da experiência de interface para a frente de back-end. O front-end permanece responsável por rotas, composição visual, interações, acessibilidade, filtros locais, estados de carregamento, ausência de resultado e falha. O back-end será responsável por disponibilizar dados válidos, regras de publicação, persistência, autenticação e autorização quando aplicáveis.

> **Princípio de integração:** a interface consome contratos estáveis; ela não deve depender de detalhes de banco, rotinas internas de curadoria ou regras de infraestrutura.

## Inventário de telas e fonte de dados esperada

| Rota ou fluxo | Responsabilidade de front-end | Recurso a integrar | Estado atual de experiência |
|---|---|---|---|
| `/` — Atlas | Descoberta, filtros, cards, mapa, destino ativo e links de detalhes | lista resumida de destinos | A interface já mantém filtros, marcador ativo e feedback acessível. |
| `/destinos/:slug` | Ficha, galeria, contexto, fonte e condições de visitação | detalhe de destino por `slug` | A página já prevê carregamento, não encontrado, galeria vazia e ausência de informação operacional. |
| `/patrimonios` | Leitura editorial, mapa e navegação territorial | conteúdos patrimoniais e referências geográficas | A camada de apresentação deve continuar independente da forma de armazenamento. |
| `/sabores` | Galeria, filtro por região e leitura editorial | itens de sabores, imagens e créditos | O filtro e a galeria devem funcionar com lista vazia e imagem ausente. |
| `/dados` | Visualização e contexto de indicadores | séries e metadados de fonte | A interface deve exibir período, unidade e origem antes de qualquer gráfico. |
| `/agenda` | Filtros, cards e links de fonte | eventos publicados | A tela já possui estados de carregamento, erro e nenhuma ocorrência para a seleção. |
| `/parceiros` | Formulário, consentimento e confirmação | criação de proposta | A confirmação de envio não substitui aprovação editorial. |
| `/admin/*` | Ferramentas demonstrativas e feedback de curadoria | recursos editoriais autenticados, quando definidos | A autenticação e a autorização não pertencem ao escopo do cliente nesta tarefa. |

## Fronteiras de responsabilidade

| Camada | Deve conter | Não deve conter |
|---|---|---|
| Componentes e páginas | Layout, tipografia, navegação, controles, acessibilidade, mensagens de estado e transformação de dados já tipados para exibição | Consultas de banco, políticas de acesso, credenciais, decisões de publicação ou lógica de exportação de dados sensíveis. |
| Adaptadores de dados do cliente | Chamada ao contrato acordado, normalização mínima de datas e conversão para o modelo de visualização | Regras de negócio duplicadas, criação de campos derivados não documentados ou dependência de estrutura de tabela. |
| Back-end | Persistência, validação de entrada, autorização, curadoria, URLs de mídia confiáveis e contratos de erro | Decisões de layout, rótulos visuais, foco, animações ou comportamento responsivo. |

## Modelos mínimos de dados

Os campos abaixo representam o mínimo necessário para a interface. O back-end pode fornecer atributos adicionais, desde que os campos obrigatórios permaneçam estáveis e tipados.

### Destino resumido — Atlas, lista e mapa

```ts
type DestinationSummary = {
  id: string;
  slug: string;
  title: string;
  municipality: string;
  pole: string;
  category: string;
  summary: string;
  mapQuery?: string;
  coordinates?: { lat: number; lng: number };
  coverImage?: {
    url: string;
    alt: string;
    credit?: string;
  };
  accent?: string;
  source: { name: string; url: string; referenceDate?: string };
  publicationStatus: "published";
};
```

O front-end usa `id` para estados ativos, `slug` para navegação, `coordinates` quando disponível e `mapQuery` apenas como alternativa para geocodificação. Todo item retornado para o atlas precisa ter `publicationStatus: "published"`; itens em rascunho não devem chegar à experiência pública.

### Detalhe de destino — ficha individual

```ts
type DestinationDetail = DestinationSummary & {
  description: string;
  routeUrl?: string;
  visitNotes?: string;
  operationalStatus: "confirmed" | "verify" | "unavailable";
  hours?: string;
  pricing?: string;
  accessInfo?: string;
  contactInfo?: string;
  operationalSource?: { name: string; url: string; verifiedAt?: string };
  images: Array<{
    id: string;
    url: string;
    alt: string;
    caption?: string;
    credit?: string;
    order: number;
  }>;
};
```

O estado `"verify"` é a escolha segura quando a operação não tiver confirmação recente. Campos operacionais ausentes devem ser tratados pela interface como informação não publicada, e nunca como valor presumido.

### Evento cultural — Agenda

```ts
type CulturalEvent = {
  id: string;
  title: string;
  city: string;
  category: string;
  startsAt: string; // ISO 8601 em UTC
  endsAt?: string | null;
  venue: string;
  summary: string;
  source: { name: string; url: string };
  publicationStatus: "published";
};
```

O back-end deve fornecer datas em UTC no padrão ISO 8601. A interface converterá a apresentação para `pt-BR` no fuso do visitante, preservando o valor original em trânsito.

### Proposta de parceiro — fluxo demonstrativo

```ts
type PartnerProposalInput = {
  businessName: string;
  city: string;
  category: string;
  phone?: string;
  address?: string;
  openingHours?: string;
  description?: string;
  acceptedTerms: boolean;
};

type PartnerProposalReceipt = {
  id: string;
  editorialStatus: "received" | "under_review" | "approved" | "declined";
  createdAt: string; // ISO 8601 em UTC
};
```

A resposta pública de envio deve retornar somente o recibo necessário para a confirmação. Dados pessoais não devem ser devolvidos à lista pública, usados em mensagens de erro ou incluídos em interfaces abertas.

## Operações e comportamentos de interface

| Necessidade da interface | Operação esperada | Sucesso | Falha ou ausência |
|---|---|---|---|
| Atlas e mapa | `listDestinations({ pole?, category? })` | Lista de itens publicados; o primeiro item elegível pode se tornar ativo | Sem resultados, manter o mapa e explicar a seleção vazia; em falha, oferecer tentativa novamente. |
| Ficha | `getDestinationBySlug({ slug })` | Detalhe completo e galeria ordenada | `NOT_FOUND` exibe rota de retorno; demais falhas mostram indisponibilidade temporária. |
| Agenda | `listPublishedEvents({ city?, category?, month? })` | Eventos publicados por período | Sem eventos, preservar filtros e permitir limpá-los. |
| Proposta | `submitPartnerProposal(input)` | Recibo de recebimento com estado editorial inicial | Erro de validação deve identificar o campo, sem perder os dados não sensíveis do formulário. |
| Administração futura | Operações editoriais autenticadas a definir | Retorno com recurso atualizado e `updatedAt` | `UNAUTHORIZED` e `FORBIDDEN` devem ser distinguíveis para que o cliente apresente a orientação correta. |

## Estados obrigatórios do front-end

Cada consumo de dados deverá ter estados previsíveis. Durante o carregamento, a estrutura visual deve permanecer estável com esqueletos ou texto de progresso. Quando a consulta não retornar dados, a tela deve explicar a ausência conforme o contexto e oferecer uma ação de recuperação quando houver filtros. Em erro recuperável, deve haver mensagem clara e uma tentativa novamente; em `NOT_FOUND`, a interface deve orientar a volta ao atlas. Os links externos exigem URL válida e rótulo que identifique a fonte.

## Regras de compatibilidade e handoff

| Item | Regra acordada |
|---|---|
| Identificadores | `id` é imutável; `slug` é único e compatível com URL. Alterar um slug requer redirecionamento ou migração combinada. |
| Datas | Todas as datas de trânsito usam ISO 8601 em UTC. O cliente é responsável pela formatação local. |
| Mídia | URLs devem ser públicas ou acessíveis pelo mecanismo autenticado definido; cada imagem deve ter texto alternativo e crédito quando aplicável. |
| Erros | O contrato deve diferenciar `VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN` e `INTERNAL_ERROR`. |
| Paginação | Listas que puderem crescer devem prever `cursor` e `nextCursor`, mesmo que o front-end inicialmente apresente poucos itens. |
| Versão | Mudanças incompatíveis exigem nova versão de contrato ou período de compatibilidade. |

## Checklist de integração conjunta

| Verificação | Responsável primário | Critério de aceite |
|---|---|---|
| Modelos tipados | Front-end e back-end | Os tipos do contrato cobrem todos os campos usados nas telas, sem conversões implícitas. |
| Dados publicados | Back-end | O atlas e a agenda pública não recebem rascunhos ou registros sem fonte exigida. |
| Estados de interface | Front-end | Carregamento, vazio, erro e não encontrado são testados em desktop e 375 px. |
| Mapa | Front-end e back-end | Cada destino mapeável tem coordenadas ou consulta geocodificável; marcador, card e ficha mantêm o mesmo `id`. |
| Acessibilidade | Front-end | Todos os controles são operáveis por teclado e toque, com foco visível e rótulos disponíveis. |
| Segurança | Back-end | Ações editoriais dependem de autenticação e autorização; dados pessoais não vazam para rotas públicas. |

## Próxima sequência de trabalho

O front-end poderá continuar recebendo refinamentos visuais e de jornada sem aguardar o back-end. Antes da primeira conexão, as duas frentes devem revisar este documento, confirmar os tipos finais e escolher um ambiente de homologação. A substituição dos dados demonstrativos deve ocorrer por recurso, começando por destinos e detalhe de destino, depois agenda e, por último, parceiros e ferramentas editoriais.
