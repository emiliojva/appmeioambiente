import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SqLiteWrapperProvider } from '../../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Local } from '../../../model/local.class';
import { Estacao } from '../../../model/estacao.class';
import { EstacaoPage } from '../estacao';

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
  local_selected: Local = {id:0, codigo:'', descricao:'', datacriacao: new Date().getTime()};
  locais: any[] = [];
  estacao_data: string;

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
    }

  }

  ionViewDidLoad() {

      console.log('ionViewDidLoad AddPage');
    
  }
  
  logForm(){

    let alertEstacao = this.alert.create({
      title: 'Complete o formulário',
      buttons: ['OK']
    });
    
    // Check all fields from form
    if(this.estacaoForm.valid){
      
      this.storeEstacao(this.estacaoForm.value)
        .then( () => {
          alertEstacao
            .setTitle('Formulário Salvo com Sucesso')
            .present()
              .then(() => this.navCtrl.push(EstacaoPage,{
                local:{id: this.local_selected.id}
              }));
        })
        .catch( (error) => {
          console.log(error);
        })

    } else {
      alertEstacao.present();
    }
    
  }

  private createForm(){

    let dataAtual = this.formatDate(new Date());
    
    // Compose group form 
    this.estacaoForm = this.formBuilder.group({
      local_id: [this.local_selected.id, Validators.required],
      codigo: ['',Validators.required],
      data: [dataAtual, Validators.required],
      parcela: ['', Validators.required],
      obs: ['', Validators.required]
    });


  }

  private populateLocais(){

    this.SQLService.getLocais()          
        .then( (results) => {
          for (let index = 0; index < results.rows.length; index++) {
            this.locais.push(results.rows.item(index));
          }
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