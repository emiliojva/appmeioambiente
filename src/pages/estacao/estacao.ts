import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AddEstacaoPage } from './add-estacao/add-estacao';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Estacao } from '../../model/estacao.class';
import { Local } from '../../model/local.class';

/**
 * Generated class for the EstacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-estacao',
  templateUrl: 'estacao.html',
})
export class EstacaoPage {

  locais: Local[];
  local_selected: number;  
  estacaos: Estacao[];
  loading: any;

  constructor(
    public navCtrl: NavController, 
    private navParams: NavParams,
    private SQLService: SqLiteWrapperProvider, 
    private loadingCtrl: LoadingController
  ) {

    // 'Local' selected in the previous screen.
    this.local_selected = this.navParams.get('local').id;

    this.loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });

    this.loading.present();
    
  }

  // View Init Loaded
  ngOnInit(){

    // let myPromises = [];

    let p1 = this.populateLocais();

    let p2 = this.populateEstacaos();

    Promise.all([p1,p2])
      .then( () => {
        this.loading.dismiss();
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EstacaoPage');
  }

  addEstacao(){
    this.navCtrl.push(AddEstacaoPage, {local:  this.navParams.get('local')})
  }

  reloadPage(){
    console.log('trocou para local',this.local_selected);

    this.loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });

    this.loading.present();
    
    this.populateEstacaos()
      .then( () => this.loading.dismiss() );
  }

  populateEstacaos():Promise<any>{
    return this.SQLService.getEstacaos(this.local_selected)
      .then( (rows) => {
        this.estacaos = rows;
        console.log(JSON.stringify(rows));
      });
  }

  populateLocais():Promise<any>{
    return this.SQLService.getLocais()          
        .then( (rows) => {
          this.locais = rows;
      });
  }
}
