import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEstacaoPage } from './add-estacao';

@NgModule({
  declarations: [
    AddEstacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(AddEstacaoPage),
  ],
})
export class AddPageModule {}
