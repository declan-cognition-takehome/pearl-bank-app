# Angular 15 migration plan

Step one of the Angular 14 → 18 programme. Integration branch: `angular-15-integration`
(cut from `main`). Later majors repeat the same model on their own integration branch.

## 1. What the integration branch contains (Wave 0)

| | `main` (Angular 14) | `angular-15-integration` |
| --- | --- | --- |
| `@angular/core`, CLI | 14.3.0 / 14.2.13 | 15.2.10 / 15.2.11 |
| `@angular/material`, `@angular/cdk` | 14.2.7 | 15.2.9 |
| TypeScript | 4.7.4 | 4.9.5 |
| `@angular-eslint/*` | 14.4.0 | 15.2.1 |
| `tsconfig` target | es2020 | ES2022 + `useDefineForClassFields: false` (CLI migration) |
| Node | 16 (`.nvmrc`) | 16 (unchanged; Angular 15 supports 14.20, 16.13, 18.10+) |

Commits, in order:

1. `ng update @angular/core@15 @angular/cli@15 @angular-eslint/schematics@15` — package bumps
   plus the CLI migrations (removed `.browserslistrc` that matched the default, removed the
   `require.context` boilerplate from every `test.ts`, set `useDefineForClassFields`).
2. `ng update @angular/material@15` — the Material schematic rewrote **every** Material import to
   the `@angular/material/legacy-*` entry points (`MatLegacyButtonModule as MatButtonModule`, …)
   in all 8 `legacy-*`-eligible projects and their specs (the shell only uses `MatToolbar`, which has no legacy variant). Components therefore still render the
   pre-MDC DOM, and no template or harness had to change.
   Shared remediation in `projects/shared-design-system/src/styles`:
   - `mat.core()` no longer takes a typography config;
   - the theme now includes **both** `mat.all-component-themes($pb-theme)` (MDC) and
     `mat.all-legacy-component-themes($pb-legacy-theme)` (legacy) so a library can switch to MDC
     components on its own without breaking the ones still on legacy;
   - `$pb-typography` uses the 2018 level names required by `mat.define-typography-config` in
     Material 15; `$pb-legacy-typography` keeps the 2014 names via
     `mat.define-legacy-typography-config` for the legacy components.
3. Metadata: root and per-project `package.json` versions / peer ranges → 15, README.
4. `angular.json`: the shell `test` target now lists `include: ["**/*.spec.ts", "../projects/**/*.spec.ts"]`.
   The CLI 15 migration deleted the `require.context` calls in `src/test.ts` that used to pull in
   `projects/**/*.spec.ts`; without this option `npm test` silently ran **1 spec instead of 30**.

Deliberate decision — legacy components first, MDC per unit: the alternative (take the MDC
components workspace-wide now) makes every feature's templates, harnesses and visual review a
prerequisite of the integration branch and forces the design system and all seven feature
libraries to change together. Keeping `legacy-*` gives a runnable baseline today and lets each
owning team move to MDC independently (Wave 1/2 below). Legacy components are removed in
Material 17, so the MDC switch is a hard requirement before the Angular 17 step, not optional.

## 2. Baseline: CI / test state on the integration branch

There is no hosted CI workflow in this repo; "CI" is `npm run ci` = `lint` + `build` + `test`
(see README). Baseline recorded on the `Restore workspace-wide spec discovery` commit,
Node 16.20.2, headless Chrome 137.

| Command | `main` (A14) | `angular-15-integration` (A15, Wave 0) |
| --- | --- | --- |
| `npm run lint` (all 11 projects) | pass | **pass** |
| `npm run build` | pass | **fail** — 9 TS errors + 2 Sass errors, all feature-owned (below) |
| `npm test` (shell target, all 30 specs) | pass, 30/30 | **fail at compile** — same 11 errors; 0 specs execute |
| `test:shared-design-system` | pass | **pass** 5/5 |
| `test:shared-auth` | pass | **pass** 3/3 |
| `test:shared-analytics` | pass | **pass** 1/1 |
| `test:statements` | pass | **pass** 2/2 |
| `test:profile` | pass | **pass** 1/1 |
| `test:account-settings` | pass | **pass** 2/2 |
| `test:kyc-flow` | pass | **fail** (compile: `kyc-state.ts` ×3; then `kyc-flow-page.component.scss`) |
| `test:accounts` | pass | **fail** (compile: `accounts.service.ts` ×1, `transaction-grouping.ts` ×3; then `accounts-page.component.scss`) |
| `test:payments` | pass | **fail** (compile: `payment-draft.ts` ×2) |
| `test:scheduled-payments` | pass | **fail** (compile — inherits `payments`' `payment-draft.ts` errors; no errors of its own) |
| `lint:<every project>` | pass | **pass** |

### Known failures (11 compile errors in 3 feature libraries)

| # | File | Error | Cause / fix (feature-owned) |
| --- | --- | --- | --- |
| 1 | `projects/kyc-flow/src/lib/kyc-state.ts:38` | TS2322 `Partial<T>` not assignable to `T` | TS 4.8+: unconstrained `T` no longer assignable to `{}`/`object`. `applyStepPatch<T extends object>` |
| 2 | `projects/kyc-flow/src/lib/kyc-state.ts:38` | TS2769 `Object.assign` overload | same |
| 3 | `projects/kyc-flow/src/lib/kyc-state.ts:44` | TS2322 `T` not assignable to `object` (`key in details`) | `missingFields<T extends object>` |
| 4 | `projects/accounts/src/lib/accounts.service.ts:17` | TS2345 `T` not assignable to `{}` | `get<T extends object>` (or `Map<string, unknown>`) |
| 5 | `projects/accounts/src/lib/transaction-grouping.ts:25` | TS2322 `key in entity` | `hasField<T extends object>` |
| 6 | `projects/accounts/src/lib/transaction-grouping.ts:30` | TS2322 `Partial<T>` → `T` | `settle<T extends object>` |
| 7 | `projects/accounts/src/lib/transaction-grouping.ts:30` | TS2769 `Object.assign` overload | same |
| 8 | `projects/payments/src/lib/payment-draft.ts:7` | TS2322 `Partial<T>` → `T` | `mergeDraft<T extends object>` |
| 9 | `projects/payments/src/lib/payment-draft.ts:7` | TS2769 `Object.assign` overload | same |
| 10 | `projects/kyc-flow/src/lib/kyc-flow-page/kyc-flow-page.component.scss:5` | Sass: `define-typography-config` has no `$title` / `$subheading-2` | Material 15 uses 2018 level names: `$headline-6`, `$subtitle-1` (and `mat.typography-level(…, subtitle-1)`), or use `mat.define-legacy-typography-config` while on legacy components |
| 11 | `projects/accounts/src/lib/accounts-page/accounts-page.component.scss:5` | Sass: no `$display-1` | `$headline-4` / `headline-4` |

Only the TS errors show in the logs today; the two Sass errors are masked until the TS errors in
the same project are fixed (Sass compiles after type-checking). Both were confirmed by applying
the TS fixes locally. With all 11 fixed and no other change, `npm test` runs **30/30 green** on the
legacy components — i.e. this list is complete, nothing else is hiding behind it.

Regenerate the baseline with:

```bash
npm run lint; npm run build; CHROME_BIN=$(which google-chrome) npm test
for p in shared-design-system shared-auth shared-analytics kyc-flow accounts payments \
         statements profile scheduled-payments account-settings; do npm run test:$p; done
```

## 3. Dependencies and blockers

Derived from `rg "from '@pearl/"` (non-spec files), `.github/CODEOWNERS`, `pearl.team` metadata
and the DeepWiki dependency/Material-usage query for this repo.

```
shared-design-system  ← shell, kyc-flow, accounts, payments, statements, profile,
                        scheduled-payments, account-settings           (every consumer)
shared-auth           ← shell, kyc-flow, accounts, payments
shared-analytics      ← shell, accounts, payments, profile
payments              ← scheduled-payments   (PaymentsService, models, PaymentsModule)
profile               ← account-settings     (ProfileFieldComponent, ProfileService)
```

Material usage per unit (all currently on `legacy-*` after the schematic):

| Unit | Owner | Depends on | Material modules | Harnesses in spec | A15 blockers on this branch |
| --- | --- | --- | --- | --- | --- |
| shell `src/` | web-platform | 3 shared libs | toolbar (no legacy variant; already MDC-agnostic) | — | none — green |
| `shared-design-system` | design-systems | — | legacy button, card, chips; icon | button | none (green). Owns theme/tokens, `pb-button`/`pb-card`/`pb-status-chip` wrappers |
| `shared-auth` | identity | — | — | — | none — green |
| `shared-analytics` | digital-analytics | — | — | — | none — green |
| `kyc-flow` | digital-onboarding | design-system, auth | legacy checkbox, form-field, input, radio | button, checkbox, input, radio-group | errors 1–3, 10 |
| `accounts` | accounts | design-system, auth, analytics | legacy table | button, table | errors 4–7, 11 |
| `payments` | payments | design-system, auth, analytics | legacy form-field, input, select | button, input, select | errors 8–9 — **blocks scheduled-payments** |
| `statements` | accounts | design-system | legacy list; icon | none (queries `.mat-line`) | none — green |
| `profile` | customer-profile | design-system, analytics | legacy form-field, input | button, input | none — green |
| `scheduled-payments` | payments | design-system, **payments** | legacy slide-toggle | button, slide-toggle | inherits 8–9 only |
| `account-settings` | customer-profile | design-system, **profile** | legacy checkbox | checkbox | none — green |

Cross-unit coupling that was checked and is *not* a blocker:

- Feature specs drive `pb-button` through `MatButtonHarness`. Both the legacy and the MDC button
  harness select on the `[mat-button]`/`[mat-raised-button]`/… attributes, so the design system
  can move `pb-button` to MDC without any consumer spec changing.
- No feature stylesheet or template references design-system Material internals (`.mat-card-*`,
  `.mat-button-wrapper`) — those live only inside `shared-design-system`.
- Both component generations are themed, so a mixed legacy/MDC page renders correctly (with
  visible density/height differences until every unit is on MDC).

Real ordering constraints:

- `scheduled-payments` compiles `payments` source in its own test build, so it cannot go green
  before `payments` lands its TS fix on the integration branch.
- `account-settings` compiles `profile`; it is green now and must be re-verified whenever `profile`
  changes (e.g. `profile`'s MDC switch changes `ProfileFieldComponent`'s form-field DOM).
- `statements.spec.ts` asserts on `.mat-line`, which the MDC list no longer renders. Fine while on
  `legacy-list`; the template (`matListItemTitle`/`matListItemLine`) and spec change together when
  statements switches to MDC.
- `_theme.scss` still carries two legacy-class overrides (`.mat-card.pb-card-flat`,
  `.mat-form-field-appearance-outline .mat-form-field-outline`). Design Systems must add the
  `.mat-mdc-*` equivalents when it (card) and the form-field consumers (kyc-flow, payments,
  profile) move to MDC.

## 4. Migration waves

Smallest safe unit = one project. There is no set of projects that has to change in the same PR;
the two cross-feature edges are ordering constraints only.

**Wave 0 — shared baseline (this branch, done)**
workspace `ng update`, dual legacy+MDC theme and typography tokens, karma spec discovery, metadata.
`shared-auth`, `shared-analytics`, shell: verified green, no work.

**Wave 1 — independent units, run in parallel, one branch each off `angular-15-integration`**

| Branch | Owner | Scope | Must run |
| --- | --- | --- | --- |
| `a15/kyc-flow` | digital-onboarding | errors 1–3, 10; then legacy → MDC (`MatCheckbox/FormField/Input/Radio` + harnesses), visual check | `test:kyc-flow`, `lint:kyc-flow` |
| `a15/accounts` | accounts | errors 4–7, 11; then legacy → MDC (`MatTable` + harness) | `test:accounts`, `lint:accounts` |
| `a15/payments` | payments | errors 8–9 — **land first, unblocks Wave 2**; then legacy → MDC (`MatFormField/Input/Select`) | `test:payments`, `lint:payments`, **`test:scheduled-payments`** |
| `a15/statements` | accounts | legacy → MDC list: `matListItemTitle/Line/Icon`, spec selectors | `test:statements`, `lint:statements` |
| `a15/profile` | customer-profile | legacy → MDC form-field/input; `ProfileFieldComponent` | `test:profile`, `lint:profile`, **`test:account-settings`** |
| `a15/shared-design-system` | design-systems | legacy → MDC button/card/chips (`mat-chip-list` → `mat-chip-set`, `.mat-mdc-*` overrides, `_theme.scss` overrides), spec | `npm run ci` (every consumer) |

Recommended split: land the TS/Sass compile fixes (tiny, mechanical) as the first PR of each
Wave 1 branch so root `build`/`test` go green early; do the MDC switch as a follow-up PR on the
same unit. The compile-fix PRs for kyc-flow, accounts and payments are the only thing standing
between the integration branch and a green `npm run ci`.

**Wave 2 — downstream units (after their upstream Wave 1 unit is merged to the integration branch)**

| Branch | Owner | After | Scope |
| --- | --- | --- | --- |
| `a15/scheduled-payments` | payments | `a15/payments` compile fix | verify green; legacy → MDC slide-toggle + harness |
| `a15/account-settings` | customer-profile | `a15/profile` | re-verify; legacy → MDC checkbox + harness |

**Wave 3 — close-out (web-platform)**

- `rg "material/legacy-"` returns nothing; drop `$pb-legacy-typography`, `$pb-legacy-theme` and
  `mat.all-legacy-component-themes` from the design system.
- `npm run ci` green on the integration branch; merge `angular-15-integration` → `main`;
  tag `v15.0.0`; cut `angular-16-integration`.

## 5. Acceptance criteria for a feature branch

A branch for unit `<p>` off `angular-15-integration` is mergeable when:

1. `npm run lint:<p>` passes.
2. `npm run test:<p>` compiles and every spec passes.
3. Every downstream unit's `npm run test:<dep>` is no worse than the baseline table in §2
   (`payments` → also `test:scheduled-payments`; `profile` → also `test:account-settings`;
   any `shared-*` or workspace-config change → full `npm run ci`).
4. Every command that is **green in the baseline table stays green** (`lint`, the six green
   `test:<p>` targets).
5. `npm run build` / `npm test` errors are a **strict subset of the 11 known failures**: the branch
   removes its own rows and adds none. Compare the `Error:` lines of the build log against §2.
6. Changes stay inside `projects/<p>/` (plus `docs/`). Anything needed in another project or in
   workspace config (`angular.json`, `tsconfig*.json`, `package.json`, theme) is a separate PR to the
   owning team against the integration branch — not a side edit.
7. No new `@angular/material/legacy-*` imports are introduced. Existing ones may remain until the
   unit's MDC PR.

Inheriting known integration failures is allowed: a `statements` branch is not blocked by root
`build` being red because of `kyc-flow`. Introducing a new failure anywhere — a new error line, a
previously green target turning red, a spec count dropping — is not.

## 6. Execution model

```
main
 └─ angular-15-integration                       (Wave 0, this branch)
      ├─ a15/kyc-flow              ┐
      ├─ a15/accounts              │
      ├─ a15/payments              ├─ Wave 1, parallel, PRs back to angular-15-integration
      ├─ a15/statements            │
      ├─ a15/profile               │
      ├─ a15/shared-design-system  ┘
      ├─ a15/scheduled-payments    ─ Wave 2, after a15/payments
      ├─ a15/account-settings      ─ Wave 2, after a15/profile
      └─ Wave 3: remove legacy theme, npm run ci green → merge to main, tag v15.0.0
```

Then repeat for 16, 17 and 18 (`angular-<N>-integration`, `ng update`, shared Wave 0, parallel
feature waves, PRs back, merge). Note for the Angular 17 step: `@angular/material/legacy-*` no
longer exists, so all Wave 1/2 MDC work above must be complete before that branch is cut.
