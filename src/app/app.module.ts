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
import { ExpansionPanelComponent } from '../components/expansion-panel/expansion-panel';
import { MatExpansionModule } from '@angular/material/expansion';
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
    ExpansionPanelComponent
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
    AddTroncoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SqLiteWrapperProvider,
    UtilityProvider,
    // SQLite,
    {provide: SQLite, useClass: SQLiteMock},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}