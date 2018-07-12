import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Individuo } from '../../model/individuo.class';
import { Estacao } from '../../model/estacao.class';
import { Parcela } from '../../model/parcela.class';
import { Page } from '../../../node_modules/ionic-angular/navigation/nav-util';

/**
 * Generated class for the TroncoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tronco',
  templateUrl: 'tronco.html',
})
export class TroncoPage {

  individuos: Individuo[] = [];
  estacao_selected: Estacao;
  parcela_selected: Parcela;
  parcela_id: number;
  pushPage: Page;
  params: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TroncoPage');
  }

}
