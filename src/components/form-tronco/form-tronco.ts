import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

/**
 * Generated class for the FormTroncoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'form-tronco',
  templateUrl: 'form-tronco.html'
})
export class FormTroncoComponent {

  text: string;
  troncoForm: FormGroup;
  

  constructor(private formBuilder: FormBuilder) {
    console.log('Hello FormTroncoComponent Component');
    this.text = 'Hello World';


    this.createForm();
  }

  private createForm() {

    // for (let i = 0; i < this.troncos.length; i++) {

      this.troncoForm = this.formBuilder.group({
        // individuo_id: [],
        tronco_lacre: ['', Validators.required],
        tronco_dap: ['',Validators.required],
        tronco_obs: ['', Validators.required],
        tronco_cond: ['', Validators.required]
      });

      // this.troncoFormArray.push(this.troncoForm);
    // }

    // console.log(this.troncoFormArray);
  }

}
