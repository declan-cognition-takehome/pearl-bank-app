import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { PbAnalyticsModule } from '@pearl/shared-analytics';
import { PbDesignSystemModule } from '@pearl/shared-design-system';

import { ProfileFieldComponent } from './profile-field/profile-field.component';
import { ProfilePageComponent } from './profile-page.component';

@NgModule({
  imports: [
    CommonModule,
    PbDesignSystemModule,
    PbAnalyticsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild([{ path: '', component: ProfilePageComponent }]),
  ],
  declarations: [ProfilePageComponent, ProfileFieldComponent],
  exports: [ProfileFieldComponent],
})
export class ProfileModule {}
