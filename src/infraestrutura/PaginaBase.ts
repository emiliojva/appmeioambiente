import { FormBuilder } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfiguracaoPaginaBase } from '../infraestrutura/ConfiguracaoPaginaBase';

export abstract class PaginaBase {
    
    protected _formBuilder: FormBuilder;
    protected _navParams: NavParams

    constructor(cbp: ConfiguracaoPaginaBase) {
        this._formBuilder = cbp.formBuilder;
        this._navParams = cbp.navParams;
        this.carregarValidadores();
    }

    carregarValidadores(){
        if(this._formBuilder != null){
            this.doCarregarValidadores();
        }
    }

    abstract doCarregarValidadores(): void;

    
}