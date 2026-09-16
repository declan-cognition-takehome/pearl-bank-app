import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type PbButtonVariant = 'primary' | 'secondary' | 'link';

@Component({
  selector: 'pb-button',
  template: `
    <button
      *ngIf="variant === 'primary'"
      mat-raised-button
      color="primary"
      type="button"
      [disabled]="disabled"
      (click)="pressed.emit()"
    >
      <ng-container *ngTemplateOutlet="label"></ng-container>
    </button>
    <button
      *ngIf="variant === 'secondary'"
      mat-stroked-button
      color="primary"
      type="button"
      [disabled]="disabled"
      (click)="pressed.emit()"
    >
      <ng-container *ngTemplateOutlet="label"></ng-container>
    </button>
    <button
      *ngIf="variant === 'link'"
      mat-button
      color="primary"
      type="button"
      [disabled]="disabled"
      (click)="pressed.emit()"
    >
      <ng-container *ngTemplateOutlet="label"></ng-container>
    </button>
    <ng-template #label><ng-content></ng-content></ng-template>
  `,
  styleUrls: ['./pb-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PbButtonComponent {
  @Input() variant: PbButtonVariant = 'primary';
  @Input() disabled = false;
  @Output() pressed = new EventEmitter<void>();
}
