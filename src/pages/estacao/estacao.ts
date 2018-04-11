import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AddEstacaoPage } from './add-estacao/add-estacao';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';

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

  locais: any[] = [];
  local_selected: number;  

  loading: any;

  constructor(
    public navCtrl: NavController, 
    private navParams: NavParams,
    private SQLService: SqLiteWrapperProvider, 
    private loadingCtrl: LoadingController
  ) {

    this.loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });

    this.loading.present();

    this.local_selected = this.navParams.get('local').id;

    this.SQLService.getLocais()          
        .then( (results) => {
          for (let index = 0; index < results.rows.length; index++) {
            this.locais.push(results.rows.item(index));
          }
      });
    
  }

  ngOnInit(){
    this.loading.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EstacaoPage');
  }

  addEstacao(){

    this.navCtrl.push(AddEstacaoPage, {local:  this.navParams.get('local')})

  }

}
