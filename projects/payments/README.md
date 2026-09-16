# @pearl/payments

Owned by **Payments**.

Pay-anyone flow at `/payments` (payee select, amount, reference, recent payments).
Depends on `@pearl/shared-design-system`, `@pearl/shared-auth` (scope `payments:write`) and
`@pearl/shared-analytics`. `@pearl/scheduled-payments` builds on this project's `PaymentsService`
and draft helpers.

```bash
npm run test:payments
npm run lint:payments
```
