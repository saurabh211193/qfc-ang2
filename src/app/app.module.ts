/// <reference types="@types/googlemaps" />
import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

import { HttpRequestService } from './services/http-request.service';
import { AppHttpInterceptor } from './services/http-interceptor';
import { CookieService } from './services/cookie.service';
import { GlobalService } from './services/global.service';
import { MasterService } from './services/master.service';
import { DynamicComponentService } from './shared/dynamic-component.service';

import { AppComponent } from './app.component';

import { AuthGuard } from './user/auth.guard';
import { MaskPipe } from './pipes/mask.pipe';
import { SecToMinPipe } from './pipes/sec-to-min.pipe';
// import { DisableControlDirective } from './directives/disable-control.directive';
// import { } from "googlemaps";


@NgModule({
  declarations: [
    AppComponent,
    SecToMinPipe
    // DisableControlDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    HttpRequestService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true
    },
    CookieService,
    GlobalService,
    MasterService,
    DynamicComponentService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
