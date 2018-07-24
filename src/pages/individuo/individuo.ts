import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Form, ModalController } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { Individuo } from '../../model/individuo.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Page } from 'ionic-angular/navigation/nav-util';
import { AddIndividuoPage } from '../add-individuo/add-individuo';
import { Estacao } from '../../model/estacao.class';
import { Parcela } from '../../model/parcela.class';
import { Local } from '../../model/local.class';
import { TroncoPage } from '../tronco/tronco';

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
  local_selected: Local;
  parcela_id: number;
  pushPage: Page;
  params: Object;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public SQLService: SqLiteWrapperProvider,
    public modalCtrl: ModalController
  ) {

    // Formulario para adicionar Individuo
    this.pushPage = AddIndividuoPage;


    
    // if(this.navParams.get('estacao')){
    //   this.estacao_selected = this.navParams.get('estacao');
    // }

    //console.log('Parcela',this.navParams.get('parcela'));

    if(this.navParams.get('parcela')){

      let id_parcela = this.navParams.get('parcela').id;
      let parcela_active = new Parcela(id_parcela);


      parcela_active.get().then( (row_parcela)=>{
        this.parcela_selected = row_parcela;
        this.parcela_id = this.parcela_selected.id;

        row_parcela.getEstacao().then( (row_estacao)=>{
          this.estacao_selected = row_estacao;
        
          row_estacao.getLocal().then( (row_local: Local)=>{
             this.local_selected = row_local;

             this.params = {
              parcela: this.parcela_selected,
              estacao: this.estacao_selected
            };

          });

        })
      })
     
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

  chamarTroncos(individuo:Individuo){

     //   // show modal with page 'addTronco'
      let troncoModal = this.modalCtrl.create(TroncoPage, {individuo: individuo});
      troncoModal.present();


    // new Individuo(individuo_id).get().then( individuo_active=>{
    
   

    // });
  }
}
