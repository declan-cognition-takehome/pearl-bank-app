import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatLegacyButtonHarness as MatButtonHarness } from '@angular/material/legacy-button/testing';
import { MatLegacyTableHarness as MatTableHarness } from '@angular/material/legacy-table/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@pearl/shared-analytics';

import { AccountsModule } from './accounts.module';
import { AccountsPageComponent } from './accounts-page/accounts-page.component';
import { AccountsService, Memo } from './accounts.service';
import { TRANSACTIONS } from './accounts.mock-data';
import { groupByDay, hasField, settle } from './transaction-grouping';

describe('@pearl/accounts ledger helpers', () => {
  it('groups transactions by day, newest first, with totals', () => {
    const groups = groupByDay(TRANSACTIONS.filter((t) => t.accountId === 'acc_everyday'));
    expect(groups.map((g) => g.date)).toEqual(['2024-05-14', '2024-05-13', '2024-05-12']);
    expect(groups[0].total).toBe(-13_432);
  });

  it('settle() mutates the ledger record in place', () => {
    const txn = { ...TRANSACTIONS[0] };
    expect(settle(txn, { pending: false })).toBe(txn);
    expect(txn.pending).toBeFalse();
    expect(hasField(txn, 'category')).toBeTrue();
    expect(hasField(txn, 'merchantId')).toBeFalse();
  });

  it('Memo computes once per key until invalidated', () => {
    const memo = new Memo();
    const compute = jasmine.createSpy('compute').and.returnValues(1, 2);
    expect(memo.get('k', compute)).toBe(1);
    expect(memo.get('k', compute)).toBe(1);
    memo.invalidate('k');
    expect(memo.get('k', compute)).toBe(2);
    expect(compute).toHaveBeenCalledTimes(2);
  });
});

describe('@pearl/accounts page', () => {
  let fixture: ComponentFixture<AccountsPageComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsModule, RouterTestingModule, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AccountsPageComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('greets the customer and shows the total balance across accounts', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.pb-page-header__title')?.textContent).toContain('Amelia Ng');
    expect(el.querySelector('[data-testid="total-balance"]')?.textContent?.trim()).toBe('$20,923.55');
    expect(el.querySelectorAll('pb-card.accounts__card').length).toBe(3);
  });

  it('lists the selected account transactions in a Material table grouped by day', async () => {
    const tables = await loader.getAllHarnesses(MatTableHarness);
    expect(tables.length).toBe(3);
    const rows = await tables[0].getCellTextByIndex();
    expect(rows[0][0]).toContain('Coles Manly');
    expect(rows[0][0]).toContain('Pending');
    expect(rows[0][1]).toBe('-$84.32');
  });

  it('settles a pending transaction and records an analytics event', async () => {
    const analytics = TestBed.inject(AnalyticsService);
    const service = TestBed.inject(AccountsService);
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Mark settled' }));
    await button.click();
    expect(service.groupedTransactions('acc_everyday')[0].transactions[0].pending).toBeFalse();
    expect(await loader.getAllHarnesses(MatButtonHarness.with({ text: 'Mark settled' }))).toEqual([]);
    expect(analytics.pending().map((e) => e.name)).toEqual(['page_view', 'transaction_settled']);
  });
});
