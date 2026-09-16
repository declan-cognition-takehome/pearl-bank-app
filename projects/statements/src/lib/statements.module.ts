import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PbDesignSystemModule } from '@pearl/shared-design-system';

import { StatementsPageComponent } from './statements-page.component';

@NgModule({
  imports: [
    CommonModule,
    PbDesignSystemModule,
    MatListModule,
    MatIconModule,
    RouterModule.forChild([{ path: '', component: StatementsPageComponent }]),
  ],
  declarations: [StatementsPageComponent],
})
export class StatementsModule {}
