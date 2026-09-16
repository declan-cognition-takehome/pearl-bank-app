import { Injectable } from '@angular/core';
import { EMPTY_DRAFT, mergeDraft, PaymentDraft, PaymentsService, validateDraft } from '@pearl/payments';

export type Frequency = 'weekly' | 'fortnightly' | 'monthly';

export interface ScheduledPayment {
  id: string;
  draft: PaymentDraft;
  frequency: Frequency;
  nextRun: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class ScheduledPaymentsService {
  private readonly schedules: ScheduledPayment[] = [
    {
      id: 'sched_rent',
      draft: mergeDraft({ ...EMPTY_DRAFT }, { payeeId: 'payee_rent', amount: 245_000, reference: 'Rent' }),
      frequency: 'monthly',
      nextRun: '2024-06-01',
      active: true,
    },
    {
      id: 'sched_energy',
      draft: mergeDraft({ ...EMPTY_DRAFT }, { payeeId: 'payee_energy', amount: 18_900, reference: 'Power' }),
      frequency: 'monthly',
      nextRun: '2024-05-28',
      active: false,
    },
  ];

  constructor(private readonly payments: PaymentsService) {}

  list(): readonly ScheduledPayment[] {
    return this.schedules;
  }

  payeeName(payeeId: string): string {
    return this.payments.payees().find((p) => p.id === payeeId)?.name ?? payeeId;
  }

  toggle(id: string): void {
    const schedule = this.schedules.find((s) => s.id === id);
    if (schedule && validateDraft(schedule.draft).length === 0) {
      schedule.active = !schedule.active;
    }
  }

  /** Runs a schedule now by pushing its draft through the one-off payment flow. */
  runNow(id: string): boolean {
    const schedule = this.schedules.find((s) => s.id === id);
    if (!schedule) {
      return false;
    }
    this.payments.updateDraft(schedule.draft);
    return this.payments.submit() !== null;
  }
}
