import { FormBuilder } from '@angular/forms';
import { ConfiguracaoPaginaBase } from '../infraestrutura/ConfiguracaoPaginaBase';

export abstract class PaginaBase {
    
    protected _formBuilder: FormBuilder;

    constructor(cbp: ConfiguracaoPaginaBase) {
        this._formBuilder = cbp.formBuilder;
        this.carregarValidadores();
    }

    carregarValidadores(){
        if(this._formBuilder != null){
            this.doCarregarValidadores();
        }
    }

    abstract doCarregarValidadores(): void;

    
}