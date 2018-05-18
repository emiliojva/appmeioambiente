import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Individuo } from '../../model/individuo.class';

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

  troncos: Array<any> = [];
  troncoFormArray: Array<FormGroup> = [];
  troncoForm: FormGroup;
  individuo: Individuo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder) {

      
    if(this.navParams.get('individuo')){
      console.log(this.navParams.get('individuo'));
      this.individuo = this.navParams.get('individuo')
      for (let i = 0; i < this.individuo.numero_de_troncos; i++ ) {
        this.troncos.push(
          { 
            individuoID: 1 //this.individuo.id 
          }
        );
      }
    }

    this.createForm();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTroncoPage');
  }

  private createForm() {

    for (let i = 0; i < this.troncos.length; i++) {

      this.troncoForm = this.formBuilder.group({
        // individuo_id: [],
        tronco_lacre: ['', Validators.required],
        tronco_dap: ['',Validators.required],
        tronco_obs: ['', Validators.required],
        tronco_cond: ['', Validators.required]
      });

      this.troncoFormArray.push(this.troncoForm);
    }

    console.log(this.troncoFormArray);
  }

  private logForm() {

    for (let i = 0; i < this.troncoFormArray.length; i++) {

      let tronco = this.troncoFormArray[i];
      let formValid = tronco.valid;
      

      // if(formValid) {
      
      //   let data_to_save = tronco.value; 
        
      //   console.log(tronco);
      //   // store tronco in Database
      // }
      // else {

      //   // alert the user
      // }
      console.log(formValid);
    }

  }
}
