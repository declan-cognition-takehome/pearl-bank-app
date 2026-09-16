import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AccountSettingsService } from './account-settings.service';

@Component({
  selector: 'pearl-account-settings-page',
  template: `
    <div class="pb-page">
      <pb-page-header title="Account settings" subtitle="Alerts and notifications"></pb-page-header>
      <pb-card title="Where we send alerts">
        <pearl-profile-field label="Mobile" [value]="settings.alertDestination()" (valueChange)="settings.updateAlertDestination($event)"></pearl-profile-field>
      </pb-card>
      <pb-card title="Notifications">
        <div class="settings__row">
          <mat-checkbox data-testid="payment-alerts" [checked]="settings.preferences().paymentAlerts" (change)="settings.set('paymentAlerts', $event.checked)">Payment alerts</mat-checkbox>
        </div>
        <div class="settings__row">
          <mat-checkbox data-testid="low-balance" [checked]="settings.preferences().lowBalanceAlerts" (change)="settings.set('lowBalanceAlerts', $event.checked)">Low balance alerts</mat-checkbox>
        </div>
        <div class="settings__row">
          <mat-checkbox data-testid="marketing" [checked]="settings.preferences().marketing" (change)="settings.set('marketing', $event.checked)">Offers and news</mat-checkbox>
        </div>
      </pb-card>
    </div>
  `,
  styles: ['.settings__row { padding: 4px 0; }'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountSettingsPageComponent {
  constructor(readonly settings: AccountSettingsService) {}
}
