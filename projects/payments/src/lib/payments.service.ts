import { Injectable } from '@angular/core';
import { AnalyticsService } from '@pearl/shared-analytics';
import { AuthSessionService } from '@pearl/shared-auth';

import { EMPTY_DRAFT, mergeDraft, validateDraft } from './payment-draft';
import { PAYEES, Payee, Payment, PaymentDraft } from './payments.models';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly recent: Payment[] = [
    { id: 'pay_1', payeeId: 'payee_rent', amount: 245_000, reference: 'Rent May', fromAccountId: 'acc_everyday', submittedAt: '2024-05-01', status: 'sent' },
  ];
  private readonly draft: PaymentDraft = { ...EMPTY_DRAFT };

  constructor(private readonly session: AuthSessionService, private readonly analytics: AnalyticsService) {}

  payees(): Payee[] {
    return PAYEES;
  }

  currentDraft(): PaymentDraft {
    return this.draft;
  }

  updateDraft(patch: Partial<PaymentDraft>): PaymentDraft {
    return mergeDraft(this.draft, patch);
  }

  errors(): string[] {
    return validateDraft(this.draft);
  }

  recentPayments(): readonly Payment[] {
    return this.recent;
  }

  submit(): Payment | null {
    if (!this.session.hasScope('payments:write') || this.errors().length) {
      return null;
    }
    const payment: Payment = {
      ...this.draft,
      id: `pay_${this.recent.length + 1}`,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: 'processing',
    };
    this.recent.unshift(payment);
    this.analytics.track('payments', 'payment_submitted', { amount: payment.amount });
    mergeDraft(this.draft, EMPTY_DRAFT);
    return payment;
  }
}
