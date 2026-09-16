export type KycStep = 'identity' | 'address' | 'review';

export const KYC_STEPS: readonly KycStep[] = ['identity', 'address', 'review'];

export interface IdentityDetails {
  legalName: string;
  dateOfBirth: string;
  documentType: 'passport' | 'drivers-licence' | '';
  documentNumber: string;
}

export interface AddressDetails {
  line1: string;
  suburb: string;
  postcode: string;
  residential: boolean;
}

export interface KycState {
  identity: IdentityDetails;
  address: AddressDetails;
  consentGiven: boolean;
  submittedAt: number | null;
}

export const EMPTY_KYC_STATE: KycState = {
  identity: { legalName: '', dateOfBirth: '', documentType: '', documentNumber: '' },
  address: { line1: '', suburb: '', postcode: '', residential: true },
  consentGiven: false,
  submittedAt: null,
};

/**
 * Applies a partial update to a step's details in place and returns the same object,
 * so form subscriptions holding a reference keep seeing the latest values.
 */
export function applyStepPatch<T extends object>(details: T, patch: Partial<T>): T {
  return Object.assign(details, patch);
}

/** Keys of `details` whose value is still empty (''/null/undefined). */
export function missingFields<T extends object>(details: T, required: readonly string[]): string[] {
  return required.filter((key) => {
    if (!(key in details)) {
      return true;
    }
    const value = (details as Record<string, unknown>)[key];
    return value === '' || value === null || value === undefined;
  });
}

export function isIdentityComplete(identity: IdentityDetails): boolean {
  return missingFields(identity, ['legalName', 'dateOfBirth', 'documentType', 'documentNumber']).length === 0;
}

export function isAddressComplete(address: AddressDetails): boolean {
  return missingFields(address, ['line1', 'suburb', 'postcode']).length === 0 && /^\d{4}$/.test(address.postcode);
}
