# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Publishing (Deployment)

Publishing is done via the **Eitri CLI**. Each mini-app is published independently by bumping its `version` in `eitri-app.conf.js` and updating `versionMessage`:

```bash
# From within a mini-app directory
eitri push-version -m 'Message describing the change'

# Publish to a specific environment
eitri publish -e <ENV_ID>
```

CI/CD (Bitbucket Pipelines) automatically runs `check_and_push.js` on `main`, which detects mini-apps whose local version is greater than the published version and publishes them in order (shared app first, then modules).

## Architecture Overview

This is an **Eitri** mobile app platform project targeting VTEX e-commerce. It consists of six independent mini-apps (each a self-contained module) plus a shared library:

| Directory | Alias | Role |
|---|---|---|
| `shopping-vtex-template-shared` | `shared` | Shared component library, exported via `src/export.js` |
| `shopping-vtex-template-home` | `home` | Home, Categories, Search, Product Catalog views |
| `shopping-vtex-template-pdp` | `pdp` | Product Detail Page |
| `shopping-vtex-template-cart` | `cart` | Cart and checkout entry |
| `shopping-vtex-template-account` | `account` | User profile, login, orders |
| `shopping-vtex-template-checkout` | `checkout` | Checkout flow |

### Key Platform Libraries

- **`eitri-bifrost`** – Eitri runtime bridge (`Eitri.navigation`, `Eitri.notification`, `Eitri.sharedStorage`, `Eitri.getInitializationInfos`, etc.)
- **`eitri-luminus`** – UI component primitives (`View`, `Page`, etc.)
- **`eitri-shopping-vtex-shared`** – VTEX API abstraction (`Vtex.catalog`, `Vtex.searchGraphql`, `Vtex.cms`, `App.tryAutoConfigure`)
- **`eitri-i18n`** – i18n (`useTranslation`, `t()`)

### Mini-App Structure (per module)

```
src/
  views/          # Route-level screens (Home.jsx is always the entry point)
  components/     # UI components, including CmsComponents/ for CMS-driven sections
  services/       # API calls and business logic
  providers/      # React context providers (e.g., LocalCart)
  utils/          # Constants and helpers
  locales/        # i18n translation files
  workers/        # Background web workers (where applicable)
eitri-app.conf.js # Mini-app manifest: version, dependencies, public-key, applicationId
```

### App Configuration

- **`app-config.yaml`** – Declares which mini-apps form the application and the bottom tab navigation structure.
- **`remoteConfig.json`** – Runtime store configuration: VTEX account/host, `appConfigs` (product card style, header logo, status bar, etc.), and `eitriConfig` (bottom nav items, deeplink resolver).

### CMS-Driven Rendering

The Home and Categories views load content from VTEX CMS via `CmsService`. Sections are cached in `Eitri.sharedStorage` for 24 hours and filtered by:
1. Date range (`startDate`/`endDate` fields)
2. Remote config feature flags (`remoteConfigKey`)

CMS section schemas are defined in `_cms/sections.json` and `_cms/content-types.json`. The mapping from CMS section `name` → React component lives in `shopping-vtex-template-home/src/utils/getMappedComponent.js`. To add a new CMS section type, register it in both `sections.json` and `getMappedComponent.js`.

### Shared Library Pattern

`shopping-vtex-template-shared` is a shared Eitri app (marked `shared: true` in `app-config.yaml` and `sharedVersion` in its conf). Other mini-apps import from it as:

```js
import { HeaderCart, ProductCardDefault, Loading, ... } from 'shopping-vtex-template-shared'
```

All public exports are centralized in `shopping-vtex-template-shared/src/export.js`.

### Product Search

Products are fetched via two strategies in `ProductService.js`:
- **GraphQL** (`getProductsService` / `getProductsFacetsService`) – uses `Vtex.searchGraphql` (preferred)
- **REST** (`getProductsServiceRest` / `getProductsFacetsServiceRest`) – uses `Vtex.catalog`

Pagination uses `from`/`to` with `PAGE_SIZE = 12`.

### Mini-App Startup Pattern

Every mini-app's `Home.jsx` follows this pattern:
1. Call `startConfigure()` (from `AppService.js`) which calls `App.tryAutoConfigure`
2. Retrieve initialization params via `Eitri.getInitializationInfos()` (handles deeplinks, tab index, route state)
3. Register `Eitri.navigation.setOnResumeListener` to refresh state when the app resumes

### Versioning

When releasing changes to a mini-app, bump the `version` field in `eitri-app.conf.js` following semver, and update `versionMessage` with a human-readable description of the change. The shared app must be published before dependent mini-apps.
