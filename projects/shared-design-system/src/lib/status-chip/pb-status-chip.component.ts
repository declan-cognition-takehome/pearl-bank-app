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
    <mat-chip-set aria-label="Status">
      <mat-chip [class]="'pb-status-chip--' + status" disableRipple>{{ label }}</mat-chip>
    </mat-chip-set>
  `,
  styles: [
    `
      mat-chip.pb-status-chip--complete { --mdc-chip-elevated-container-color: #d8f3e4; }
      mat-chip.pb-status-chip--active { --mdc-chip-elevated-container-color: #d3e3e8; }
      mat-chip.pb-status-chip--pending { --mdc-chip-elevated-container-color: #fff1c2; }
      mat-chip.pb-status-chip--blocked { --mdc-chip-elevated-container-color: #f9d9d6; }
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
