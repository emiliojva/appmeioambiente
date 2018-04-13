import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { DatePipe } from '@angular/common';
import { EstacaoPage } from '../estacao/estacao';

/**
 * Generated class for the LocalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-local',
  templateUrl: 'local.html',
})
export class LocalPage {

  locais: Array<any> = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private SQLService: SqLiteWrapperProvider, 
    private alert: AlertController,
    private platform: Platform) {

      // Returns table list 'locais'
      this.SQLService.getLocais()          
        .then( (rows) => {
          console.log(typeof(rows),'results local',JSON.stringify(rows));
          this.locais = rows;
      });
    
      //   .then( (results) => {

      //     console.log('results local',results.rows);

      //     for (let index = 0; index < results.rows.length; index++) {
      //       console.log(results.rows.item(index).codigo);
      //       this.locais.push(results.rows.item(index));
      //     }

      // });
    
     
  }

  ngOnInit(){
    console.log('#### ngInit ####', new Date().getHours+':', new Date().getMinutes()+':', new Date().getSeconds());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalPage');
  }

  chamarEstacoes(local){

    console.log(local.descricao);

    // var index = this.locais.findIndex(function(element,index){
    //   if(element.id == local.id){
    //     return element;
    //   }
    // });

    console.log('LOCAL CLICADO',local);

    // Verifies the presence of the ALERT plugin. If not returns error.
    // let localName = this.locais[index].descricao;
    // let btnAlert = this.alert.create({
    //   title: 'Local Escolhido',
    //   subTitle: 'Local: '+ localName,
    //   buttons: ['OK']
    // });

    // btnAlert.present().then( () => {  
    // });

    this.navCtrl.push(EstacaoPage, {local: local});

    



  }


 

}
