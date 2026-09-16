import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
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
