import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pb-page-header',
  template: `
    <header class="pb-page-header">
      <div>
        <h1 class="pb-page-header__title">{{ title }}</h1>
        <p *ngIf="subtitle" class="pb-page-header__subtitle pb-muted">{{ subtitle }}</p>
      </div>
      <div class="pb-page-header__actions"><ng-content></ng-content></div>
    </header>
  `,
  styles: [
    `
      .pb-page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
      }
      .pb-page-header__title {
        margin: 0 0 4px;
        font-size: 28px;
        font-weight: 600;
      }
      .pb-page-header__subtitle {
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PbPageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
