# Architecture

## Overview

Pearl Bank's customer app is a single Angular workspace. The shell in `src/` owns routing
and the toolbar and lazy-loads one feature library per route. Feature libraries never import
each other except where a product dependency genuinely exists (scheduled payments builds on
payments; account settings builds on profile). Cross-cutting concerns live in three shared
libraries.

All projects share one `package.json`, one Angular/Material/TypeScript version and one
Material theme, so framework upgrades are workspace-wide events that touch every team.

## Modules

| Project | Alias | Owner | Purpose |
| --- | --- | --- | --- |
| `src/` (pearl-bank) | – | Web Platform | Shell: toolbar, routes, global styles |
| `projects/shared-design-system` | `@pearl/shared-design-system` | Design Systems | `PbDesignSystemModule`: button, card, page header, status chip, money pipe; Sass tokens and Material theme |
| `projects/shared-auth` | `@pearl/shared-auth` | Identity | `AuthSessionService`, `AuthGuard`, session model |
| `projects/shared-analytics` | `@pearl/shared-analytics` | Digital Analytics | `AnalyticsService` event buffer |
| `projects/kyc-flow` | `@pearl/kyc-flow` | Digital Onboarding | 3-step identity verification |
| `projects/accounts` | `@pearl/accounts` | Accounts | Balances, transaction ledger |
| `projects/statements` | `@pearl/statements` | Accounts | Statement list |
| `projects/payments` | `@pearl/payments` | Payments | Pay-anyone flow, payment drafts |
| `projects/scheduled-payments` | `@pearl/scheduled-payments` | Payments | Recurring payments |
| `projects/profile` | `@pearl/profile` | Customer Profile | Contact details, `ProfileFieldComponent` |
| `projects/account-settings` | `@pearl/account-settings` | Customer Profile | Alerts and notification preferences |

## Dependency graph

Arrows point from a library to the libraries it imports.

```
                    shared-design-system   shared-auth   shared-analytics
                      ▲  ▲  ▲  ▲  ▲  ▲        ▲  ▲  ▲       ▲   ▲   ▲
                      │  │  │  │  │  │        │  │  │       │   │   │
 kyc-flow ────────────┘  │  │  │  │  └────────┘  │  │       │   │   │
 accounts ───────────────┘  │  │  │  ────────────┘  │  ─────┘   │   │
 payments ──────────────────┘  │  │  ───────────────┘  ─────────┘   │
 statements ───────────────────┘  │                                 │
 profile ─────────────────────────┘  ───────────────────────────────┘

 scheduled-payments ──▶ payments (+ shared-design-system)
 account-settings   ──▶ profile  (+ shared-design-system)
```

In list form:

- `shared-design-system` ← kyc-flow, accounts, payments, statements, profile, scheduled-payments, account-settings, shell
- `shared-auth` ← kyc-flow, accounts, payments, shell
- `shared-analytics` ← accounts, payments, profile, shell
- `payments` ← scheduled-payments
- `profile` ← account-settings

Every feature also imports Angular Material directly for form controls (inputs, selects,
checkboxes, radios, tables, lists, slide toggles) and its tests use the Material CDK test
harnesses. Component styles pull Sass tokens and Material theming helpers from
`projects/shared-design-system/src/styles` via `stylePreprocessorOptions.includePaths`.

## Ownership boundaries

Ownership is expressed three ways and should stay consistent:

1. Directory per project under `projects/`.
2. `pearl.team` metadata in each project's `package.json`.
3. `.github/CODEOWNERS`.

Shared libraries are owned by platform teams; changes to them are expected to be validated
against every consumer (`npm run ci`). Feature teams validate with `npm run test:<project>`
and `npm run lint:<project>`.

## Build and test model

- `ng build pearl-bank` compiles the shell and every library it lazy-loads.
- `ng test <project>` compiles only that project's specs (plus what they import).
- `ng test pearl-bank` runs every spec in the workspace (`src/test.ts` loads `projects/**/*.spec.ts`).
- `ng lint <project>` uses the project-local `.eslintrc.json`.
