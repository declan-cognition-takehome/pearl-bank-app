import { Injectable } from '@angular/core';
import { AnalyticsService } from '@pearl/shared-analytics';
import { AuthSessionService } from '@pearl/shared-auth';
import { Observable, of } from 'rxjs';

import { ACCOUNTS, TRANSACTIONS } from './accounts.mock-data';
import { Account, Transaction, TransactionGroup } from './accounts.models';
import { groupByDay, settle } from './transaction-grouping';

/** Memoises a computed value per key; ledger views recompute groupings often. */
export class Memo {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private readonly cache = new Map<string, {}>();

  get<T>(key: string, compute: () => T): T {
    if (!this.cache.has(key)) {
      this.cache.set(key, compute());
    }
    return this.cache.get(key) as T;
  }

  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private readonly accounts = ACCOUNTS.map((a) => ({ ...a }));
  private readonly transactions = TRANSACTIONS.map((t) => ({ ...t }));
  private readonly memo = new Memo();

  constructor(private readonly session: AuthSessionService, private readonly analytics: AnalyticsService) {}

  accountsForCustomer(): Observable<Account[]> {
    if (!this.session.hasScope('accounts:read')) {
      return of([]);
    }
    return of(this.accounts);
  }

  totalBalance(): number {
    return this.accounts.reduce((sum, a) => sum + a.balance, 0);
  }

  groupedTransactions(accountId: string): TransactionGroup[] {
    return this.memo.get(`groups:${accountId}`, () =>
      groupByDay(this.transactions.filter((t) => t.accountId === accountId))
    );
  }

  settlePending(transactionId: string): Transaction | undefined {
    const txn = this.transactions.find((t) => t.id === transactionId);
    if (txn && txn.pending) {
      settle(txn, { pending: false });
      this.memo.invalidate();
      this.analytics.track('accounts', 'transaction_settled', { id: transactionId });
    }
    return txn;
  }
}
