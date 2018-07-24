import { FormBuilder } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { ConfiguracaoPaginaBase } from '../infraestrutura/ConfiguracaoPaginaBase';

export abstract class PaginaBase {
    
    protected _formBuilder: FormBuilder;
    protected _navParams: NavParams;
    protected _loadingCtrl: LoadingController;
    protected _loading: Loading;

    constructor(cbp: ConfiguracaoPaginaBase) {
        this._formBuilder = cbp.formBuilder;
        this._navParams = cbp.navParams;
        this._loadingCtrl = cbp.loadingCtrl;
        
        this.carregarValidadores();
    }

    protected mostrarLoading(mensagem: string, duracao: number = 0){
        
        if(duracao==0){

            this._loading = this._loadingCtrl.create({
                content: mensagem
            });

        } else {

            this._loading = this._loadingCtrl.create({
                content: mensagem,
                duration: duracao
            });

        }
        return this._loading.present();
    }


    protected esconderLoading(): void{
        
        if(this._loading!=null){
            this._loading.dismiss();    
        } 
        
    }

    carregarValidadores(){
        
        if(this._formBuilder != null){
            this.doCarregarValidadores();
        }
    }

    

    abstract doCarregarValidadores(): void;

    
}