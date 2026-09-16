import { Injectable } from '@angular/core';
import { AuthSessionService } from '@pearl/shared-auth';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  AddressDetails,
  applyStepPatch,
  EMPTY_KYC_STATE,
  IdentityDetails,
  isAddressComplete,
  isIdentityComplete,
  KycState,
  KycStep,
} from './kyc-state';

@Injectable()
export class KycFlowService {
  private readonly state: KycState = {
    ...EMPTY_KYC_STATE,
    identity: { ...EMPTY_KYC_STATE.identity },
    address: { ...EMPTY_KYC_STATE.address },
  };
  private readonly step$ = new BehaviorSubject<KycStep>('identity');

  constructor(private readonly session: AuthSessionService) {}

  currentStep(): Observable<KycStep> {
    return this.step$.asObservable();
  }

  snapshot(): KycState {
    return this.state;
  }

  updateIdentity(patch: Partial<IdentityDetails>): void {
    applyStepPatch(this.state.identity, patch);
  }

  updateAddress(patch: Partial<AddressDetails>): void {
    applyStepPatch(this.state.address, patch);
  }

  setConsent(given: boolean): void {
    this.state.consentGiven = given;
  }

  canAdvance(): boolean {
    switch (this.step$.value) {
      case 'identity':
        return isIdentityComplete(this.state.identity);
      case 'address':
        return isAddressComplete(this.state.address);
      case 'review':
        return this.state.consentGiven;
    }
  }

  next(): void {
    if (!this.canAdvance()) {
      return;
    }
    if (this.step$.value === 'identity') {
      this.step$.next('address');
    } else if (this.step$.value === 'address') {
      this.step$.next('review');
    } else {
      this.state.submittedAt = Date.now();
      this.session.markKycComplete();
    }
  }

  back(): void {
    if (this.step$.value === 'address') {
      this.step$.next('identity');
    } else if (this.step$.value === 'review') {
      this.step$.next('address');
    }
  }
}
