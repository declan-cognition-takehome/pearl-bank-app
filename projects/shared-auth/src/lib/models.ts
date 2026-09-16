export type CustomerSegment = 'retail' | 'premier' | 'business';

export interface CustomerSession {
  customerId: string;
  displayName: string;
  segment: CustomerSegment;
  /** Feature scopes granted to the session, e.g. 'accounts:read', 'payments:write'. */
  scopes: readonly string[];
  /** Whether the customer has completed KYC; onboarding routes are open before that. */
  kycComplete: boolean;
}
