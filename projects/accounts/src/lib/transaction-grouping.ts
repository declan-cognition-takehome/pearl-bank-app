import { Transaction, TransactionGroup } from './accounts.models';

/** Groups transactions by posted date, newest first, with a per-day total. */
export function groupByDay(transactions: readonly Transaction[]): TransactionGroup[] {
  const byDate = new Map<string, Transaction[]>();
  for (const txn of transactions) {
    const bucket = byDate.get(txn.postedAt) ?? [];
    bucket.push(txn);
    byDate.set(txn.postedAt, bucket);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([date, txns]) => ({
      date,
      transactions: txns,
      total: txns.reduce((sum, t) => sum + t.amount, 0),
    }));
}

/**
 * Returns true when `entity` carries `key`. Used to detect optional fields on
 * ledger records coming from different core-banking feeds.
 */
export function hasField<T>(entity: T, key: string): boolean {
  return key in entity;
}

/** Settles a pending transaction in place (the ledger view holds references). */
export function settle<T>(entity: T, patch: Partial<T>): T {
  return Object.assign(entity, patch);
}
