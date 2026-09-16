import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { PbButtonComponent } from './button/pb-button.component';
import { PbCardComponent } from './card/pb-card.component';
import { PbPageHeaderComponent } from './page-header/pb-page-header.component';
import { PbStatusChipComponent } from './status-chip/pb-status-chip.component';
import { PbMoneyPipe } from './money/pb-money.pipe';

const COMPONENTS = [
  PbButtonComponent,
  PbCardComponent,
  PbPageHeaderComponent,
  PbStatusChipComponent,
  PbMoneyPipe,
];

/**
 * Pearl Bank design system. Wraps Angular Material so that feature teams consume
 * `pb-*` components and never depend on Material internals directly.
 */
@NgModule({
  imports: [CommonModule, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  declarations: COMPONENTS,
  exports: [...COMPONENTS, MatIconModule],
})
export class PbDesignSystemModule {}
