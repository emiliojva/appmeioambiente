import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { SQLite } from '@ionic-native/sqlite';
import { SqLiteWrapperProvider } from '../providers/sq-lite-wrapper/sq-lite-wrapper';
import { FormGroup } from '@angular/forms'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LocalPage } from '../pages/local/local';
import { EstacaoPage } from '../pages/estacao/estacao';
import { AddEstacaoPage } from '../pages/estacao/add-estacao/add-estacao';
import { IndividuoPage } from '../pages/individuo/individuo';
import { AddIndividuoPage } from '../pages/add-individuo/add-individuo';
import { AddTroncoPage } from '../pages/add-tronco/add-tronco';
import { MatExpansionModule } from '@angular/material/expansion';
import { Individuo2Page } from '../pages/individuo2/individuo2';
import { AddParcelaPage } from '../pages/add-parcela/add-parcela';
// Mock SQLite
import { SQLiteMock } from '../model/mock.sqlite';
import { UtilityProvider } from '../providers/utility/utility';




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LocalPage,
    EstacaoPage,
    AddEstacaoPage,
    IndividuoPage,
    AddIndividuoPage,
    AddTroncoPage,
    Individuo2Page,
    AddParcelaPage
  ],
  imports: [
    MatExpansionModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LocalPage,
    EstacaoPage,
    AddEstacaoPage,
    IndividuoPage,
    AddIndividuoPage,
    AddTroncoPage,
    Individuo2Page,
    AddParcelaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SqLiteWrapperProvider,
    UtilityProvider,
    // SQLite,
    {provide: SQLite, useClass: SQLiteMock},
    // {provide: SQLite, useFactory: factorySQLite},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}



function factorySQLite(){
    console.log('Mobile?', UtilityProvider.isMobile);
    return new SQLite();
  
    // if(UtilityProvider.isMobile){
    //   console.log('MOBILE SQLite');
    //   return new SQLite();
    // }  else {
    //   console.log('BROWSER SQLiteMock');
    //   return new SQLiteMock();
    // }
  
}