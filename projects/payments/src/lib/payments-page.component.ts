import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PaymentsService } from './payments.service';

@Component({
  selector: 'pearl-payments-page',
  template: `
    <div class="pb-page">
      <pb-page-header title="Pay anyone" subtitle="Transfers from your Everyday Account"></pb-page-header>
      <pb-card title="New payment">
        <div class="payments__form">
          <mat-form-field appearance="outline">
            <mat-label>Payee</mat-label>
            <mat-select data-testid="payee" [value]="payments.currentDraft().payeeId" (selectionChange)="payments.updateDraft({ payeeId: $event.value })">
              <mat-option *ngFor="let payee of payments.payees()" [value]="payee.id">{{ payee.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Amount (AUD)</mat-label>
            <input matInput type="number" data-testid="amount" [value]="payments.currentDraft().amount / 100" (input)="amountChanged($event)" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Reference</mat-label>
            <input matInput data-testid="reference" [value]="payments.currentDraft().reference" (input)="payments.updateDraft({ reference: $any($event.target).value })" />
          </mat-form-field>
        </div>
        <ul class="payments__errors pb-muted">
          <li *ngFor="let error of payments.errors()">{{ error }}</li>
        </ul>
        <pb-button variant="primary" [disabled]="payments.errors().length > 0" (pressed)="payments.submit()">Pay</pb-button>
      </pb-card>
      <pb-card title="Recent payments">
        <ul class="payments__recent">
          <li *ngFor="let payment of payments.recentPayments()" [attr.data-testid]="payment.id">
            <span>{{ payeeName(payment.payeeId) }} · {{ payment.reference }}</span>
            <span>{{ payment.amount | pbMoney }} <pb-status-chip [status]="payment.status === 'sent' ? 'complete' : 'pending'"></pb-status-chip></span>
          </li>
        </ul>
      </pb-card>
    </div>
  `,
  styles: [
    `
      .payments__form { display: grid; gap: 8px; }
      .payments__errors { margin: 0 0 16px; padding-left: 16px; }
      .payments__recent { list-style: none; padding: 0; margin: 0; }
      .payments__recent li { display: flex; justify-content: space-between; padding: 8px 0; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PaymentsPageComponent {
  constructor(readonly payments: PaymentsService) {}

  amountChanged(event: Event): void {
    const dollars = Number((event.target as HTMLInputElement).value);
    this.payments.updateDraft({ amount: Math.round(dollars * 100) });
  }

  payeeName(payeeId: string): string {
    return this.payments.payees().find((p) => p.id === payeeId)?.name ?? payeeId;
  }
}
