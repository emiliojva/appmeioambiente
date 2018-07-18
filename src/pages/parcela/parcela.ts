import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Estacao } from '../../model/estacao.class';
import { Page } from 'ionic-angular/navigation/nav-util';
import { IndividuoPage } from '../individuo/individuo';
import { Parcela } from '../../model/parcela.class';
import { AddParcelaPage } from '../add-parcela/add-parcela';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Local } from '../../model/local.class';

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
  loading: any;
  local : Local;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private SQLService: SqLiteWrapperProvider,
    public loadingCtrl: LoadingController
  ) {

    if(this.navParams.get('estacao')){

      this.estacao_selected = this.navParams.get('estacao');

      this.estacao_id = this.estacao_selected.id;

      console.log(this.estacao_id);

      this.params = {
        estacao: this.estacao_selected
      };

      this.SQLService.getLocais(this.estacao_selected.local_id).then( local => {

        if(local[0])
          this.local = local[0];

      })

    }

  }

  populateParcelas():Promise<any>{
    return this.SQLService.getParcelas(this.estacao_id, true)
      .then( (rows) => {
        this.parcelas = rows;
      });
  }

  // On Active Page
  ionViewWillEnter(){
    console.log('Active Page Estacao');
    this.reloadPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParcelaPage');
  }

  reloadPage(){

    // creates
    this.loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });

    // show loading
    this.loading.present();

    let p1 = this.populateParcelas();

    // let p2 = this.populateEstacaos();

    Promise.all([
      p1
      // ,
      // p2
    ])
      .then( () => {
        this.loading.dismiss();
      });
  }

  chamarIndividuos(parcela:Parcela){
    this.navCtrl.push(IndividuoPage,{parcela: parcela, estacao: this.estacao_selected});
  }

  addParcela(){

    let estacao = JSON.stringify(this.estacao_selected);
    let param = JSON.parse(estacao);

    param.local_descricao = this.local.descricao;
    this.navCtrl.push(AddParcelaPage, {estacao: param});

  }

}
