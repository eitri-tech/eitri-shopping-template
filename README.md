# Eitri Shopping Template — VTEX

Template de e-commerce mobile-first para VTEX, construído com o ecossistema Eitri (Luminus UI + Bifrost).

## Eitri-Apps

| App | Descrição |
| --- | --- |
| `shopping-vtex-template-shared` | Shared app com componentes, serviços e contextos reutilizáveis entre os demais apps |
| `shopping-vtex-template-home` | Vitrine principal: home, categorias, landing pages, catálogo de produtos e busca |
| `shopping-vtex-template-pdp` | Página de detalhe do produto (Product Detail Page) |
| `shopping-vtex-template-cart` | Carrinho de compras |
| `shopping-vtex-template-checkout` | Checkout: dados pessoais, endereço, frete, pagamento e conclusão do pedido |
| `shopping-vtex-template-account` | Área do cliente: login, cadastro, perfil, pedidos, endereços, cartões, assinaturas e wishlist |

## Como rodar

Pré-requisito: [`eitri-cli`](https://www.npmjs.com/package/eitri-cli) instalado e autenticado.

```bash
npm install -g eitri-cli
eitri login
```

### App completo (recomendado)

Na raiz do repositório, execute:

```bash
eitri app start
```

Esse comando sobe o app completo, com todos os Eitri-Apps listados em [`app-config.yaml`](app-config.yaml) e a simulação da bottom tab definida no mesmo arquivo.

### Um Eitri-App isolado

Também é possível rodar um único Eitri-App. Acesse o diretório dele e execute:

```bash
cd shopping-vtex-template-home
eitri start
```

### Publicação

Para publicar uma nova versão, incremente o `version` no `eitri-app.conf.js` do app e faça push para a `main`. A CI cuida da publicação (veja [docs/ci.md](docs/ci.md)).

## Configuração

### Projeto

- [`app-config.yaml`](app-config.yaml): lista os Eitri-Apps do projeto, a aplicação Eitri (`application-id`) e a simulação da bottom tab usada no desenvolvimento.
- `eitri-app.conf.js` (um por app): nome, slug, versão, IDs do Eitri-App, da aplicação e da organização, e dependências.

### Remote Config

As configurações da loja ficam no Remote Config da aplicação, acessível pelo [Eitri Console](https://console.eitri.tech). Ele já vem com diversas configurações prontas para uso pelo template: dados de conexão com a plataforma de e-commerce, aparência do app (logo, cores, header), comportamento de componentes, bottom navigation e preferências da loja.

A descrição de cada configuração está em [docs/remote-config.md](docs/remote-config.md).

### CI

Para a publicação automática funcionar, configure os secrets `EITRI_CLI_CLIENT_ID`, `EITRI_CLI_CLIENT_SECRET` e, opcionalmente, `EITRI_DEV_ENV_ID`. Detalhes em [docs/ci.md](docs/ci.md).

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [CI — Publicação automática de versões](docs/ci.md) | Como a pipeline (GitHub Actions e Bitbucket Pipelines) verifica e publica as versões dos Eitri-Apps, e o que é preciso configurar para ela funcionar |
| [Remote Config](docs/remote-config.md) | Todas as configurações do Remote Config lidas pelo template, com tipo, default e onde cada uma é usada |
