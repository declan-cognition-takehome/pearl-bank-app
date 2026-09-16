import { Component } from '@angular/core';
import { AuthSessionService } from '@pearl/shared-auth';

export interface NavLink {
  path: string;
  label: string;
}

@Component({
  selector: 'pb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly displayName$ = this.session.displayName();

  readonly links: NavLink[] = [
    { path: '/accounts', label: 'Accounts' },
    { path: '/payments', label: 'Pay' },
    { path: '/scheduled-payments', label: 'Scheduled' },
    { path: '/statements', label: 'Statements' },
    { path: '/profile', label: 'Profile' },
    { path: '/settings', label: 'Settings' },
    { path: '/onboarding', label: 'Verify identity' },
  ];

  constructor(private readonly session: AuthSessionService) {}
}
