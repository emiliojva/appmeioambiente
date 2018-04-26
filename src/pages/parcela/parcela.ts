import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Estacao } from '../../model/estacao.class';
import { Page } from 'ionic-angular/navigation/nav-util';
import { IndividuoPage } from '../individuo/individuo';
import { Parcela } from '../../model/parcela.class';
import { AddParcelaPage } from '../add-parcela/add-parcela';

/**
 * Generated class for the ParcelaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parcela',
  templateUrl: 'parcela.html',
})
export class ParcelaPage {

  parcelas: Array<Parcela>;
  estacao_selected: Estacao;
  estacao_id: number;
  pushPage: Page;
  params: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    if(this.navParams.get('estacao')){

      this.estacao_selected = this.navParams.get('estacao');

      this.estacao_id = this.estacao_selected.id;

      this.params = {
        estacao: this.estacao_selected
      };
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParcelaPage');
  }

  chamarIndividuos(parcela:Parcela){
    this.navCtrl.push(IndividuoPage,{parcela: parcela});
  }

  addParcela(){
    console.log(this.navParams.get('estacao'))
    this.navCtrl.push(AddParcelaPage, {local:  this.estacao_selected})
  }

}
