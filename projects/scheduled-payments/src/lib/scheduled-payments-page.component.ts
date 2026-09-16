import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ScheduledPaymentsService } from './scheduled-payments.service';

@Component({
  selector: 'pearl-scheduled-payments-page',
  template: `
    <div class="pb-page">
      <pb-page-header title="Scheduled payments" subtitle="Payments that run automatically"></pb-page-header>
      <pb-card
        *ngFor="let schedule of scheduled.list()"
        [title]="scheduled.payeeName(schedule.draft.payeeId)"
        [subtitle]="schedule.frequency + ' · next ' + schedule.nextRun"
        [attr.data-testid]="schedule.id"
      >
        <p>{{ schedule.draft.amount | pbMoney }} · {{ schedule.draft.reference }}</p>
        <mat-slide-toggle [checked]="schedule.active" (change)="scheduled.toggle(schedule.id)">Active</mat-slide-toggle>
        <pb-button variant="secondary" (pressed)="scheduled.runNow(schedule.id)">Pay now</pb-button>
      </pb-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ScheduledPaymentsPageComponent {
  constructor(readonly scheduled: ScheduledPaymentsService) {}
}
