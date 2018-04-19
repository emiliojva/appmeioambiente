import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Estacao } from '../../model/estacao.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Local } from '../../model/local.class';
import { Especie } from '../../model/especie.class';
import { Individuo } from '../../model/individuo.class';
import { IndividuoPage } from '../individuo/individuo';
import { LocalPage } from '../local/local';
import { EstacaoPage } from '../estacao/estacao';

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

  @ViewChild('select_estacao') 

  locais: Local[] = [];
  local_selected: number;
  especies: Especie[] = [];
  especie_selected: number;
  estacaos: Estacao[] = [];
  estacao_selected: number;
  addIndividuoFormGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private SQLService: SqLiteWrapperProvider,
    private alert: AlertController
  ) {
    
    this.SQLService.getEspecies()
      .then( rows => this.especies = rows)

  
    if(this.navParams.get('estacao')){

      this.estacao_selected = this.navParams.get('estacao');
      this.SQLService.getIndividuos(this.estacao_selected)
        .then( rows => {
          console.log('listando estacoes',rows);
        });


    }

    
    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddIndividuoPage');
  }

  // On Active Page
  ionViewWillEnter(){
    console.log('Active Page Individuo');
    this.populateLocais();
  }

  private populateLocais():Promise<any>{
    return this.SQLService.getLocais()          
        .then( (rows) => {
          this.locais = rows;
      });
  }

  reloadSelectEstacao(){
    return this.SQLService.getEstacaos(this.local_selected)
    .then( (rows) => {
      
      this.estacaos = rows;
      console.log(this.estacaos);
      
    });
  }

  private createForm(){

    // Compose group form 
    this.addIndividuoFormGroup = this.formBuilder.group({
      especie_id:['', Validators.required ]  , 
      estacao_id:['',Validators.required], 
      numero_de_troncos: ['', [ Validators.required, Validators.min(0) ] ]   ,
      altura: ['', Validators.required],
      observacao: ['', Validators.required],
    });


  }

  logForm(){

    const navPrevious = this.navCtrl.getPrevious();

    let nav = this.navCtrl;
    // remove current page
    const indexCurrentPage = nav.getActive().index;

    let estacao_id = this.estacao_selected;

    let alertIndividuo = this.alert.create({
      title: 'Complete o formulário',
      buttons: [
        {
          text: 'OK',
          handler: function(){

            if(navPrevious == null || navPrevious.index==0){

              nav.push(IndividuoPage, {estacao: estacao_id}).then( () => {
                nav.remove(indexCurrentPage,1);   
                nav.insertPages(0,[{page: LocalPage}, {page: EstacaoPage}]);
              });                
                
            } else {
              nav.pop();
            }

          }
        }
        
      ]
    });

    // Check all fields from form
    if(this.addIndividuoFormGroup.valid){
      
      // Form data submited
      let data_to_save = this.addIndividuoFormGroup.value; 

      const individuo:Individuo = Object.assign(this.addIndividuoFormGroup.value, Individuo);

      console.log(individuo);
      
      this.SQLService.storeIndividuo(individuo).then( () => {
        
        console.log('SAVE');

        // Save Estacao in the Model
        this.SQLService.storeIndividuo(data_to_save)
        .then( (individuo:Individuo) => {

          console.log(individuo);

          alertIndividuo
            .setTitle('Formulário Salvo com Sucesso')
            .present()
        })
        .catch( (error) => {
          console.log('erro ao gravar estação',data_to_save,error);
        });

      }).catch( error => console.log(error) );
        

      } else {
        alertIndividuo.present();
      }
  }


  reloadIndividuos(){

    this.SQLService.getIndividuos(this.estacao_selected)
        .then( rows => console.log(rows) );
    
  }
}
