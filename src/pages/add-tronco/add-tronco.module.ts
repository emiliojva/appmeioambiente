import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTroncoPage } from './add-tronco';

@NgModule({
  declarations: [
    AddTroncoPage,
  ],
  imports: [
    IonicPageModule.forChild(AddTroncoPage),
  ],
})
export class AddTroncoPageModule {}
