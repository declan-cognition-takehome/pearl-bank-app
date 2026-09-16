# @pearl/shared-auth

Owned by **Identity**.

Customer session (`AuthSessionService`), route guard (`AuthGuard`, scope-based via
`route.data.scope`) and session models shared by `kyc-flow`, `accounts` and `payments`.
No real authentication happens in this workspace; the session is seeded with a demo customer.

```bash
npm run test:shared-auth
npm run lint:shared-auth
```
