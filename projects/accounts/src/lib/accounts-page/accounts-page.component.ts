import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AnalyticsService } from '@pearl/shared-analytics';
import { AuthSessionService } from '@pearl/shared-auth';

import { Account } from '../accounts.models';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'pearl-accounts-page',
  templateUrl: './accounts-page.component.html',
  styleUrls: ['./accounts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountsPageComponent implements OnInit {
  readonly displayName$ = this.session.displayName();
  readonly accounts$ = this.accounts.accountsForCustomer();
  selectedAccountId = 'acc_everyday';

  constructor(
    readonly accounts: AccountsService,
    private readonly session: AuthSessionService,
    private readonly analytics: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.analytics.pageView('accounts', 'overview');
  }

  select(account: Account): void {
    this.selectedAccountId = account.id;
    this.analytics.track('accounts', 'account_selected', { type: account.type });
  }

  settle(transactionId: string): void {
    this.accounts.settlePending(transactionId);
  }
}
