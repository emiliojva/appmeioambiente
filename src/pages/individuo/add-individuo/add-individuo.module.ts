import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddIndividuoPage } from './add-individuo';

@NgModule({
  declarations: [
    AddIndividuoPage,
  ],
  imports: [
    IonicPageModule.forChild(AddIndividuoPage),
  ],
})
export class AddIndividuoPageModule {}
