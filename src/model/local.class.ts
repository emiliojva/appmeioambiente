import { Table } from "./table.class";

export class Local extends Table {
    
    public id:number = 0;
    public codigo: string = '';
    public descricao: string = '';
    public datacriacao: number = new Date().getTime();

    constructor(id?){
      super(id);
    }
  }