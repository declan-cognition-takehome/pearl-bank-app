import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatLegacyButtonHarness as MatButtonHarness } from '@angular/material/legacy-button/testing';
import { MatLegacyCheckboxHarness as MatCheckboxHarness } from '@angular/material/legacy-checkbox/testing';
import { MatLegacyInputHarness as MatInputHarness } from '@angular/material/legacy-input/testing';
import { MatLegacyRadioGroupHarness as MatRadioGroupHarness } from '@angular/material/legacy-radio/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthSessionService, CustomerSession } from '@pearl/shared-auth';

import { KycFlowModule } from './kyc-flow.module';
import { KycFlowPageComponent } from './kyc-flow-page/kyc-flow-page.component';
import { KycFlowService } from './kyc-flow.service';
import { applyStepPatch, EMPTY_KYC_STATE, isAddressComplete, missingFields } from './kyc-state';

describe('@pearl/kyc-flow state helpers', () => {
  it('applyStepPatch mutates and returns the same details object', () => {
    const identity = { ...EMPTY_KYC_STATE.identity };
    const result = applyStepPatch(identity, { legalName: 'Amelia Ng' });
    expect(result).toBe(identity);
    expect(identity.legalName).toBe('Amelia Ng');
  });

  it('missingFields reports empty and unknown keys', () => {
    expect(missingFields({ line1: '12 Pearl St', suburb: '' }, ['line1', 'suburb', 'postcode'])).toEqual([
      'suburb',
      'postcode',
    ]);
    expect(isAddressComplete({ line1: 'a', suburb: 'b', postcode: '20000', residential: true })).toBeFalse();
    expect(isAddressComplete({ line1: 'a', suburb: 'b', postcode: '2000', residential: true })).toBeTrue();
  });
});

describe('@pearl/kyc-flow page', () => {
  let fixture: ComponentFixture<KycFlowPageComponent>;
  let loader: HarnessLoader;
  let service: KycFlowService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycFlowModule, RouterTestingModule, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(KycFlowPageComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    service = fixture.debugElement.injector.get(KycFlowService);
  });

  async function continueButton(): Promise<MatButtonHarness> {
    return loader.getHarness(MatButtonHarness.with({ text: /Continue|Submit/ }));
  }

  async function fillIdentity(): Promise<void> {
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="legal-name"]' }))).setValue('Amelia Ng');
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="dob"]' }))).setValue('1991-04-02');
    await (await loader.getHarness(MatRadioGroupHarness)).checkRadioButton({ label: 'Passport' });
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="document-number"]' }))).setValue('PA1234567');
  }

  it('starts on the identity step with Continue disabled until the form is complete', async () => {
    expect(fixture.nativeElement.querySelector('.kyc__progress--current').textContent.trim()).toBe('identity');
    expect(await (await continueButton()).isDisabled()).toBeTrue();
    await fillIdentity();
    expect(await (await continueButton()).isDisabled()).toBeFalse();
  });

  it('advances identity -> address -> review and shows the review summary', async () => {
    await fillIdentity();
    await (await continueButton()).click();
    expect(service.snapshot().identity.documentType).toBe('passport');
    expect(fixture.nativeElement.querySelector('.kyc__progress--current').textContent.trim()).toBe('address');

    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="line1"]' }))).setValue('12 Pearl St');
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="suburb"]' }))).setValue('Manly');
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="postcode"]' }))).setValue('2095');
    await (await continueButton()).click();

    expect(fixture.nativeElement.querySelector('.kyc__progress--current').textContent.trim()).toBe('review');
    expect(fixture.nativeElement.querySelector('[data-testid="review-name"]').textContent).toBe('Amelia Ng');
  });

  it('submits only after consent and marks the session KYC-complete', async () => {
    const session = TestBed.inject(AuthSessionService);
    const signedIn = session.current;
    expect(signedIn).not.toBeNull();
    session.signIn({ ...(signedIn as CustomerSession), kycComplete: false });
    await fillIdentity();
    await (await continueButton()).click();
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="line1"]' }))).setValue('12 Pearl St');
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="suburb"]' }))).setValue('Manly');
    await (await loader.getHarness(MatInputHarness.with({ selector: '[data-testid="postcode"]' }))).setValue('2095');
    await (await continueButton()).click();

    const submit = await continueButton();
    expect(await submit.getText()).toBe('Submit');
    expect(await submit.isDisabled()).toBeTrue();
    await (await loader.getHarness(MatCheckboxHarness.with({ selector: '[data-testid="consent"]' }))).check();
    expect(await submit.isDisabled()).toBeFalse();
    await submit.click();

    expect(session.current?.kycComplete).toBeTrue();
    expect(fixture.nativeElement.querySelector('[data-testid="kyc-complete"]')).not.toBeNull();
  });
});
