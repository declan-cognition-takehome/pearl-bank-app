import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { AuthSessionService } from './auth-session.service';

describe('@pearl/shared-auth', () => {
  let session: AuthSessionService;
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule] });
    session = TestBed.inject(AuthSessionService);
    guard = TestBed.inject(AuthGuard);
  });

  function routeWithScope(scope?: string): ActivatedRouteSnapshot {
    return { data: scope ? { scope } : {} } as ActivatedRouteSnapshot;
  }

  it('exposes the demo customer session', (done) => {
    session.displayName().subscribe((name) => {
      expect(name).toBe('Amelia Ng');
      done();
    });
  });

  it('allows routes whose scope the customer holds', () => {
    expect(guard.canActivate(routeWithScope('accounts:read'))).toBeTrue();
    expect(guard.canActivate(routeWithScope())).toBeTrue();
  });

  it('redirects home when the scope is missing or the customer is signed out', () => {
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(guard.canActivate(routeWithScope('cards:write')) as UrlTree)).toBe('/');
    session.signOut();
    expect(router.serializeUrl(guard.canActivate(routeWithScope()) as UrlTree)).toBe('/');
  });
});
