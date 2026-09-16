import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
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
