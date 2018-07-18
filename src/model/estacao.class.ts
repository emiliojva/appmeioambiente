import { Table } from "./table.class";
import { Local } from "./local.class";

export class Estacao extends Table {
    public id: number;
    public local_id: number;
    public codigo: string;
    public data: Date;
    // public parcela: number;
    public obs: string;
    public datacriacao: number;

    constructor(id?){
      super(id);
    }

    public getLocal(){
      return new Local(this.local_id).get();
    }
    
  }