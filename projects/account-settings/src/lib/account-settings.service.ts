import { Injectable } from '@angular/core';
import { ProfileService } from '@pearl/profile';

export interface NotificationPreferences {
  paymentAlerts: boolean;
  lowBalanceAlerts: boolean;
  marketing: boolean;
}

@Injectable({ providedIn: 'root' })
export class AccountSettingsService {
  private prefs: NotificationPreferences = { paymentAlerts: true, lowBalanceAlerts: true, marketing: false };

  constructor(private readonly profile: ProfileService) {}

  preferences(): NotificationPreferences {
    return this.prefs;
  }

  set(key: keyof NotificationPreferences, value: boolean): void {
    this.prefs = { ...this.prefs, [key]: value };
  }

  /** Alerts are delivered to the profile's mobile number; settings exposes it read-only. */
  alertDestination(): string {
    return this.profile.snapshot().mobile;
  }

  updateAlertDestination(mobile: string): void {
    this.profile.update('mobile', mobile);
  }
}
