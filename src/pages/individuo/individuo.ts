import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Form, ModalController, LoadingController, Modal } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Individuo } from '../../model/individuo.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Page } from 'ionic-angular/navigation/nav-util';
import { AddIndividuoPage } from '../add-individuo/add-individuo';
import { Estacao } from '../../model/estacao.class';
import { Parcela } from '../../model/parcela.class';
import { Local } from '../../model/local.class';
import { TroncoPage } from '../tronco/tronco';
import { PaginaBase } from '../../infraestrutura/PaginaBase';

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
export class IndividuoPage extends PaginaBase {

  individuos: Individuo[] = [];
  estacao_selected: Estacao;
  parcela_selected: Parcela;
  local_selected: Local;
  parcela_id: number;
  pushPage: Page;
  params: Object;
  foiCarregado:boolean = false;
  loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public SQLService: SqLiteWrapperProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
  ) {
    
    super({
      loadingCtrl: loadingCtrl,
      navParams: navParams
    });

    this.foiCarregado = false;

    // Formulario para adicionar Individuo
    this.pushPage = AddIndividuoPage;

    // se tela for carregada por chamada da view Parcela
    if(this.navParams.get('parcela')){
      let parcela_id = this.navParams.get('parcela').id;
      this.populateItemsNav(parcela_id);
    } else {
      
      // teste
      this.populateItemsNav(1);

    }

  }

  doCarregarValidadores():void{
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

  populateItemsNav(parcela_id:number){
      
      
      let parcela_active = new Parcela(parcela_id);


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

  reloadIndividuos(){
    this.SQLService.getIndividuos(this.parcela_id, true)
        .then( rows => {

          this.individuos = rows;
          console.log('listando individuos',rows);

          this.foiCarregado = true;
          
        });
  }

  chamarTroncos(individuo:Individuo){

    console.log(individuo);
    
    let troncoModal:Modal = this.modalCtrl.create(TroncoPage, {individuo: individuo});

    

    let msg = "Carregando Troncos do individuo - "+individuo.id;
    this.mostrarLoading(msg).then( ()=>{
  
      troncoModal.present().then( ()=>{
        this.esconderLoading();
      });
  
    })

    
    

    
      // .then( ()=>{
        // show modal with page 'addTronco'
      //   troncoModal.present().then( ()=>{
      //     this.esconderLoading();
      //   });
      // // });

    // new Individuo(individuo_id).get().then( individuo_active=>{
    // });
  }
}
