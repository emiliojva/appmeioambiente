import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTroncoPage } from './add-tronco';
import { ExpansionPanelComponent } from '../../components/expansion-panel/expansion-panel';

@NgModule({
  declarations: [
    AddTroncoPage,
    ExpansionPanelComponent
  ],
  imports: [
    IonicPageModule.forChild(AddTroncoPage),
  ],
})
export class AddTroncoPageModule {}
