import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatLegacyButtonHarness as MatButtonHarness } from '@angular/material/legacy-button/testing';
import { MatLegacyCardHarness as MatCardHarness } from '@angular/material/legacy-card/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PbDesignSystemModule } from './shared-design-system.module';
import { PbMoneyPipe } from './money/pb-money.pipe';

@Component({
  template: `
    <pb-page-header title="Overview" subtitle="Everything at a glance"></pb-page-header>
    <pb-card title="Everyday" subtitle="Available" [hasActions]="true">
      <span class="amount">{{ 123456 | pbMoney }}</span>
      <pb-button pbCardActions variant="primary" (pressed)="clicks = clicks + 1">Pay</pb-button>
    </pb-card>
    <pb-status-chip status="complete"></pb-status-chip>
  `,
})
class HostComponent {
  clicks = 0;
}

describe('@pearl/shared-design-system', () => {
  let fixture: ComponentFixture<HostComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbDesignSystemModule, NoopAnimationsModule],
      declarations: [HostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('renders a Material card with title, subtitle and content', async () => {
    const card = await loader.getHarness(MatCardHarness);
    expect(await card.getTitleText()).toBe('Everyday');
    expect(await card.getSubtitleText()).toBe('Available');
    expect(await card.getText()).toContain('$1,234.56');
  });

  it('pb-button renders a raised Material button and emits pressed', async () => {
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Pay' }));
    expect(await (await button.host()).hasClass('mat-raised-button')).toBeTrue();
    await button.click();
    expect(fixture.componentInstance.clicks).toBe(1);
  });

  it('pb-status-chip renders the human label for a status', () => {
    const chip: HTMLElement = fixture.nativeElement.querySelector('mat-chip');
    expect(chip.textContent?.trim()).toBe('Complete');
    expect(chip.classList).toContain('pb-status-chip--complete');
  });

  it('pb-page-header renders title and subtitle', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.pb-page-header__title')?.textContent).toBe('Overview');
    expect(el.querySelector('.pb-page-header__subtitle')?.textContent).toBe('Everything at a glance');
  });

  it('pbMoney formats minor units as AUD', () => {
    const pipe = new PbMoneyPipe();
    expect(pipe.transform(50)).toBe('$0.50');
    expect(pipe.transform(-1999)).toBe('-$19.99');
    expect(pipe.transform(null)).toBe('');
  });
});
