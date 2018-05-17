import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

/**
 * Generated class for the AddTroncoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-tronco',
  templateUrl: 'add-tronco.html',
})
export class AddTroncoPage {

  troncos: Array<any> = ['joao','feijo'];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder) {
      
    if(this.navParams.get('individuo')){
      console.log(this.navParams.get('individuo'));
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTroncoPage');
  }


}
