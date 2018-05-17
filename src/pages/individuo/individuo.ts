import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Form } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Individuo } from '../../model/individuo.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Page } from 'ionic-angular/navigation/nav-util';
import { AddIndividuoPage } from '../add-individuo/add-individuo';
import { Estacao } from '../../model/estacao.class';
import { Parcela } from '../../model/parcela.class';

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
  parcela_selected: Parcela;
  parcela_id: number;
  pushPage: Page;
  params: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public SQLService: SqLiteWrapperProvider) {

    this.pushPage = AddIndividuoPage;


    if(this.navParams.get('estacao')){
      this.estacao_selected = this.navParams.get('estacao');
    }

    if(this.navParams.get('parcela')){

      this.parcela_selected = this.navParams.get('parcela');
      
      this.parcela_id = this.parcela_selected.id;

      this.params = {
        parcela: this.parcela_selected,
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
    
    if(this.parcela_selected){
      this.reloadIndividuos();
    }
      
  }

  getTroncos(i) {
    
  }

  reloadIndividuos(){
    this.SQLService.getIndividuos(this.parcela_id, true)
        .then( rows => {
          this.individuos = rows;
          console.log('listando individuos',rows);
        });
  }
}
