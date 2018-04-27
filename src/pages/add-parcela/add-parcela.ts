import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParcelaPage } from '../parcela/parcela';
import { EstacaoPage } from '../estacao/estacao';
import { LocalPage } from '../local/local';
import { Parcela } from '../../model/parcela.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Estacao } from '../../model/estacao.class';

/**
 * Generated class for the AddParcelaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-parcela',
  templateUrl: 'add-parcela.html',
})
export class AddParcelaPage {

  parcelaForm: FormGroup;
  estacao_selected: Estacao;
  estacoes: any[] = [];
  estacao_id: number;
  // estacao_data: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alert: AlertController,
    private formBuilder: FormBuilder, 
    private SQLService: SqLiteWrapperProvider
    
  ) {

    if(this.navParams.get('estacao')){

      this.estacao_selected = this.navParams.get('estacao');

      this.estacao_id = this.estacao_selected.id;

    }

    // Start formBuilder Group with data
    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddParcelaPage');
  }

  logForm(){

    const formValid = this.parcelaForm.valid;
    const navPrevious = this.navCtrl.getPrevious();

    let nav = this.navCtrl;

    // remove current page
    const indexCurrentPage = nav.getActive().index;

    let estacao_selected = this.estacao_selected;

    let alertEstacao = this.alert.create({
      title: 'Complete o formulário',
      buttons: [
        {
          text: 'OK',
          handler: function(){
            
            if(formValid){

              if(navPrevious == null || navPrevious.index==0){

                nav.push(ParcelaPage, {estacao: estacao_selected}).then( () => {
                  nav.remove(indexCurrentPage,1);   
                  nav.insertPages(0,[{page: LocalPage},{page: EstacaoPage}]);
                });                
                  
              } else {
                nav.pop();
              }

            } 

          }
        }
        
      ]
    });

    // Check all fields from form
    if(formValid){
      
      // Form data submited
      let data_to_save = this.parcelaForm.value; 
      
      // Save Estacao in the Model
      this.storeParcela(data_to_save)
        .then( (parcela:Parcela) => {

          alertEstacao
            .setTitle('Formulário Salvo com Sucesso')
            .present()
        })
        .catch( (error) => {
          console.log('erro ao gravar parcela',data_to_save,error);
        })

    } else {
      alertEstacao.present();
    }
    
  }

  private createForm(){

    // Compose group form 
    this.parcelaForm = this.formBuilder.group({
      estacao_id: [this.estacao_id, Validators.required],
      largura: ['',Validators.required],
      comprimento: ['', Validators.required],
      equipe: ['', Validators.required],
      descricao: ['', Validators.required]
    });

  }

  private storeParcela(datasource: Parcela){
    return this.SQLService.storeParcela(datasource);
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
