import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Form } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Individuo } from '../../model/individuo.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Page } from 'ionic-angular/navigation/nav-util';
import { AddIndividuoPage } from '../add-individuo/add-individuo';
import { Estacao } from '../../model/estacao.class';

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
  estacao_selected: Estacao;
  estacao_id: number;
  pushPage: Page;
  params: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public SQLService: SqLiteWrapperProvider) {

    this.pushPage = AddIndividuoPage;

    if(this.navParams.get('estacao')){

      this.estacao_selected = this.navParams.get('estacao');

      console.log(this.estacao_selected);

      this.estacao_id = this.estacao_selected.id;

      this.params = {
        estacao: this.estacao_selected
      };
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividuoPage');
  }

  // On Active Page
  ionViewWillEnter(){
    console.log('Active Page Individuo');
    this.reloadIndividuos();
  }

  getTroncos(i) {
    
  }

  reloadIndividuos(){
    this.SQLService.getIndividuos(this.estacao_id)
        .then( rows => {
          this.individuos = rows;
          console.log('listando individuos',rows);
        });
  }
}
