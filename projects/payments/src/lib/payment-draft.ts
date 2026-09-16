import { PaymentDraft } from './payments.models';

export const EMPTY_DRAFT: PaymentDraft = { payeeId: '', amount: 0, reference: '', fromAccountId: 'acc_everyday' };

/** Merges defaults with overrides, keeping the draft object identity for form bindings. */
export function mergeDraft<T>(draft: T, overrides: Partial<T>): T {
  return Object.assign(draft, overrides);
}

export function validateDraft(draft: PaymentDraft): string[] {
  const errors: string[] = [];
  if (!draft.payeeId) {
    errors.push('Choose a payee');
  }
  if (!Number.isInteger(draft.amount) || draft.amount <= 0) {
    errors.push('Amount must be greater than zero');
  }
  if (draft.reference.length > 18) {
    errors.push('Reference must be 18 characters or fewer');
  }
  return errors;
}
