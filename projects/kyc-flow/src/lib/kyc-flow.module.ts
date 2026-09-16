import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { PbDesignSystemModule } from '@pearl/shared-design-system';
import { PbAuthModule } from '@pearl/shared-auth';

import { KycFlowPageComponent } from './kyc-flow-page/kyc-flow-page.component';
import { KycFlowService } from './kyc-flow.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PbDesignSystemModule,
    PbAuthModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    RouterModule.forChild([{ path: '', component: KycFlowPageComponent }]),
  ],
  declarations: [KycFlowPageComponent],
  providers: [KycFlowService],
})
export class KycFlowModule {}
