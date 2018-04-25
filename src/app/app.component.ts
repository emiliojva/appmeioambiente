import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LocalPage } from '../pages/local/local';
import { AddEstacaoPage } from '../pages/estacao/add-estacao/add-estacao';
import { IndividuoPage } from '../pages/individuo/individuo';
import { AddIndividuoPage } from '../pages/add-individuo/add-individuo';
import { AddTroncoPage } from '../pages/add-tronco/add-tronco';
import { SqLiteWrapperProvider } from '../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Individuo2Page } from '../pages/individuo2/individuo2';
import { EstacaoPage } from '../pages/estacao/estacao';
import { AddParcelaPage } from '../pages/add-parcela/add-parcela';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  @ViewChild(Nav) nav: Nav;

  // rootPage:any = AddEstacaoPage;
  // rootPage:any = LocalPage;
  rootPage:any = HomePage;

  pages: Array<{title:string, component:any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private SQLService: SqLiteWrapperProvider  ) {

    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Locais', component: LocalPage },
      { title: 'Estações', component: EstacaoPage },
      // { title: 'Adicionar Estação', component: AddEstacaoPage },
      // { title: 'Individuo', component: IndividuoPage },
      // { title: 'Adicionar Individuo', component: AddIndividuoPage },
      { title: 'Adicionar Tronco - InDev', component: AddTroncoPage },
      // { title: 'Individuo 2', component: Individuo2Page}
      { title: 'Adicionar Parcela', component: AddParcelaPage }
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // creating SQLite 
      this.SQLService.createDatabase()
          .then( () => {

            this.SQLService.populateLocal();
            this.SQLService.populateEspecie();

            console.log('### DATABASE CREATED ###', 'OK');
            console.log('SQLService Constructor - Banco Created');
            console.log('### TABLES CREATED ###');
            //this.getLocais();


          })
          .catch( (error) => {
            console.log('ERRO DE SQL-BATCH',JSON.stringify(error));
          });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  
}

