import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatLegacyButtonHarness as MatButtonHarness } from '@angular/material/legacy-button/testing';
import { MatLegacySlideToggleHarness as MatSlideToggleHarness } from '@angular/material/legacy-slide-toggle/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { PaymentsService } from '@pearl/payments';

import { ScheduledPaymentsModule } from './scheduled-payments.module';
import { ScheduledPaymentsPageComponent } from './scheduled-payments-page.component';
import { ScheduledPaymentsService } from './scheduled-payments.service';

describe('@pearl/scheduled-payments', () => {
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledPaymentsModule, RouterTestingModule, NoopAnimationsModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(ScheduledPaymentsPageComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('toggles a schedule on and off', async () => {
    const toggles = await loader.getAllHarnesses(MatSlideToggleHarness);
    expect(await toggles[1].isChecked()).toBeFalse();
    await toggles[1].toggle();
    expect(TestBed.inject(ScheduledPaymentsService).list()[1].active).toBeTrue();
  });

  it('"Pay now" submits through the payments module', async () => {
    const payments = TestBed.inject(PaymentsService);
    const before = payments.recentPayments().length;
    await (await loader.getHarness(MatButtonHarness.with({ text: 'Pay now' }))).click();
    expect(payments.recentPayments().length).toBe(before + 1);
    expect(payments.recentPayments()[0].reference).toBe('Rent');
  });
});
