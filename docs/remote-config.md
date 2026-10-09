# Remote Config

O Remote Config da aplicação fica no [Eitri Console](https://console.eitri.tech). Ele vem pré-preenchido com as configurações que o template usa. Este documento lista cada configuração lida pelo template, para que serve e onde é usada.

Algumas configurações não são lidas pelo código do template. Elas são consumidas pela lib [`eitri-shopping-vtex-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-vtex-shared) ou pela própria plataforma Eitri, e estão marcadas na coluna **Onde é usado**.

## `ecommerceProvider`

| Campo | Tipo | Descrição | Onde é usado |
| --- | --- | --- | --- |
| `ecommerceProvider` | string | Plataforma de e-commerce. Para este template: `"VTEX"` | Lib [`eitri-shopping-vtex-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-vtex-shared) (`App.tryAutoConfigure()`, chamado ao iniciar cada app) |

## `providerInfo`

Dados de conexão com a loja VTEX.

| Campo | Obrigatório | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- | --- |
| `account` | Sim | string | — | Conta VTEX da loja | Lib [`eitri-shopping-vtex-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-vtex-shared) |
| `host` | Sim | string (URL) | — | URL da loja. Também é a base do link de compartilhamento do produto | Lib [`eitri-shopping-vtex-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-vtex-shared); `pdp`: `components/Share/Share.jsx` |
| `faststore` | Sim | string | — | Identificador da loja no CMS VTEX, usado para buscar as páginas de conteúdo (Home, landing pages) e os badges | `home` e `pdp`: `services/CmsService.js`; `shared`: `services/BadgesService.js` |
| `vtexCmsUrl` | Sim | string (URL) | — | URL do CMS VTEX | Lib [`eitri-shopping-vtex-shared`](https://github.com/eitri-tech/eitri-shopping-services-shared/tree/main/eitri-shopping-vtex-shared) |
| `searchOptions.legacySearch` | Não | boolean | `false` | Usa o fluxo de busca e de árvore de categorias legado | `home`: `components/SearchInput`, `components/CmsComponents/CategoryTree`; `pdp`: `components/SearchInput` |

## `appConfigs`

Aparência e comportamento do app.

### Header

| Campo | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- |
| `headerLogo` | string (URL de imagem) | sem logo | Logo exibido no header principal | `shared`: `components/Header/HeaderLogo.jsx` |
| `headerScrollEffect` | boolean | `true` | Com `false`, desliga o efeito de esconder o header ao rolar a tela. Só tem efeito nos headers que habilitam esse efeito no código | `shared`: `components/Header/HeaderContentWrapper.jsx` |

### Card de produto

| Campo | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- |
| `productCard.showListPrice` | boolean | `true` | Exibe o preço "de" (preço de lista) no card | `home`, `pdp` e `account`: `components/ProductCard/ProductCard.jsx` |
| `productCard.productVideoTag` | string | sem vídeo | Nome da especificação do produto que contém a URL do vídeo exibido no card | `home`, `pdp` e `account`: `components/ProductCard/productCard.utils.js` |
| `productCardImageAspectRatio` | string (`"L:A"` ou `"LxA"`, ex.: `"3:4"`) | imagem original | Proporção da imagem do card de produto | `shared`: `components/ProductCard/ProductCardFullImage.jsx` |
| `productCardImageAvoidResize` | boolean | `false` | Com `true`, usa a imagem da VTEX no tamanho original, sem redimensionar pela URL | `shared`: `components/ProductCard/ProductCardFullImage.jsx` |

### PDP e assinaturas

| Campo | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- |
| `pdp.hiddenVariations` | string[] | `[]` | Nomes das variações de SKU que não aparecem no seletor | `pdp`: `components/SkuSelector/SkuSelector.jsx` |
| `pdp.hiddenProperties` | string[] | nenhuma | Nomes das especificações que não aparecem na aba de informações do produto | `pdp`: `components/Description/Information.jsx` |
| `pdp.subscription` | objeto | — | Quando presente, a área do cliente exibe o botão "Minhas assinaturas" | `account`: `views/Home.jsx` |
| `pdp.subscription.assemblyIdSubscription` | string | — | ID da assembly option de assinatura na VTEX, usado para obter as frequências disponíveis | `account`: `utils/subscription.js` |

### Carrinho e checkout

| Campo | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- |
| `minimumOrderValueInCents` | number (centavos) | — | Valor mínimo do pedido para liberar o checkout. Use `0` para não ter valor mínimo | `cart`: `utils/minimumOrderValue.js` |
| `checkout.recaptchaKey` | string | sem reCAPTCHA | Site key do reCAPTCHA usada no fechamento do pedido e no cadastro de cartão | `checkout`: `views/CheckoutReview.jsx`; `account`: `views/AddCardForm.jsx` |
| `checkout.paymentSystemDisplayOrder` | string[] | ordem da VTEX | Ordem de exibição dos meios de pagamento, pelo `groupName` da VTEX (ex.: `creditCardPaymentGroup`, `instantPaymentPaymentGroup`, `bankInvoicePaymentGroup`). Grupos fora da lista aparecem no final | `checkout`: `components/Methods/PaymentMethods.jsx` |
| `externalPayments` | array de `{ externalGroupName, name, imageUrl, description }` | `[]` | Meios de pagamento externos. `externalGroupName` deve ser igual ao `groupName` da VTEX; `name`, `imageUrl` e `description` definem como o meio aparece no checkout | `checkout`: `components/PaymentsGroups/ImplementationInterface.jsx` |
| `autoTriggerGAEvents` | boolean | `true` | Com `true`, a lib dispara automaticamente os eventos do Google Analytics no checkout. Com `false`, o template dispara os eventos | `checkout`: `services/AppService.js`, `services/Tracking.js` |

### Conta

| Campo | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- |
| `deleteAccountUrl` | string (URL) | botão oculto | Link externo para a exclusão de conta. Sem esse campo, o botão de excluir conta não aparece | `account`: `views/EditProfile.jsx` |

## `storePreferences`

| Campo | Tipo | Default | Descrição | Onde é usado |
| --- | --- | --- | --- | --- |
| `locale` | string (ex.: `pt-BR`) | `pt-BR` | Locale usado na formatação de preços | `home`, `pdp` e `account`: `utils/utils.js` |
| `currencyCode` | string (ex.: `BRL`) | `BRL` | Moeda usada na formatação de preços | `home`, `pdp` e `account`: `utils/utils.js` |

## `eitriConfig`

Configurações de navegação consumidas pela plataforma Eitri (o código do template não lê esses campos).

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `mainApp` | string | Slug do Eitri-App aberto ao iniciar o app |
| `renderFakeBottomBar` | boolean | Renderiza uma bottom bar simulada |
| `bottomNavItems[]` | array | Itens da bottom navigation. Cada item tem `slug` (Eitri-App aberto) e `initParams` (parâmetros de inicialização, como `tabIndex` e `route`) |

## `deeplinkResolver`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `slug` | string | Slug do Eitri-App que resolve os deep links. Consumido pela plataforma Eitri |

## Firebase Remote Config no CMS

Além do Remote Config da aplicação, a Home usa o Firebase Remote Config para exibir ou ocultar conteúdo do CMS. Seções do CMS (e imagens de um `MultipleImageBanner`) podem ter o campo `remoteConfigKey`. Ao carregar a página, o template consulta cada chave no Firebase: o conteúdo só aparece se o valor for `true`, e chaves ausentes contam como `false`.

Implementação: `home`: `services/CmsService.js` (`filterRemoteConfigContent`) e `services/RemoteConfigService.js`.
