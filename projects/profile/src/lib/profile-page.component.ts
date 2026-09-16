import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProfileService } from './profile.service';

@Component({
  selector: 'pearl-profile-page',
  template: `
    <div class="pb-page" *ngIf="profile.profile() | async as p">
      <pb-page-header title="Your profile" subtitle="How we contact you"></pb-page-header>
      <pb-card title="Contact details">
        <pearl-profile-field label="Preferred name" [value]="p.preferredName" (valueChange)="profile.update('preferredName', $event)"></pearl-profile-field>
        <pearl-profile-field label="Email" [value]="p.email" (valueChange)="profile.update('email', $event)"></pearl-profile-field>
        <pearl-profile-field label="Mobile" [value]="p.mobile" (valueChange)="profile.update('mobile', $event)"></pearl-profile-field>
        <pearl-profile-field label="Postal address" [value]="p.postalAddress" (valueChange)="profile.update('postalAddress', $event)"></pearl-profile-field>
      </pb-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProfilePageComponent {
  constructor(readonly profile: ProfileService) {}
}
