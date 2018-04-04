import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { DatePipe } from '@angular/common';

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

  chamarIndividuos(local_id:number){
    console.log(local_id)
  }
 

}
