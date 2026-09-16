import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
