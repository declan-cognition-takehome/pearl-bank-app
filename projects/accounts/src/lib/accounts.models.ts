export type AccountType = 'everyday' | 'savings' | 'credit';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  bsb: string;
  number: string;
  /** Balance in minor units (cents). */
  balance: number;
  available: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  postedAt: string;
  description: string;
  /** Signed amount in minor units; negative is a debit. */
  amount: number;
  pending: boolean;
  category: string;
}

export interface TransactionGroup {
  date: string;
  transactions: Transaction[];
  total: number;
}
