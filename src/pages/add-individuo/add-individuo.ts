import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Estacao } from '../../model/estacao.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Local } from '../../model/local.class';
import { Especie } from '../../model/especie.class';

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
    private SQLService: SqLiteWrapperProvider
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
      especie_id:['',Validators.required], 
      estacao_id:['',Validators.required], 
      numTronco: ['',Validators.required],
      altura: ['', Validators.required],
      obs: ['', Validators.required],
    });


  }

}
