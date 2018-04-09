import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddPage } from './add/add';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EstacaoPage');
  }

  addEstacao(){

    this.navCtrl.push(AddPage)

  }

}
