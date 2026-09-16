import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@pearl/shared-auth';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'accounts' },
  {
    path: 'onboarding',
    loadChildren: () => import('@pearl/kyc-flow').then((m) => m.KycFlowModule),
  },
  {
    path: 'accounts',
    canActivate: [AuthGuard],
    data: { scope: 'accounts:read' },
    loadChildren: () => import('@pearl/accounts').then((m) => m.AccountsModule),
  },
  {
    path: 'payments',
    canActivate: [AuthGuard],
    data: { scope: 'payments:write' },
    loadChildren: () => import('@pearl/payments').then((m) => m.PaymentsModule),
  },
  {
    path: 'scheduled-payments',
    canActivate: [AuthGuard],
    data: { scope: 'payments:write' },
    loadChildren: () => import('@pearl/scheduled-payments').then((m) => m.ScheduledPaymentsModule),
  },
  {
    path: 'statements',
    canActivate: [AuthGuard],
    data: { scope: 'statements:read' },
    loadChildren: () => import('@pearl/statements').then((m) => m.StatementsModule),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('@pearl/profile').then((m) => m.ProfileModule),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    data: { scope: 'profile:write' },
    loadChildren: () => import('@pearl/account-settings').then((m) => m.AccountSettingsModule),
  },
  { path: '**', redirectTo: 'accounts' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
