import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CustomerSession } from './models';

const DEMO_SESSION: CustomerSession = {
  customerId: 'cus_10482',
  displayName: 'Amelia Ng',
  segment: 'retail',
  scopes: ['accounts:read', 'payments:write', 'statements:read', 'profile:write'],
  kycComplete: true,
};

/**
 * Holds the signed-in customer's session. In production this is populated by the
 * Identity SSO handshake; in this workspace it is seeded with a demo customer.
 */
@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly session$ = new BehaviorSubject<CustomerSession | null>(DEMO_SESSION);

  get current(): CustomerSession | null {
    return this.session$.value;
  }

  session(): Observable<CustomerSession | null> {
    return this.session$.asObservable();
  }

  displayName(): Observable<string> {
    return this.session$.pipe(map((s) => s?.displayName ?? 'Guest'));
  }

  hasScope(scope: string): boolean {
    return this.session$.value?.scopes.includes(scope) ?? false;
  }

  signIn(session: CustomerSession): void {
    this.session$.next(session);
  }

  signOut(): void {
    this.session$.next(null);
  }

  markKycComplete(): void {
    const current = this.session$.value;
    if (current) {
      this.session$.next({ ...current, kycComplete: true });
    }
  }
}
