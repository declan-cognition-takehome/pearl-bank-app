import { TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatLegacyButtonHarness as MatButtonHarness } from '@angular/material/legacy-button/testing';
import { MatLegacyInputHarness as MatInputHarness } from '@angular/material/legacy-input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AnalyticsService } from '@pearl/shared-analytics';

import { ProfileModule } from './profile.module';
import { ProfilePageComponent } from './profile-page.component';
import { ProfileService } from './profile.service';

describe('@pearl/profile', () => {
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileModule, RouterTestingModule, NoopAnimationsModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(ProfilePageComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('edits a field inline and tracks the update', async () => {
    const editButtons = await loader.getAllHarnesses(MatButtonHarness.with({ text: 'Edit' }));
    expect(editButtons.length).toBe(4);
    await editButtons[0].click();
    await (await loader.getHarness(MatInputHarness)).setValue('Millie');
    await (await loader.getHarness(MatButtonHarness.with({ text: 'Save' }))).click();

    expect(TestBed.inject(ProfileService).snapshot().preferredName).toBe('Millie');
    expect(TestBed.inject(AnalyticsService).pending()[0]).toEqual(
      jasmine.objectContaining({ feature: 'profile', name: 'field_updated' })
    );
  });
});
