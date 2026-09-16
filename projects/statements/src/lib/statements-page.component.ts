import { ChangeDetectionStrategy, Component } from '@angular/core';

import { StatementsService } from './statements.service';

@Component({
  selector: 'pearl-statements-page',
  template: `
    <div class="pb-page">
      <pb-page-header title="Statements" subtitle="Download or view past statements"></pb-page-header>
      <pb-card *ngFor="let group of statements.byAccount() | keyvalue" [title]="group.key">
        <mat-list>
          <mat-list-item *ngFor="let statement of group.value" [attr.data-testid]="statement.id">
            <mat-icon matListIcon>description</mat-icon>
            <span matLine>{{ statement.period }}</span>
            <span matLine class="pb-muted">{{ statement.pages }} pages · closing {{ statement.closingBalance | pbMoney }}</span>
            <pb-button variant="link">Download</pb-button>
          </mat-list-item>
        </mat-list>
      </pb-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class StatementsPageComponent {
  constructor(readonly statements: StatementsService) {}
}
