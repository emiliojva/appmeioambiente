import { Component, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { IonicPage, NavController, NavParams, Select } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Estacao } from '../../model/estacao.class';
import { SqLiteWrapperProvider } from '../../providers/sq-lite-wrapper/sq-lite-wrapper';
import { Local } from '../../model/local.class';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddIndividuoPage {

  @ViewChild('selectEstacao') selectEstacao: Select;

  locais: Local[];
  local_selected: number;
  estacaos: Estacao[];
  estacao_selected: number;
  addIndividuoFormGroup: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private SQLService: SqLiteWrapperProvider,
    public cdr: ChangeDetectorRef
  ) {

    // this.estacao_selected = this.navParams.get('estacao');
    // this.SQLService.getIndividuos(this.estacao_selected)
    //   .then( rows => {
    //     console.log('listando estacoes',rows);
    //   });
    this.populateLocais();

    this.createForm();
  }

  ngOnInit(){
    console.log( this.selectEstacao );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddIndividuoPage');
  }

  // On Active Page
  ionViewWillEnter(){
    console.log('Active Page Estacao');
  }s

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

        // listener select 'local' and reflects into 'estacao' select
        this.cdr.detectChanges();

    });
  }

  private createForm(){

    // Compose group form 
    this.addIndividuoFormGroup = this.formBuilder.group({
      local_id: ['',Validators.required],
      numTronco: ['',Validators.required],
      altura: ['', Validators.required],
      obs: ['', Validators.required],
    });
  }

}
