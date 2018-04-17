import { NgModule } from '@angular/core';
import { ExpansionPanelComponent } from './expansion-panel/expansion-panel';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
	declarations: [ExpansionPanelComponent],
	imports: [],
	exports: [ExpansionPanelComponent]
})
export class ComponentsModule {}
