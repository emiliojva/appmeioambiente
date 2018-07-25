import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Individuo } from '../../model/individuo.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Tronco } from '../../model/tronco.class';
import { UtilityProvider } from '../../providers/utility/utility';
import { IndividuoPage } from '../individuo/individuo';
import { LocalPage } from '../local/local';
import { EstacaoPage } from '../estacao/estacao';
import { ParcelaPage } from '../parcela/parcela';
import { TroncoPage } from '../tronco/tronco';
import { AddIndividuoPage } from '../add-individuo/add-individuo';

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
  // troncos: Array<any> = [1,2,3];
  troncoFormArray: Array<FormGroup> = [];
  // troncoForm: FormGroup;
  individuo: Individuo;
  altura: number;
  step = 0;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private SQLService: SqLiteWrapperProvider,
    private UtilityProvider: UtilityProvider,
    public alert: AlertController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController
  ) {
      
    let individuo_id = 1;
    let individuoParam:Individuo = this.navParams.get('individuo');

    if(individuoParam.id!=null){
      this.individuo = individuoParam;
      individuo_id = individuoParam.id
    }
      
    if(this.individuo.numero_de_troncos>0){

      for (let i = 0; i < this.individuo.numero_de_troncos; i++ ) {
        this.troncos.push(
          { 
            individuoID: individuo_id
          }
        );
      }

    }

    this.createForm();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad AddTroncoPage');
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
          //individuo_id: [1,Validators.required], //test
          individuo_id: [this.individuo.id || 1,Validators.required],
          lacre: ['', Validators.required],
          dap: ['',Validators.required],
          observacao: ['', [] ],
          condicao: ['', Validators.required]
        }
      );

      this.troncoFormArray.push(form);

      // this.troncoFormArray.push(this.troncoForm);
    }

    // console.log(this.troncoFormArray);
  }

  // private logForm(posicao: number) {

  //   let troncoForm = this.troncoFormArray[posicao];
  //   let formValid = troncoForm.valid;

  //   if(formValid){


  //     let tronco:Tronco = UtilityProvider.fromJSON(troncoForm.value, Tronco);
  //     // to do save 'tronco' service
  //     this.SQLService.storeTronco(tronco).then(result => {

  //       console.log(result);
  //       troncoForm.disable();

  //       // save alert         
  //     alert('Formulário Salvo');

      
    
  //     // disable

  //     // next item accordion
  //     this.nextStep();

  //     });

      
  //   }
    
  //   console.log(formValid);
  // }


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
    
  
  private closeForm() {

    const individuo = this.individuo;
    // show modal with page 'addTronco'
    let troncoModal = this.modalCtrl.create(
      TroncoPage, {individuo: individuo}
    );
    
    var viewCtrl = this.viewCtrl;
    var nav = this.navCtrl;
    
    var arr_promises = [];

    // validando
    if(this.toValidateForms()){

      for (let i = 0; i < this.troncoFormArray.length; i++) {

        let troncoForm = this.troncoFormArray[i];
        let formValid = troncoForm.valid;
        
        // console.log(troncoForm.value,formValid);
        
        if(formValid && troncoForm.enabled) {

          troncoForm.disable();
          
          let data_to_save = troncoForm.value;
  
          // console.log('dados para salvar',data_to_save)
          
          let tronco:Tronco = UtilityProvider.fromJSON(troncoForm.value, Tronco);

          arr_promises.push( 
            
            new Promise(resolve => {

              // to do save 'tronco' service
              this.SQLService.storeTronco(tronco)
              .then(result => {
                resolve(true);
              }).catch(reject => {
                troncoForm.enable();
              })
              //console.log(tronco);
              // store tronco in Database

            })
          );
          
         
        }
      }

      // Todos os troncos salvos
      Promise.all(arr_promises).then( () => {

        let alertTronco = this.alert.create({
          title: 'Troncos Salvos com sucesso',
          buttons: [
            {
              text: 'OK',
              handler: function(){
                
                viewCtrl.dismiss();
                troncoModal.present();
              }
            }
            
          ]
        });

        alertTronco.present();

      });

      

      


      // if(this.individuo){
        // this.SQLService.getTroncos(1).then(rows => {
        //   console.log(rows,'ok');

        //   // for(results.rows)
        // });
      // }
    }
   
  }

  private chamarTroncos(individuo){
    
    let modal = this.modalCtrl;

    // show modal with page 'addTronco'
    let troncoModal = modal.create(
      TroncoPage, {individuo:individuo}
    );
    troncoModal.present();

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
