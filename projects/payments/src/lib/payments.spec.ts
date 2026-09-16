import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { mergeDraft, validateDraft } from './payment-draft';
import { PaymentsModule } from './payments.module';
import { PaymentsPageComponent } from './payments-page.component';
import { PaymentsService } from './payments.service';

describe('@pearl/payments drafts', () => {
  it('mergeDraft keeps object identity and validateDraft reports problems', () => {
    const draft = { payeeId: '', amount: 0, reference: '', fromAccountId: 'acc_everyday' };
    expect(mergeDraft(draft, { amount: 1500 })).toBe(draft);
    expect(validateDraft(draft)).toEqual(['Choose a payee']);
    expect(validateDraft({ ...draft, payeeId: 'payee_rent', amount: 0 })).toEqual(['Amount must be greater than zero']);
  });
});

describe('@pearl/payments page', () => {
  let fixture: ComponentFixture<PaymentsPageComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsModule, RouterTestingModule, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(PaymentsPageComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('submits a payment once the draft is valid and prepends it to recent payments', async () => {
    const pay = await loader.getHarness(MatButtonHarness.with({ text: 'Pay' }));
    expect(await pay.isDisabled()).toBeTrue();

    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({ text: 'Pearl Energy' });
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="amount"]' }))).setValue('120.5');
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="reference"]' }))).setValue('Power');
    fixture.detectChanges();

    expect(await pay.isDisabled()).toBeFalse();
    await pay.click();
    const recent = TestBed.inject(PaymentsService).recentPayments();
    expect(recent[0]).toEqual(jasmine.objectContaining({ payeeId: 'payee_energy', amount: 12_050, status: 'processing' }));
    expect(fixture.nativeElement.querySelector('[data-testid="pay_2"]').textContent).toContain('Pearl Energy');
  });
});
