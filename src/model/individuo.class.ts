import { Table } from "./table.class";

export class Individuo extends Table {
    public id: number;
    public codigo: number;
    public estacao_id: number;
    public especie_id: number;
    public numero_de_troncos: number;
    public altura: number;
    public observacao: string;
    public datacriacao: number;
  }