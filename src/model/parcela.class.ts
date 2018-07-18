import { Table } from "./table.class";
import { Estacao } from "./estacao.class";

export class Parcela extends Table {
    public id: number;
    public estacao_id: number;
    public comprimento: number;
    public equipe: string;
    public largura: number;
    public descricao: string;
    public datacriacao: number;

    constructor(id?:number){
      super(id);
    }

    public getEstacao(){
      return new Estacao(this.estacao_id).get();
    }
    
   
    
  }