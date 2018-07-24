import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Estacao } from '../../model/estacao.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Local } from '../../model/local.class';
import { Especie } from '../../model/especie.class';
import { Individuo } from '../../model/individuo.class';
import { IndividuoPage } from '../individuo/individuo';
import { LocalPage } from '../local/local';
import { EstacaoPage } from '../estacao/estacao';
import { Parcela } from '../../model/parcela.class';
import { Page } from 'ionic-angular/navigation/nav-util';
import { ParcelaPage } from '../parcela/parcela';
import { AddTroncoPage } from '../add-tronco/add-tronco';
import { UtilityProvider } from '../../providers/utility/utility';
import { PaginaBase } from '../../infraestrutura/PaginaBase';
import { ComunsValidadores } from '../../validadores/ComunsValidadores';

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
export class AddIndividuoPage extends PaginaBase {

  @ViewChild('select_estacao')
  @ViewChild('select_parcela') 

  locais: Local[] = [];
  local_selected: number;
  local_id: number;
  especies: Especie[] = [];
  especie_selected: number;
  estacaos: Estacao[] = [];
  estacao_selected: Estacao;
  estacao_id: number;
  addIndividuoFormGroup: FormGroup;
  pushPage: Page;
  params: Object;

  parcelas: Array<Parcela> = [];
  parcela_selected: Parcela;
  parcela_id: number;


  // depois de criar interface cpb
  foiSubmetido: boolean;
  individuoFrmGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private SQLService: SqLiteWrapperProvider,
    private alert: AlertController,
    public modal: ModalController
  ) {

    super({ formBuilder: formBuilder });
    
    this.foiSubmetido = false;
    this.SQLService.getEspecies().then( rows => this.especies = rows);
    this.SQLService.getParcelas(this.estacao_id).then( rows => {
        this.parcelas = rows;
    });

    if(this.navParams.get('estacao')){
      this.estacao_selected = this.navParams.get('estacao');
      this.estacao_id = this.estacao_selected.id;
    }

    if(this.navParams.get('parcela')){

      this.parcela_selected = this.navParams.get('parcela');

      this.parcela_id = this.parcela_selected.id;

      this.params = {
        parcela: this.parcela_selected
      };

    }

    this.doCarregarValidadores();

    // this.createForm();

    




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddIndividuoPage');
  }

  // On Active Page
  ionViewWillEnter(){
    console.log('Active Page Individuo');
    this.populateLocais();
  }

  public doCarregarValidadores():void{
    
    this.individuoFrmGroup = this._formBuilder.group({
      especie_id:['', Validators.required ], 
      parcela_id:[this.parcela_id,Validators.required], 
      numero_de_troncos: ['', [ Validators.required, Validators.min(0) ] ],
      altura: ['', Validators.required],
      observacao: ['', []],
      // email: ['', Validators.compose( [Validators.required, ComunsValidadores.email] )],
      // senha: ['', Validators.compose( [Validators.required, Validators.minLength(3)] )]
     });
  }

  popView(){
    this.navCtrl.pop();
  }

  private populateLocais():Promise<any>{
    return this.SQLService.getLocais()          
        .then( (rows) => {
          this.locais = rows;
      });
  }

  reloadSelectEstacao(){
    return this.SQLService.getEstacaos(this.local_id)
    .then( (rows) => {
      this.estacaos = rows;
      console.log('estacoes',this.estacaos);
      
    });
  }

  private createForm(){

    // Compose group form 
    this.individuoFrmGroup = this.formBuilder.group(
      {
        especie_id:['', Validators.required ]  , 
        parcela_id:[this.parcela_id,Validators.required], 
        numero_de_troncos: ['', [ Validators.required, Validators.min(0) ] ],
        altura: ['', Validators.required],
        observacao: ['', []],
  
      }
    );

  }

  logForm(){

    const $this = this;

    let formValid = this.individuoFrmGroup.valid;

    // Form data submited
    let data_to_save = this.individuoFrmGroup.value; 

    // let individuo:Individuo = Object.assign(this.addIndividuoFormGroup.value, Individuo);
    let individuo:Individuo = UtilityProvider.fromJSON(this.individuoFrmGroup.value, Individuo);

    const navPrevious = this.navCtrl.getPrevious();

    const nav = this.navCtrl;
    const modal = this.modal;

    
    // remove current page
    const indexCurrentPage = nav.getActive().index;

    var estacao_id = 0;
    if(this.estacao_id){
      estacao_id = this.estacao_id;
    }

    
    // ALERT 
    let alertIndividuo = this.alert.create({
      title: 'Complete o formulário',
      buttons: [
        {
          text: 'OK',
          handler: function(){

            if(formValid){

              if(navPrevious == null || navPrevious.index==0){

                nav.push(IndividuoPage, {estacao: estacao_id}).then( () => {
                  nav.remove(indexCurrentPage,1);   
                  nav.insertPages(0,[
                    {page: LocalPage}, 
                    {page: EstacaoPage},
                    {page: ParcelaPage},
                    {page: IndividuoPage}
                  ]);
                });                
                  
              } else {

                // show modal with page 'addTronco'
                let troncoModal = modal.create(
                  AddTroncoPage, {individuo:individuo}
                );
                troncoModal.present();
          
                $this.popView();
                //nav.pop();
              }

            }
          }
        }
        
      ]
    });

    // Check all fields from form
    if(formValid){
      
      // Form data submited
      // let data_to_save = this.addIndividuoFormGroup.value; 

      // const individuo:Individuo = Object.assign(this.addIndividuoFormGroup.value, Individuo);

      this.SQLService.storeIndividuo(individuo).then( () => {
        
        console.log('SAVE');

        this.foiSubmetido = true;

        console.log(individuo);

        alertIndividuo
          .setTitle('Formulário Salvo com Sucesso')
          .present()

      }).catch( error => {
        this.foiSubmetido = true;
        console.log(error)
        console.log('erro ao gravar estação',data_to_save,error);
      });

    } else {
      alertIndividuo.present();
    }
  }


  reloadIndividuos(){

    this.SQLService.getIndividuos(this.estacao_id)
        .then( rows => console.log(rows) );
    
  }
}
