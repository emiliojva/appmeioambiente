import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SqLiteWrapperProvider } from '../../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Local } from '../../../model/local.class';
import { Estacao } from '../../../model/estacao.class';
import { EstacaoPage } from '../estacao';
import { LocalPage } from '../../local/local';
import { IndividuoPage } from '../../individuo/individuo';
import { ParcelaPage } from '../../parcela/parcela';
import { Table } from '../../../model/table.class';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add-estacao.html',
})
export class AddEstacaoPage {
  
  estacaoForm: FormGroup;
  local_selected: number;
  locais: any[] = [];
  estacao_data: string;
  novaEstacao: Estacao;

  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alert: AlertController,
    private SQLService: SqLiteWrapperProvider,
    private formBuilder: FormBuilder,
  ) {

    // populate array locais 
    this.populateLocais();
    
    // Start formBuilder Group with data
    this.createForm();
    
  }

  ngOnInit(){

    
    
    if(this.navParams.get('local')){
      
      this.local_selected = this.navParams.get('local');

      console.log('params local',this.local_selected);

      let local_active = new Local(this.local_selected);

      local_active.get().then( row => {
        console.log(row);
      })

      

    }

  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad AddPage');
  }
  
  
  logForm(){

    const formValid = this.estacaoForm.valid;
    const navPrevious = this.navCtrl.getPrevious();
    const $this = this;
    

    let nav = this.navCtrl;

    // remove current page
    const indexCurrentPage = nav.getActive().index;

    let local_id = this.local_selected;

    let alertEstacao = this.alert.create({
      title: 'Complete o formulário',
      buttons: [
        {
          text: 'OK',
          handler: function(){
            
            if(formValid){

              if(navPrevious == null || navPrevious.index==0){

                console.log($this.novaEstacao);
                if($this.novaEstacao){

                  // Go to page 'Parcelas'
                  nav.push(ParcelaPage, {estacao: $this.novaEstacao}).then( () => {
                    nav.remove(indexCurrentPage,1);   
                    nav.insertPages(0,[{page: LocalPage}]);
                  });                

                }
                                  
              } else {
                
                

                if($this.novaEstacao){

                  nav.pop().then( () => {

                    nav.push(ParcelaPage, {estacao: $this.novaEstacao}).then( () => {
                    
                    });                
  
                  });

                }
                


              }

            } 

          }
        }
        
      ]
    });

    // Check all fields from form
    if(formValid){
      
      let estacao_data = this.estacao_data;
      
      // Form data submited
      let data_to_save = this.estacaoForm.value; 
      
      // Save Estacao in the Model
      this.storeEstacao(data_to_save)
        .then( (estacao:Estacao) => {

          $this.novaEstacao = estacao;

          alertEstacao
            .setTitle('Formulário Salvo com Sucesso')
            .present()
                                        
        })
        .catch( (error) => {
          console.log('erro ao gravar estação',data_to_save,error);
        });

    } else {
      alertEstacao.present();
    }
    
  }

  private createForm(){

    let dataAtual = this.formatDate(new Date());
    
    // Compose group form 
    this.estacaoForm = this.formBuilder.group({
      local_id: [this.local_selected, Validators.required],
      codigo: ['',Validators.required],
      data: [dataAtual, Validators.required],
      // parcela: ['', Validators.required],
      obs: ['', [] ]
    });


  }

  private populateLocais(){

    this.SQLService.getLocais()          
        .then( (rows) => {
          this.locais = rows;
      });

  }

  private storeEstacao(datasource: Estacao){
    return this.SQLService.storeEstacao(datasource);
  }

  private formatDate(date):string {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

}