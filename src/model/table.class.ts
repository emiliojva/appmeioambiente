import { SQLiteObject } from "../../node_modules/@ionic-native/sqlite";
import { SqLiteWrapperProvider } from "../providers/sq-lite-wrapper/sq-lite-wrapper";
import { Parcela } from "./parcela.class";
import { asTextData } from "../../node_modules/@angular/core/src/view";

export abstract class Table {

    static instanceDB: SQLiteObject = null;
    
    protected objectLoaded;

    constructor(id?:number){

        console.log('entrei no constructor');

        let $this = this;

        this.objectLoaded = new Promise((resolve)=>{
            
            if(Table.instanceDB && id){

                let table = this.constructor.name;
                            
                Table.instanceDB.executeSql(`SELECT * FROM ${table} WHERE id = ?` ,[id]).then( result => {                
                    
                    let row = result.rows.item(0);
                    
                    $this.toArray(row);

                    resolve($this);
    
                });
            }
        
        })
        
    }

    get(){
        return this.objectLoaded;
    }

    fromArray(){
        
    }

    toArray(object){
        
        for(let prop in object){

            this[prop] = object[prop];
            
        }
    }


    

    objectToInsertQuery():{query:string,values:any[]}{

        let entity = this.constructor.name;
        
        let array_columns = [];
            let array_values = [];
            let array_binds = [];
            for(let prop in this){

                // get only scalar values
                if(typeof(this[prop]) !== 'function'){

                    array_columns.push(prop);
                    array_values.push(this[prop]);
                    array_binds.push('?');

                }
              
            }
            let string_columns = array_columns.join(',');
            let string_binds = array_binds.join(',');
    
            return {
              query: `INSERT INTO ${entity} (${string_columns}) VALUES (${string_binds});`
              , 
              values: array_values
            };
      }

      toGetQueryMaxID(){
        let entity = this.constructor.name;

        let query = `SELECT MAX(id)+1 as maxID FROM ${entity}`;
        
        return query;
      }


      

}