import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { PbAnalyticsModule } from '@pearl/shared-analytics';
import { PbAuthModule } from '@pearl/shared-auth';
import { PbDesignSystemModule } from '@pearl/shared-design-system';

import { AccountsPageComponent } from './accounts-page/accounts-page.component';

@NgModule({
  imports: [
    CommonModule,
    PbDesignSystemModule,
    PbAuthModule,
    PbAnalyticsModule,
    MatTableModule,
    RouterModule.forChild([{ path: '', component: AccountsPageComponent }]),
  ],
  declarations: [AccountsPageComponent],
})
export class AccountsModule {}
