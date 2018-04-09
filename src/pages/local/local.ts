import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
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
      this.platform.ready()
        .then( (readySource) => {
          
          this.SQLService.createDatabase()
            .then( () => {

              this.SQLService.getLocais()          
                .then( (results) => {

                  for (let index = 0; index < results.rows.length; index++) {
                    console.log(results.rows.item(index).codigo);
                    this.locais.push(results.rows.item(index));
                  }

              });

            });

          console.log('PLATFORM BEGINS',readySource);  
          
          if(readySource == 'dom'){
            console.log('BROWSER MODE');     
          }

        })
        .catch( (error) => {
          console.log('BROWSER MODE');   
        })
  }

  ngOnInit(){
    console.log('#### ngInit ####');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalPage');
  }

  chamarEstacoes(local_id:number){

    var index = this.locais.findIndex(function(element,index){
      if(element.id == local_id){
        return element;
      }
    });

    console.log('LOCAL CLICADO',this.locais[index].descricao);

    // Verifies the presence of the ALERT plugin. If not returns error.
    let localName = this.locais[index].descricao;
    let btnAlert = this.alert.create({
      title: 'Local Escolhido',
      subTitle: 'Local: '+ localName,
      buttons: ['OK']
    });

    // btnAlert.addButton


    btnAlert.present();

    this.navCtrl.push(EstacaoPage);



  }


 

}
