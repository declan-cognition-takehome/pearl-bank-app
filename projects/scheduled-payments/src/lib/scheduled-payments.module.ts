import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { PaymentsModule } from '@pearl/payments';
import { PbDesignSystemModule } from '@pearl/shared-design-system';

import { ScheduledPaymentsPageComponent } from './scheduled-payments-page.component';

@NgModule({
  imports: [
    CommonModule,
    PbDesignSystemModule,
    PaymentsModule,
    MatSlideToggleModule,
    RouterModule.forChild([{ path: '', component: ScheduledPaymentsPageComponent }]),
  ],
  declarations: [ScheduledPaymentsPageComponent],
})
export class ScheduledPaymentsModule {}
