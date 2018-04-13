import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

/**
 * Generated class for the AddIndividuoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-individuo',
  templateUrl: 'add-individuo.html',
})
export class AddIndividuoPage {

  addIndividuoFormGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder) {


      this.createForm();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddIndividuoPage');
  }


  private createForm(){

    // Compose group form 
    this.addIndividuoFormGroup = this.formBuilder.group({

      numTronco: ['',Validators.required],
      altura: ['', Validators.required],
      obs: ['', Validators.required],
    });


  }

}
