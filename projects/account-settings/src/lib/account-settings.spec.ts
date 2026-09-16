import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileService } from '@pearl/profile';

import { AccountSettingsModule } from './account-settings.module';
import { AccountSettingsPageComponent } from './account-settings-page.component';
import { AccountSettingsService } from './account-settings.service';

describe('@pearl/account-settings', () => {
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSettingsModule, RouterTestingModule, NoopAnimationsModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(AccountSettingsPageComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('shows the profile mobile as the alert destination', () => {
    const settings = TestBed.inject(AccountSettingsService);
    expect(settings.alertDestination()).toBe(TestBed.inject(ProfileService).snapshot().mobile);
  });

  it('toggles notification preferences via Material checkboxes', async () => {
    const marketing = await loader.getHarness(MatCheckboxHarness.with({ selector: '[data-testid="marketing"]' }));
    expect(await marketing.isChecked()).toBeFalse();
    await marketing.check();
    expect(TestBed.inject(AccountSettingsService).preferences().marketing).toBeTrue();
  });
});
