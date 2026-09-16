import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PbAnalyticsModule } from '@pearl/shared-analytics';
import { PbAuthModule } from '@pearl/shared-auth';
import { PbDesignSystemModule } from '@pearl/shared-design-system';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    PbDesignSystemModule,
    PbAuthModule,
    PbAnalyticsModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
