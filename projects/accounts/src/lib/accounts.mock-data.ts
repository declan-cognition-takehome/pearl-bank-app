import { Account, Transaction } from './accounts.models';

export const ACCOUNTS: Account[] = [
  { id: 'acc_everyday', name: 'Everyday Account', type: 'everyday', bsb: '182-222', number: '10482001', balance: 342_915, available: 342_915 },
  { id: 'acc_saver', name: 'Pearl Saver', type: 'savings', bsb: '182-222', number: '10482002', balance: 1_875_040, available: 1_875_040 },
  { id: 'acc_credit', name: 'Pearl Platinum', type: 'credit', bsb: '182-222', number: '4400123', balance: -125_600, available: 874_400 },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 'txn_1', accountId: 'acc_everyday', postedAt: '2024-05-14', description: 'Coles Manly', amount: -8_432, pending: true, category: 'groceries' },
  { id: 'txn_2', accountId: 'acc_everyday', postedAt: '2024-05-14', description: 'Opal top up', amount: -5_000, pending: false, category: 'transport' },
  { id: 'txn_3', accountId: 'acc_everyday', postedAt: '2024-05-13', description: 'Salary - Harbour Labs', amount: 412_500, pending: false, category: 'income' },
  { id: 'txn_4', accountId: 'acc_everyday', postedAt: '2024-05-12', description: 'Netflix', amount: -2_299, pending: false, category: 'entertainment' },
  { id: 'txn_5', accountId: 'acc_saver', postedAt: '2024-05-01', description: 'Interest', amount: 6_210, pending: false, category: 'income' },
];
