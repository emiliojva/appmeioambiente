import { Table } from "./table.class";

export class Tronco extends Table {
    public id: number;
    public individuo_id: number;
    public lacre: string;
    public dap: string;
    public condicao: boolean;
    public observacao?: string;
    public telemetro?: string;
    public vara?: string;
    public regua?: string;
    public alt_correcao?: string;
    public flag?: string;
    public datacriacao: number;
  }