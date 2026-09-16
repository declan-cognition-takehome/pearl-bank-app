import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PbAnalyticsModule } from '@pearl/shared-analytics';
import { PbAuthModule } from '@pearl/shared-auth';
import { PbDesignSystemModule } from '@pearl/shared-design-system';

import { PaymentsPageComponent } from './payments-page.component';

@NgModule({
  imports: [
    CommonModule,
    PbDesignSystemModule,
    PbAuthModule,
    PbAnalyticsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    RouterModule.forChild([{ path: '', component: PaymentsPageComponent }]),
  ],
  declarations: [PaymentsPageComponent],
})
export class PaymentsModule {}
