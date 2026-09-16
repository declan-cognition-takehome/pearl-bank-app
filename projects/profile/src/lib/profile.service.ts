import { Injectable } from '@angular/core';
import { AnalyticsService } from '@pearl/shared-analytics';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CustomerProfile {
  preferredName: string;
  email: string;
  mobile: string;
  postalAddress: string;
}

const DEMO_PROFILE: CustomerProfile = {
  preferredName: 'Amelia',
  email: 'amelia.ng@example.com',
  mobile: '+61 400 123 456',
  postalAddress: '12 Pearl St, Manly NSW 2095',
};

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly profile$ = new BehaviorSubject<CustomerProfile>({ ...DEMO_PROFILE });

  constructor(private readonly analytics: AnalyticsService) {}

  profile(): Observable<CustomerProfile> {
    return this.profile$.asObservable();
  }

  snapshot(): CustomerProfile {
    return this.profile$.value;
  }

  update<K extends keyof CustomerProfile>(field: K, value: CustomerProfile[K]): void {
    this.profile$.next({ ...this.profile$.value, [field]: value });
    this.analytics.track('profile', 'field_updated', { field });
  }
}
