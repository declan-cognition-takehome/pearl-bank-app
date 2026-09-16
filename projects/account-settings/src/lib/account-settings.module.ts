import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProfileModule } from '@pearl/profile';
import { PbDesignSystemModule } from '@pearl/shared-design-system';

import { AccountSettingsPageComponent } from './account-settings-page.component';

@NgModule({
  imports: [
    CommonModule,
    PbDesignSystemModule,
    ProfileModule,
    MatCheckboxModule,
    RouterModule.forChild([{ path: '', component: AccountSettingsPageComponent }]),
  ],
  declarations: [AccountSettingsPageComponent],
})
export class AccountSettingsModule {}
