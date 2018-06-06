import { Component, Inject } from '@angular/core';
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

  troncos: Array<any> = [1,2,3];
  troncoFormArray: Array<FormGroup> = [];
  troncoForm: FormGroup;
  individuo: Individuo;
  condicao: number;
  step = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    @Inject(FormBuilder) fb: FormBuilder
  ) {

      
    if(this.navParams.get('individuo')){
      console.log(this.navParams.get('individuo'));
      this.individuo = this.navParams.get('individuo')
      for (let i = 0; i < this.individuo.numero_de_troncos; i++ ) {
        this.troncos.push(
          { 
            individuoID: 1, //this.individuo.id 
            formGroup: fb.group(
              {
                individuo_id: [1,Validators.required],
                tronco_lacre: ['', Validators.required],
                tronco_dap: ['',Validators.required],
                tronco_obs: ['', Validators.required],
                tronco_cond: ['', Validators.required]
              }
            )
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

      // this.troncoForm = this.formBuilder.group({
      //   // individuo_id: [],
      //   tronco_lacre: ['', Validators.required],
      //   tronco_dap: ['',Validators.required],
      //   tronco_obs: ['', Validators.required],
      //   tronco_cond: ['', Validators.required]
      // });

      let form =  this.formBuilder.group(
        {
          individuo_id: [1,Validators.required],
          tronco_lacre: ['', Validators.required],
          tronco_dap: ['',Validators.required],
          tronco_obs: ['', Validators.required],
          tronco_cond: ['', Validators.required]
        }
      );

      this.troncoFormArray.push(form);

      // this.troncoFormArray.push(this.troncoForm);
    }

    console.log(this.troncoFormArray);
  }

  private logForm(posicao: number) {

      let troncoForm = this.troncoFormArray[posicao];
      let formValid = troncoForm.valid;

      if(formValid){

        // to do save 'tronco' service

        // save alert         
        alert('Formulário Salvo');
      
        // disable

        // next item accordion
        this.nextStep();
      }
     
      console.log(formValid);
    }


    private closeForm() {

      let allFormsClosed = false;
      for (let i = 0; i < this.troncoFormArray.length; i++) {
  
        let tronco = this.troncoFormArray[i];
        let formValid = tronco.valid;
  
        if(formValid) {
        
          let data_to_save = tronco.value; 
          
          //console.log(tronco);
          // store tronco in Database
        }
        else { 

          alert('Faltando preencher Formulário n°'+ (i+1) );
          allFormsClosed = false;

          this.setStep(i);

          return false;
          // alert the user
        }
        console.log(tronco.value,formValid);
        
      }

  }

  public setStep(pos: number){
    console.log(pos);
    this.step = pos;
  }

  public nextStep(){
    ++this.step;
  }
  
  public prevStep(){
    if(this.step>0)
      --this.step;
  }

}
