# Demo Shop (Vue 3 + Vite + TypeScript)

An Amazon-style product detail demo with separate PC and mobile views, shared UI components, and a Pinia store.

## Routes

- `/#/pc/detail?id=1` — PC product detail
- `/#/pc/cart` — PC cart
- `/#/mobile/detail?id=1` — Mobile product detail
- `/#/mobile/cart` — Mobile cart

## Scripts

```bash
npm install
npm run dev          # Start Vite (port 5173)
npm run type-check   # vue-tsc --noEmit
npm run test:unit    # Jest unit tests
npm run test:e2e     # Cypress UI runner
npm run test:e2e:run # Cypress headless
```

## Features

- Mixed media gallery: images + video, with ▶ badge on video thumbnails (`UiImageGallery`)
- Picture-in-picture: when a playing video scrolls out of viewport, it floats as a mini player (bottom-right on PC, above the bottom bar on mobile); scrolling back syncs playback time and dismisses the floating window. The floating window can be closed manually.
- Three SKU dimensions (Size / Color / Capacity); switching variants live-updates price and stock via `querySku`
- Quantity input clamped to `[1, stock]`; sold-out SKUs disable purchase buttons (`UiQuantity`)
- Add-to-cart shows a Toast and updates the cart badge
- Cart supports two ways to remove an item: explicit "Remove" button (with confirm) or decreasing quantity to 0
- Shared UI components: `UiButton` `UiAlert` `UiToast` `UiQuantity` `UiImageGallery` `UiSkuSelector`
- Lazy-loaded images via the global `v-lazy` directive (IntersectionObserver-based, with placeholder SVG and fade-in)
- Full TypeScript: shared types in `src/types.ts`; stores, router, views are typed
- Tracking directive `v-track` with `click` / `expose` / `both` triggers, object or string payload:
  ```html
  <UiButton v-track="{ event: 'add_to_cart_click', params: { id }, trigger: 'click' }" />
  <div v-track="{ event: 'detail_section_expose', params: { idx: 1 }, trigger: 'expose' }" />
  <a v-track="'view_cart'" />
  ```
  Default reporter writes to `window.__track__` and `console.log`; replace via `setTrackReporter()` in production.
- Static product detail content (highlights, specs, multi-section copy with images): [`ProductDetailContent.vue`](src/components/ProductDetailContent.vue), shared by PC and mobile.
- Axios-based API layer:
  - [`src/api/request.ts`](src/api/request.ts) — axios instance with request interceptor (token + traceId) and response interceptor (unwraps `{code,data,message}`, global toast for `401/403/404/429/5xx`, dedicated handling for timeout and network errors, throws `ApiError`)
  - [`src/api/mockAdapter.ts`](src/api/mockAdapter.ts) — custom axios adapter; intercepts `/api/*` and returns mock data with simulated 120–320 ms latency
  - [`src/api/product.ts`](src/api/product.ts) — `fetchProduct`, `querySku`, `addToCart`
  - Detail pages have explicit `loading` / `fetchError` states; SKU switching triggers a fresh `querySku` call

## Project layout

```
src/
  api/             Axios instance, mock adapter, business APIs
  components/ui/   Shared UI components
  components/      Shared composite components
  views/pc/        PC views
  views/mobile/    Mobile views
  store/           Pinia stores (cart / toast)
  mock/            Product + SKU data
  router/          Routes
  directives/      Custom directives (v-lazy, v-track)
  types.ts         Shared TypeScript types
tests/unit/        Jest unit tests
cypress/e2e/       Cypress end-to-end tests
```
