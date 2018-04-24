import { Component, Input } from '@angular/core';

/**
 * Generated class for the ExpansionPanelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'expansion-panel',
  templateUrl: 'expansion-panel.html'
})
export class ExpansionPanelComponent {

  @Input('quantidade') quantidade: number;

  panelOpenState: boolean = false;

}
