import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';

describe('@pearl/shared-analytics', () => {
  let analytics: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    analytics = TestBed.inject(AnalyticsService);
  });

  it('buffers events until flushed', () => {
    analytics.pageView('accounts', 'overview');
    analytics.track('accounts', 'transaction_expanded', { id: 'txn_1' });
    expect(analytics.pending().length).toBe(2);
    expect(analytics.pending()[0]).toEqual(
      jasmine.objectContaining({ feature: 'accounts', name: 'page_view', properties: { page: 'overview' } })
    );
    const flushed = analytics.flush();
    expect(flushed.length).toBe(2);
    expect(analytics.pending().length).toBe(0);
  });
});
