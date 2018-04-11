import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SqLiteWrapperProvider } from '../../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Validators, FormBuilder, FormGroup, Form } from '@angular/forms';
import { Local } from '../../../model/local.class';

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
  local_selected: Local = {id:0, codigo:'', data:'', parcela:0, observacao: ''};
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
    this.getLocais();
    
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

  createForm(){

    let dataAtual = this.formatDate(new Date());
    
    // Compose group form 
    this.estacaoForm = this.formBuilder.group({
      localID: [this.local_selected.id,Validators.required],
      codigo: ['',Validators.required],
      data: [dataAtual, Validators.required],
      parcela: ['', Validators.required],
      observacao: ['', Validators.required]
    });


  }

  logForm(){

    let alertEstacao = this.alert.create({
      title: 'Complete o formulário',
      buttons: ['OK']
    });
    
    if(this.estacaoForm.valid){
      console.log(this.estacaoForm.value);
      alertEstacao
        .setTitle('Formulário Salvo com Sucesso')
        .present()
    } else {
      alertEstacao.present();
    }
    
  }

  getLocais(){
    this.SQLService.getLocais()          
        .then( (results) => {
          for (let index = 0; index < results.rows.length; index++) {
            this.locais.push(results.rows.item(index));
          }
      });
  }

  formatDate(date):string {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

}


