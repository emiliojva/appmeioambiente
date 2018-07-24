/**
 * Modules
 */
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Platform } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion'; // Module MatExpansion from AngularMaterial. Use <mat-accordion> for instance

/**
 *  Plugins
 */
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { FormGroup } from '@angular/forms'

/**
 * Components
 */
import { MyApp } from './app.component';

/**
 * Pages
 */
import { HomePage } from '../pages/home/home';
import { LocalPage } from '../pages/local/local';
import { EstacaoPage } from '../pages/estacao/estacao';
import { AddEstacaoPage } from '../pages/estacao/add-estacao/add-estacao';
import { IndividuoPage } from '../pages/individuo/individuo';
import { AddIndividuoPage } from '../pages/add-individuo/add-individuo';
import { AddTroncoPage } from '../pages/add-tronco/add-tronco';
import { Individuo2Page } from '../pages/individuo2/individuo2';
import { AddParcelaPage } from '../pages/add-parcela/add-parcela';
import { TroncoPage } from '../pages/tronco/tronco';

/**
 * Providers & Services
 */
import { SqLiteWrapperProvider } from '../providers/sq-lite-wrapper/sq-lite-wrapper';
import { SQLiteMock } from '../model/mock.sqlite'; // Mock SQLite
import { UtilityProvider } from '../providers/utility/utility';
import { ParcelaPage } from '../pages/parcela/parcela';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LocalPage,
    EstacaoPage,
    AddEstacaoPage,
    ParcelaPage,
    AddParcelaPage,
    Individuo2Page,
    IndividuoPage,
    AddIndividuoPage,
    AddTroncoPage,
    TroncoPage    
  ],
  imports: [
    MatExpansionModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    ComponentsModule,
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
    AddParcelaPage,
    ParcelaPage,
    TroncoPage
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


// function factory to custom Providers lazy loading
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