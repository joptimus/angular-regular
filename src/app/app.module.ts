import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PhoneNumberPipe } from './pipes/phone-number/phone-number.pipe';
import { StatusPipe } from './pipes/status/status.pipe';
import { ModalComponent } from './private/components/modal/modal.component';
import { ReceiveComponent } from './private/components/receive/receive.component';

@NgModule({
  declarations: [AppComponent, ModalComponent, ReceiveComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, PhoneNumberPipe, StatusPipe],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
