import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LocalPage } from '../pages/local/local';
import { EstacaoPage } from '../pages/estacao/estacao';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';

import { SQLite } from '@ionic-native/sqlite';
import { SqLiteWrapperProvider } from '../providers/sq-lite-wrapper/sq-lite-wrapper';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LocalPage,
    EstacaoPage
  ],
  imports: [
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
    EstacaoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    SqLiteWrapperProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
