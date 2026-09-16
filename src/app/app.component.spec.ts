import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PbAuthModule } from '@pearl/shared-auth';

import { AppComponent } from './app.component';

describe('Pearl Bank shell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, MatToolbarModule, PbAuthModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('renders navigation for every feature area and the signed-in customer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.shell__link').length).toBe(7);
    expect(el.querySelector('[data-testid="signed-in-as"]')?.textContent?.trim()).toBe('Amelia Ng');
  });
});
