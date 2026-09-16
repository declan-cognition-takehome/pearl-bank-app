import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/** Read-only label/value row with an inline edit affordance. Reused by account settings. */
@Component({
  selector: 'pearl-profile-field',
  template: `
    <div class="profile-field">
      <span class="profile-field__label pb-muted">{{ label }}</span>
      <span class="profile-field__value" *ngIf="!editing">{{ value }}</span>
      <mat-form-field appearance="outline" *ngIf="editing" class="profile-field__input">
        <input matInput [value]="value" (input)="draft = $any($event.target).value" (keyup.enter)="save()" />
      </mat-form-field>
      <pb-button variant="link" (pressed)="editing ? save() : (editing = true)">{{ editing ? 'Save' : 'Edit' }}</pb-button>
    </div>
  `,
  styles: [
    `
      .profile-field { display: grid; grid-template-columns: 140px 1fr auto; align-items: center; gap: 8px; padding: 8px 0; }
      .profile-field__input { margin: 0; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProfileFieldComponent {
  @Input() label = '';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  editing = false;
  draft = '';

  save(): void {
    if (this.draft && this.draft !== this.value) {
      this.valueChange.emit(this.draft);
    }
    this.editing = false;
  }
}
