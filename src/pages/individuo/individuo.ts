import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Form } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the IndividuoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-individuo',
  templateUrl: 'individuo.html',
})
export class IndividuoPage {

  myGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.myGroup = new FormGroup({ firstName: new FormControl()});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IndividuoPage');
  }

}
