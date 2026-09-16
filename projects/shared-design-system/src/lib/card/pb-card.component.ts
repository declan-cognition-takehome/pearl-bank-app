import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pb-card',
  template: `
    <mat-card [class.pb-card-flat]="flat">
      <mat-card-header *ngIf="title">
        <mat-card-title>{{ title }}</mat-card-title>
        <mat-card-subtitle *ngIf="subtitle">{{ subtitle }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
      <mat-card-actions *ngIf="hasActions" align="end">
        <ng-content select="[pbCardActions]"></ng-content>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./pb-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PbCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() flat = false;
  @Input() hasActions = false;
}
