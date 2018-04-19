import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Form } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Individuo } from '../../model/individuo.class';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.individuos.push({
      id: 1,
      codigo: 33,
      estacao_id: 12,
      especie_id: 2,
      numero_de_troncos: 44,
      altura: 201,
      observacao: 'teste',
      datacriacao: new Date().getTime()
    },
    {
      id: 2,
      codigo: 33,
      estacao_id: 12,
      especie_id: 2,
      numero_de_troncos: 44,
      altura: 201,
      observacao: 'teste',
      datacriacao: new Date().getTime()
    },
    {
      id: 3,
      codigo: 33,
      estacao_id: 12,
      especie_id: 2,
      numero_de_troncos: 44,
      altura: 201,
      observacao: 'teste',
      datacriacao: new Date().getTime()
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividuoPage');
  }

  getTroncos(i) {
    
  }
}
