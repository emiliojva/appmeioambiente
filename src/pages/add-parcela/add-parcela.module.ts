import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddParcelaPage } from './add-parcela';

@NgModule({
  declarations: [
    AddParcelaPage,
  ],
  imports: [
    IonicPageModule.forChild(AddParcelaPage),
  ],
})
export class AddParcelaPageModule {}
