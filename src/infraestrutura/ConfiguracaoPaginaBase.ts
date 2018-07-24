import { FormBuilder } from '@angular/forms';
import { NavParams, LoadingController } from 'ionic-angular';

export interface ConfiguracaoPaginaBase { 
    
    formBuilder?: FormBuilder;
    navParams?: NavParams;
    loadingCtrl?: LoadingController;
    
}