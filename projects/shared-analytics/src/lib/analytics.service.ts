import { Injectable } from '@angular/core';

export interface AnalyticsEvent {
  name: string;
  feature: string;
  properties?: Record<string, string | number | boolean>;
  at: number;
}

/**
 * Thin product-analytics facade. Features call `track()`/`pageView()`;
 * the buffer is flushed to the analytics collector by the shell in production.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly buffer: AnalyticsEvent[] = [];

  track(feature: string, name: string, properties?: AnalyticsEvent['properties']): void {
    this.buffer.push({ feature, name, properties, at: Date.now() });
  }

  pageView(feature: string, page: string): void {
    this.track(feature, 'page_view', { page });
  }

  /** Returns and clears the buffered events. */
  flush(): AnalyticsEvent[] {
    return this.buffer.splice(0, this.buffer.length);
  }

  pending(): readonly AnalyticsEvent[] {
    return this.buffer;
  }
}
