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
    this.local_selected = this.navParams.get('local');
  }

  // View Init Loaded
  ngOnInit(){
    console.log('ngOnInit');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EstacaoPage');
  }

  // On Active Page
  ionViewWillEnter(){
    console.log('Active Page Estacao');
    this.reloadPage();
  }

  addEstacao(){
    console.log(this.navParams.get('local'))
    this.navCtrl.push(AddEstacaoPage, {local:  this.local_selected})
  }

  chamarIndividuos(estacao_id:number){

    console.log(estacao_id);

    this.SQLService.getIndividuos(estacao_id)
      .then( rows => {
        console.log(rows);
      });
  }

  reloadPage(){

    // creates
    this.loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });

    // show loading
    this.loading.present();

    let p1 = this.populateLocais();

    let p2 = this.populateEstacaos();

    Promise.all([p1,p2])
      .then( () => {
        this.loading.dismiss();
      });
  }

  populateEstacaos():Promise<any>{
    return this.SQLService.getEstacaos(this.local_selected)
      .then( (rows) => {
        this.estacaos = rows;
      });
  }

  populateLocais():Promise<any>{
    return this.SQLService.getLocais()          
        .then( (rows) => {
          this.locais = rows;
      });
  }
}
