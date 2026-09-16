import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { KycFlowService } from '../kyc-flow.service';
import { KYC_STEPS } from '../kyc-state';

@Component({
  selector: 'pearl-kyc-flow-page',
  templateUrl: './kyc-flow-page.component.html',
  styleUrls: ['./kyc-flow-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class KycFlowPageComponent {
  readonly steps = KYC_STEPS;
  readonly step$ = this.kyc.currentStep();

  readonly identityForm = this.fb.nonNullable.group({
    legalName: '',
    dateOfBirth: '',
    documentType: '' as 'passport' | 'drivers-licence' | '',
    documentNumber: '',
  });

  readonly addressForm = this.fb.nonNullable.group({
    line1: '',
    suburb: '',
    postcode: '',
    residential: true,
  });

  constructor(readonly kyc: KycFlowService, private readonly fb: FormBuilder) {
    this.identityForm.valueChanges.subscribe((value) => this.kyc.updateIdentity(value));
    this.addressForm.valueChanges.subscribe((value) => this.kyc.updateAddress(value));
  }

  get submitted(): boolean {
    return this.kyc.snapshot().submittedAt !== null;
  }

  consentChanged(checked: boolean): void {
    this.kyc.setConsent(checked);
  }

  stepIndex(step: string): number {
    return this.steps.indexOf(step as (typeof this.steps)[number]) + 1;
  }
}
