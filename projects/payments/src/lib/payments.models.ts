export interface Payee {
  id: string;
  name: string;
  bsb: string;
  account: string;
}

export interface PaymentDraft {
  payeeId: string;
  /** Amount in minor units. */
  amount: number;
  reference: string;
  fromAccountId: string;
}

export interface Payment extends PaymentDraft {
  id: string;
  submittedAt: string;
  status: 'sent' | 'processing';
}

export const PAYEES: Payee[] = [
  { id: 'payee_rent', name: 'Harbourside Realty', bsb: '062-000', account: '12345678' },
  { id: 'payee_mum', name: 'L. Ng', bsb: '182-222', account: '10011002' },
  { id: 'payee_energy', name: 'Pearl Energy', bsb: '033-100', account: '55550001' },
];
