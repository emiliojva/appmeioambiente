import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Individuo } from '../../model/individuo.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Tronco } from '../../model/tronco.class';
import { AddTroncoPage } from '../add-tronco/add-tronco';
import { FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { PaginaBase } from '../../infraestrutura/PaginaBase';
import { ConfiguracaoPaginaBase } from '../../infraestrutura/ConfiguracaoPaginaBase';

import { FormBuilder } from '@angular/forms';

/**
 * Generated class for the TroncoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tronco',
  templateUrl: 'tronco.html',
})
export class TroncoPage extends PaginaBase {

  navPage: any;
  navPageParams: any;
  
  troncos: Array<Tronco> = [];
  troncoFormArray: Array<FormGroup> = [];
  individuo: Individuo;
  altura: number;
  step = 0;
  loading: Loading;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private SQLService: SqLiteWrapperProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController
   ) {
    super({
      formBuilder: formBuilder,
      navParams: navParams,
      loadingCtrl: loadingCtrl
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TroncoPage');
  }

  destroy(id){
    alert(id);

    // let tronco_active = new Tronco().get();
    // tronco_active.then( ()=>{

    // })
  }

  doCarregarValidadores():void{

    let individuo_id = 1;

    if(this._navParams.get('individuo')){
      individuo_id = this._navParams.get('individuo').id;    
    }

    let individuo = new Individuo(individuo_id);

    console.log(individuo);

    individuo.get().then( individuo_active => {

      this.navPage = AddTroncoPage;
      // this.navPageParams = {individuo: new Individuo(individuo_id)}
    
      this.SQLService.getTroncos(individuo_id).then( (rows:Tronco[]) => {

        this.troncos = rows;

        for (let i = 0; i < rows.length; i++) {

          let tronco: Tronco = rows[i];

          let form = this._formBuilder.group(
            {
              //individuo_id: [1,Validators.required], //test
              individuo_id: [tronco.individuo_id || 1,Validators.required],
              lacre: [tronco.lacre, Validators.required],
              dap: [tronco.dap,Validators.required],
              observacao: [tronco.observacao, [] ],
              condicao: [tronco.condicao, Validators.required]
            }
          );

          this.troncoFormArray.push(form);

        }

        // loading.dismiss();
        // this.esconderLoading();

      })
    
    })

  }


  toValidateForms(): boolean{
    
    for (let i = 0; i < this.troncoFormArray.length; i++) {

      let troncoForm = this.troncoFormArray[i];
      let formValid = troncoForm.valid;
      
      // console.log(troncoForm.value,formValid);
     
      if(!formValid && troncoForm.enabled) { 

        alert('Faltando preencher Formulário n°'+ (i+1) );

        this.setStep(i);

        return false;
      } 
    }

    // Só permite passar para gravação se tiver digitado altura
    if(!this.altura){
      alert("Escolha a altura de um tronco");
      return false;
    }
    
    // se conseguir passar pelo loop, considera-se que os forms estão aptos 
    return true;
  }
  
  public setStep(pos: number){
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
