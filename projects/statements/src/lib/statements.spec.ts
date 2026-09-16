import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { StatementsModule } from './statements.module';
import { StatementsPageComponent } from './statements-page.component';
import { StatementsService } from './statements.service';

describe('@pearl/statements', () => {
  it('groups statements by account', () => {
    const grouped = new StatementsService().byAccount();
    expect([...grouped.keys()]).toEqual(['Everyday Account', 'Pearl Saver']);
    expect(grouped.get('Everyday Account')?.length).toBe(2);
  });

  it('renders one list item per statement with the period as the primary line', async () => {
    await TestBed.configureTestingModule({
      imports: [StatementsModule, RouterTestingModule, NoopAnimationsModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(StatementsPageComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('mat-list-item');
    expect(items.length).toBe(3);
    expect(items[0].querySelector('.mat-line').textContent.trim()).toBe('April 2024');
  });
});
