# Pearl Bank customer app

Pearl Bank's customer-facing web application: one Angular workspace containing the
application shell plus separately owned feature areas (onboarding, accounts, payments,
statements, profile, settings) and the shared libraries they build on.

The app is deliberately small. Feature areas use in-memory demo data — there is no backend,
no real authentication and no persistence.

**Current framework version: Angular 15** (`@angular/core` 15.2, Angular Material 15.2 (MDC components),
TypeScript 4.9). Node 16 or 18 is expected (see `.nvmrc`).

## Install

```bash
npm ci
```

## Run

```bash
npm start           # ng serve pearl-bank -> http://localhost:4200
```

## Build, lint and test

```bash
npm run ci          # lint + production build + full unit-test run (what CI runs)

npm run lint        # every project
npm run build       # production build of the shell (compiles all feature libraries)
npm test            # all unit tests, headless Chrome, single run
```

Each library can be validated on its own, which is how feature teams verify changes
without waiting on unrelated work:

```bash
npm run test:accounts
npm run lint:accounts
npm run test:kyc-flow
npm run test:shared-design-system
# ... test:<project> / lint:<project> for every project in angular.json
```

## Layout

```
src/                       application shell (routing, toolbar) — @pearl-bank/web-platform
projects/
  shared-design-system/    Material-based UI kit + Sass theme   — Design Systems
  shared-auth/             session + route guard                — Identity
  shared-analytics/        event tracking                       — Digital Analytics
  kyc-flow/                identity verification               — Digital Onboarding
  accounts/                balances & transactions             — Accounts
  statements/              statement list                       — Accounts
  payments/                pay anyone                          — Payments
  scheduled-payments/      recurring payments                  — Payments
  profile/                 contact details                     — Customer Profile
  account-settings/        alerts & notifications              — Customer Profile
docs/architecture.md       module map and dependency graph
.github/CODEOWNERS         ownership boundaries
```

Libraries are consumed through TypeScript path aliases (`@pearl/<name>`, see
`tsconfig.json`) and compiled as part of the shell build; they are not published
separately. Each project has its own `package.json` with team metadata, `README.md`,
ESLint config and `test:`/`lint:` npm scripts.
