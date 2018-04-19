import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Form } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Individuo } from '../../model/individuo.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';

/**
 * Generated class for the IndividuoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-individuo',
  templateUrl: 'individuo.html',
})
export class IndividuoPage {

  individuos: Individuo[] = [];
  estacao_selected: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public SQLService: SqLiteWrapperProvider) {

    if(this.navParams.get('estacao')){

      this.estacao_selected = this.navParams.get('estacao');
      this.SQLService.getIndividuos(this.estacao_selected)
        .then( rows => {
          this.individuos = rows;
          console.log('listando estacoes',rows);
        });
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividuoPage');
  }

  getTroncos(i) {
    
  }
}
