# Angular 15 Migration Baseline

Integration branch: `checkpoint-angular-15-integration` (from `main`).
This is step one of the Angular 14 → 18 programme; each later major repeats the same model.

| | Before (`main`) | After (this branch) |
| --- | --- | --- |
| `@angular/core` / CLI | 14.3 / 14.2 | 15.2.10 / 15.2.11 |
| `@angular/material` + CDK | 14.2 (legacy components) | 15.2.9 (**MDC components, not `legacy-*`**) |
| TypeScript | 4.7 | 4.9 |
| `@angular-eslint` | 14.4 | 15.2 |
| Node | 16 | 16 (unchanged; Angular 15 supports 14.20 / 16.13 / 18.10+) |

Decision: the Material 15 schematic offers to keep the old components via `@angular/material/legacy-*`
imports. We rejected that. Legacy components are deleted in Angular 17, so taking MDC now avoids a
second Material migration two majors from here. This is what makes the design system a Wave 0 blocker.

## CI / build / test state

`npm run ci` = `lint` + `build` + `test`.

| Command | `main` (A14) | This branch (A15, post Wave 0) |
| --- | --- | --- |
| `npm run lint` (all 10 projects) | pass | **pass** |
| `npm run build` (shell + all libraries) | pass | **fail** — feature-owned TS/Sass errors only (see below) |
| `npm test` (all 30 specs) | pass (30/30) | **fail at compile** — same feature errors; 0 specs execute |
| `test:shared-design-system` | pass | **pass** (5/5) |
| `test:shared-auth` | pass | **pass** (3/3) |
| `test:shared-analytics` | pass | **pass** (1/1) |
| `test:profile` | pass | **pass** (1/1) |
| `test:account-settings` | pass | **pass** (2/2) |
| `test:kyc-flow` | pass | fail (compile) → **pass** (5/5) after `checkpoint-angular-15-kyc-flow` |
| `test:accounts` | pass | fail (compile) |
| `test:payments` | pass | fail (compile) |
| `test:scheduled-payments` | pass | fail (compile — inherits `payments`) |
| `test:statements` | pass | fail (1 spec of 2) |

Because the shell build compiles every library, the root `build`/`test` stay red until every Wave 1/2
unit has landed. Per-project `test:<p>` / `lint:<p>` are therefore the unit of comparison for feature
branches.

## Known remaining failures (12, in 4 feature projects)

| Category | Where | Count | Cause |
| --- | --- | --- | --- |
| TS 4.8+ unconstrained generics (`T` no longer assignable to `{}`/`object`) | `kyc-flow/kyc-state.ts` (3), `accounts/transaction-grouping.ts` (3), `accounts/accounts.service.ts` (1), `payments/payment-draft.ts` (2) | 9 | `Object.assign(entity: T, …)` / `key in entity` on an unconstrained `T`. Fix: `T extends object`. |
| Material 15 Sass typography level names | `kyc-flow-page.component.scss` (`$title`, `$subheading-2`), `accounts-page.component.scss` (`$display-1`) | 2 | Feature-local `mat.define-typography-config` calls use 2014 level names. Map to `$headline-6`/`$subtitle-1`/`$headline-4` (or reuse the shared config). |
| Material 15 MDC list DOM | `statements.spec.ts` (`.mat-line` no longer rendered) | 1 | Template should use `matListItemTitle`/`matListItemLine`, `matListItemIcon`; spec should query the new classes. |

Not failures, but latent A15 work feature teams should expect: MDC button/form-field/checkbox/radio
render differently (density, height), so visual review is needed per feature.

Raw logs from the baseline run are kept outside the repo (`baseline-a15/*.log` on the integration
machine); regenerate with the commands in "Acceptance Criteria".

# Dependency / Migration Units

Derived from actual imports (`rg "from '@pearl/"`), `.github/CODEOWNERS` and `pearl.team` metadata.

```
shared-design-system   ← shell, kyc-flow, accounts, payments, statements, profile,
                          scheduled-payments, account-settings   (every consumer)
shared-auth            ← shell, kyc-flow, accounts, payments
shared-analytics       ← shell, accounts, payments, profile
payments               ← scheduled-payments   (imports PaymentsService/models)
profile                ← account-settings     (imports ProfileFieldComponent)
```

| Unit | Owner | Depends on | A15 blockers | Independently migratable now? |
| --- | --- | --- | --- | --- |
| `shared-design-system` | Design Systems | Material | Material MDC (theme, typography names, `mat-chip-list`, class names) | **Done in Wave 0** |
| `shared-auth` | Identity | – | none | green (no work) |
| `shared-analytics` | Digital Analytics | – | none | green (no work) |
| shell `src/` | Web Platform | all three shared libs | none of its own; root build red only via features | green (no work) |
| `kyc-flow` | Digital Onboarding | design-system, auth | TS generics (`kyc-state.ts`), Sass typography names | **Done** (`checkpoint-angular-15-kyc-flow`, pilot for `docs/playbooks/angular-migration-unit.md`) |
| `accounts` | Accounts | design-system, auth, analytics | TS generics (2 files), Sass typography name | **Yes** |
| `payments` | Payments | design-system, auth, analytics | TS generics (`payment-draft.ts`) | **Yes** — and blocks `scheduled-payments` |
| `statements` | Accounts | design-system | MDC list template/spec | **Yes** |
| `profile` | Customer Profile | design-system, analytics | none — already green | n/a (verify only) |
| `scheduled-payments` | Payments | design-system, **payments** | inherits `payments` compile errors; no local errors observed yet | **No** — after `payments` |
| `account-settings` | Customer Profile | design-system, **profile** | none — already green | green; re-verify after `profile` changes |

Smallest safe units: every project is its own unit. No group needs to move together — the only
cross-feature edges (`payments → scheduled-payments`, `profile → account-settings`) are ordering
constraints, not co-change constraints, because the downstream unit compiles the upstream source
in its own test build and so simply waits for the upstream fix to land on the integration branch.

# Migration Waves

Wave 0 — shared blockers (this branch, complete)
- workspace: `ng update` core/CLI/Material/CDK/eslint, TypeScript 4.9, `tsconfig` target ES2022
- `shared-design-system`: MDC theme + typography tokens, `mat-chip-set`, MDC class names, spec update
- `shared-auth`, `shared-analytics`, shell: no changes required (verified green)

Wave 1 — parallel-safe units (one branch each, from this integration branch)
- `kyc-flow` (Digital Onboarding) — done; pilot unit
- `accounts` (Accounts)
- `payments` (Payments) — prioritise; unblocks Wave 2
- `statements` (Accounts)
- `profile` (Customer Profile) — verification only; open a branch only if visual fixes are needed

Wave 2 — downstream units
- `scheduled-payments` after `payments` is merged to the integration branch
- `account-settings` after `profile` (verification only; already green)

Wave 3 — integration close-out (Web Platform)
- root `npm run ci` green; merge integration branch to `main`; tag `v15.0.0`

# Acceptance Criteria

For an individual migration unit `<p>`:

1. `npm run lint:<p>` passes.
2. `npm run test:<p>` compiles and all its specs pass.
3. Every dependent unit's `npm run test:<dep>` is no worse than the baseline table above
   (e.g. a `payments` branch must also run `test:scheduled-payments`; a `profile` branch
   `test:account-settings`; a `shared-*` change runs `npm run ci`).
4. `npm run build` errors are a strict subset of the 12 known failures listed above — the branch
   removes its own entries and adds none.
5. No changes outside the unit's directory (plus `docs/` for notes). Cross-boundary needs go to the
   owning team as a separate PR against the integration branch.

Feature branches **may inherit** the known failures elsewhere on the Angular 15 integration branch
(root `build`/`test` red, other projects' compile errors). They **may not introduce new failures**:
any command that is green in the baseline table must stay green, and any red command must fail
for the same reasons or fewer.

# Execution Model

```
main
 └─ checkpoint-angular-15-integration        (integration branch, this PR)
      ├─ Wave 0: ng update + shared-design-system remediation   [done]
      ├─ feature/a15-kyc-flow      ─┐
      ├─ feature/a15-accounts       ├─ Wave 1, in parallel, PRs back to integration branch
      ├─ feature/a15-payments       │
      ├─ feature/a15-statements    ─┘
      ├─ feature/a15-scheduled-payments   (Wave 2, after payments)
      └─ integration validation: npm run ci on every merge; green → merge to main
```

Then repeat the loop for Angular 16, 17 and 18: new `checkpoint-angular-<N>-integration` branch,
`ng update`, Wave 0 on shared libraries (design system first), parallel feature branches, PRs back,
continuous `npm run ci`, merge to `main`.
