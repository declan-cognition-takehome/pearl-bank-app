Playbook: Angular Migration Unit

## Overview
Migrate one migration unit (a single `projects/<unit>` library, e.g. `accounts`, `payments`, `statements`) to the current Angular major on its `checkpoint-angular-<N>-integration` branch. The unit is fixed in isolation, validated against the integration branch's known-failure baseline, and delivered as a PR back to the integration branch. The integration branch is expected to still be red in other units; success means "this unit is green and nothing else got worse", not "the whole repo is green".

## What's Needed From User
- Repository (e.g. `pearl-bank-app`) and the migration unit name exactly as it appears in `package.json` scripts (`test:<unit>`, `lint:<unit>`)
- Target Angular major `N` and the integration branch (`checkpoint-angular-<N>-integration`)
- Branch name for the work (default: `checkpoint-angular-<N>-<unit>`)
- Confirmation that the PR target is the integration branch, not `main`

## Procedure
1. Read `docs/migrations/angular-<N>-migration-plan.md` end to end: the "Known remaining failures" table, the "Dependency / Migration Units" table, the wave assignment and the "Acceptance Criteria" section. This is the source of truth for what is expected to be red.
2. Confirm the unit is migration-safe now: its row in the units table must say independently migratable and every upstream dependency (`shared-*`, and any feature it imports, e.g. `payments` for `scheduled-payments`) must already be green on the integration branch. If it is not safe, stop and report which upstream unit must land first.
3. Create the branch from the integration branch (`git checkout -b <branch> origin/checkpoint-angular-<N>-integration`) and run `npm ci`; the snapshot's `node_modules` may still hold the previous major's packages. Verify with `node -p "require('@angular/core/package.json').version"` and `require('typescript/package.json').version` before trusting any result.
4. Establish the baseline before editing anything. Run and save logs (outside the repo, e.g. `~/baseline-a<N>/`) for: `npm run lint:<unit>`, `npm run test:<unit>`, `npm run build`, and `npm run test:<dep>` for every unit that depends on this one and every shared library it imports. Record exit codes, `TOTAL:` lines and every `error TS` / `SassError` line; cross-check them against the plan's known-failures table and note any discrepancy.
5. Inspect the unit: `projects/<unit>/src/lib/**` (`.ts`, `.html`, `.scss`, `.spec.ts`), its `public-api.ts`, and its imports from `@pearl/*`. Read the last commit on `shared-design-system` on the integration branch to see the established Material patterns for this major.
6. Map each baseline error in the unit to a category from the plan (TS strictness, Material Sass API, Material MDC DOM/class names, deprecated API) and pick the plan's prescribed fix for that category. Do not invent a different fix if the plan prescribes one.
7. Apply the fixes with minimal edits inside `projects/<unit>/` only. Keep each fix to the smallest semantic change (add a constraint, rename a key, swap a directive); do not refactor surrounding code, rename symbols or change behaviour.
8. Re-run every command from step 4 with identical arguments, saving logs alongside the baseline (e.g. `~/after-a<N>/`). `lint:<unit>` and `test:<unit>` must exit 0 with all specs executed (check the `TOTAL: n SUCCESS` line; `Executed 0 of 0` means the bundle failed to compile).
9. Diff after vs. baseline command by command. Classify every failure as (a) inherited from the integration branch and unchanged, (b) removed by this branch, or (c) new. Root `npm run build` errors must be a strict subset of the baseline; note that the Angular builder reports only the first Sass error, so removing this unit's Sass error may surface another unit's already-known Sass error — that is category (a), verify it against the plan's table.
10. If anything falls in category (c), fix it if it is inside the unit; otherwise revert the change that caused it. Do not declare success, open the PR as ready, or update the plan while any new regression exists.
11. Commit only files under `projects/<unit>/` and `docs/`. Open a PR from the branch into the integration branch (never `main`) with: migration unit, issues fixed (file:line and category), validation commands run with before/after results, inherited failures still outstanding, and an explicit "no new regressions" statement.
12. Summarise NEW reusable knowledge discovered (a pattern not already in the plan or in this playbook), and propose it as an addition to the plan's failure table, this playbook's "Advice and Pointers", or a knowledge note. If nothing new was learned, say so explicitly.

## Specifications
- `npm run lint:<unit>` exits 0.
- `npm run test:<unit>` exits 0 with all of the unit's specs executed and passing (non-zero spec count).
- Every dependent unit's and every consumed shared library's `test:<p>` result is identical to or better than baseline.
- `npm run build` error set ⊆ baseline error set, with this unit's entries removed.
- No files changed outside `projects/<unit>/` and `docs/`; no `package.json` / lockfile changes.
- The PR body lists inherited, removed and new (must be none) failures separately.
- Validation method: side-by-side log comparison of the identical command set from steps 4 and 8.

## Advice and Pointers
- TypeScript 4.8+ (Angular 15+): an unconstrained generic `T` is no longer assignable to `{}` or `object`, so `Object.assign(x: T, …)`, `key in x`, and `Map.set(k, T)` fail. Fix by constraining `T extends object`; do not cast.
- Angular Material 15 Sass typography uses 2018 level names. Map `$title → $headline-6`, `$subheading-2 → $subtitle-1`, `$subheading-1 → $subtitle-2`, `$display-1 → $headline-4`, `$display-2 → $headline-3`, `$body-1 → $body-2` (check the full mapping in the Material typography guide). Rename both in `mat.define-typography-config(...)` and in every `mat.typography-level($config, <name>)` include.
- Angular Material 15 renders MDC components: class names gain `mat-mdc-` (`mat-mdc-raised-button`, `mat-mdc-card`), `mat-chip-list` becomes `mat-chip-set`, list items use `matListItemTitle`/`matListItemLine`/`matListItemIcon` instead of `mat-line`, and chip colours are set via `--mdc-chip-*` CSS variables. Specs must query the new classes; specs that already use CDK harnesses (`MatButtonHarness`, `MatInputHarness`, `MatRadioGroupHarness`, `MatCheckboxHarness`) generally need no change.
- The Angular CLI compiles Sass through esbuild and reports a Sass failure as `Transform failed … ERROR: Unterminated string token` at a misleading `<file>.scss:17:100` location; the real cause is the `SassError:` line further down the log (or in the `test:<unit>` log).
- `ng test` with `failOnEmptyTestSuite: true` exits 1 with `Executed 0 of 0` when the bundle fails to compile; treat that as a compile failure, not as "no tests".
- The repo aliases `@use 'mat'` and `@use 'tokens'` via `stylePreprocessorOptions`; a feature-local `mat.define-typography-config` must pass `$font-family: pb.$pb-font-family` to stay consistent with the shared theme.
- Per-project `test:<p>` / `lint:<p>` are the unit of comparison; root `build` / `test` stay red until every Wave 1/2 unit has landed.

## Forbidden Actions
- Do not edit other units, `shared-*` libraries, the shell (`src/`), `package.json`, `angular.json` or `tsconfig*.json`. Cross-boundary needs go to the owning team as a separate PR against the integration branch.
- Do not adopt `@angular/material/legacy-*` imports; the plan rejects legacy components.
- Do not modify specs to make them pass unless the spec asserts on a Material DOM detail that legitimately changed in this major (and then change only the selector).
- Do not open the PR against `main`, and do not merge the PR.
- Do not report success while `npm run build` shows any error not present in the baseline.
