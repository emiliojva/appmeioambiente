import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndividuoPage } from './individuo';
import { ExpansionPanelComponent } from '../../components/expansion-panel/expansion-panel';


@NgModule({
  declarations: [
    IndividuoPage,
    ExpansionPanelComponent
  ],
  imports: [
    IonicPageModule.forChild(IndividuoPage),
  ],
})
export class IndividuoPageModule {}
