import { FormControl } from "../../node_modules/@angular/forms";

export class ComunsValidadores {

    public static email(fc: FormControl): any {
        
        let emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return emailRegex.test(fc.value) ? null : { "E-mail inválido" : true }
    }

}