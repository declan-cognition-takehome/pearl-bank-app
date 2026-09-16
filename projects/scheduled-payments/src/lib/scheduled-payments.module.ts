import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
