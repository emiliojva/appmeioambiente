import { Table } from "./table.class";

export class Parcela extends Table {
    public id: number;
    public estacao_id: number;
    public comprimento: number;
    public equipe: string;
    public largura: number;
    public descricao: string;
    public datacriacao: number;

    constructor(){
      super();
    }
    
  }