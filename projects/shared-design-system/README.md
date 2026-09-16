# @pearl/shared-design-system

Owned by **Design Systems**.

The Pearl Bank design system wraps Angular Material (v15, MDC-based components) behind `pb-*` components
(`pb-button`, `pb-card`, `pb-page-header`, `pb-status-chip`) and the `pbMoney` pipe,
and owns the single Material theme (`src/styles/_theme.scss`) and design tokens
(`src/styles/_tokens.scss`).

Feature stylesheets reach Material's Sass API through `@use 'mat';` (see
`src/styles/_mat.scss`); `projects/shared-design-system/src/styles` is on the
workspace `includePaths`.

```bash
npm run test:shared-design-system
npm run lint:shared-design-system
```
