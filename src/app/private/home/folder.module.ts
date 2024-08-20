import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { FolderPage } from './folder.page';
import { PhoneNumberPipe } from 'src/app/pipes/phone-number/phone-number.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    PhoneNumberPipe,
    HttpClientModule
  ],
  declarations: [FolderPage]
})
export class FolderPageModule {}
