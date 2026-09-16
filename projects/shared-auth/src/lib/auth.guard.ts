import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthSessionService } from './auth-session.service';

/**
 * Guards feature routes. Routes declare `data: { scope: 'accounts:read' }`;
 * customers without the scope are redirected to the shell home page.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private readonly session: AuthSessionService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const scope = route.data['scope'] as string | undefined;
    if (!this.session.current) {
      return this.router.parseUrl('/');
    }
    if (scope && !this.session.hasScope(scope)) {
      return this.router.parseUrl('/');
    }
    return true;
  }
}
