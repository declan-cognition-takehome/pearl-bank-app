import { NgModule } from '@angular/core';

import { AuthGuard } from './auth.guard';
import { AuthSessionService } from './auth-session.service';

@NgModule({
  providers: [AuthSessionService, AuthGuard],
})
export class PbAuthModule {}
