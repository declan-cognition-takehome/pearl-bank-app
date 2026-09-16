import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PbStatus = 'pending' | 'active' | 'blocked' | 'complete';

const STATUS_LABELS: Record<PbStatus, string> = {
  pending: 'Pending',
  active: 'Active',
  blocked: 'Blocked',
  complete: 'Complete',
};

@Component({
  selector: 'pb-status-chip',
  template: `
    <mat-chip-list aria-label="Status">
      <mat-chip [class]="'pb-status-chip--' + status" [selectable]="false" disableRipple>
        {{ label }}
      </mat-chip>
    </mat-chip-list>
  `,
  styles: [
    `
      .pb-status-chip--complete { background: #d8f3e4; }
      .pb-status-chip--active { background: #d3e3e8; }
      .pb-status-chip--pending { background: #fff1c2; }
      .pb-status-chip--blocked { background: #f9d9d6; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PbStatusChipComponent {
  @Input() status: PbStatus = 'pending';

  get label(): string {
    return STATUS_LABELS[this.status];
  }
}
