// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { DateTime, Platform } from 'ionic-angular';
import { Estacao } from '../../model/estacao.class';
import { Local } from '../../model/local.class';
import { UtilityProvider } from '../utility/utility';
import { Individuo } from '../../model/individuo.class';
import { Especie } from '../../model/especie.class';

const DATABASE_SCHEMA = [
  [`DROP TABLE IF EXISTS usuario`],
  [`DROP TABLE IF EXISTS individuo`],
  [`DROP TABLE IF EXISTS estacao`],
  [`DROP TABLE IF EXISTS local`],
  /*Table local */
  [`
  CREATE TABLE IF NOT EXISTS local 
  (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    codigo	VARCHAR(200) UNIQUE,
    descricao	TEXT NOT NULL UNIQUE,
    datacriacao	VARCHAR(50)
  );`
  ]
  ,
  /*Table Especie */
  [`
  CREATE TABLE IF NOT EXISTS especie (
     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     codigo VARCHAR(200) UNIQUE,
     descricao	TEXT NOT NULL UNIQUE,
     datacriacao	VARCHAR(50)
  );`
  ]
  ,
  [`
  CREATE TABLE IF NOT EXISTS estacao (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(200) UNIQUE,
    data TEXT NOT NULL,
    local_id INTEGER NOT NULL,
    parcela	INTEGER,
    obs	TEXT,
    datacriacao	VARCHAR(50)
  );`
  ]
  ,
  /* Table Individuo */
  [`
  CREATE TABLE IF NOT EXISTS individuo 
  ( 
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    codigo INTEGER NOT NULL ,
    estacao_id INTEGER NOT NULL ,
    especie_id INTEGER NOT NULL,
    numero_de_troncos INTEGER NOT NULL,
    altura INTEGER NOT NULL,
    observacao TEXT,
    datacriacao VARCHAR(50),
    FOREIGN KEY (estacao_id) REFERENCES estacao (id),
    FOREIGN KEY (especie_id) REFERENCES especie (id)
  );`
  ]
  ,
  /* Table Usuario */
  [`
  CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(255) NOT NULL,
    login_id INTEGER NOT NULL,
    datacriacao VARCHAR(50)
  )`
  ],
  // ['DELETE FROM local'],
  // ['DELETE FROM especie'],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [1, 'guapi','Guapimirim',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [2, 'gaurai','Gauraí',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [3, 'caceribu','Caceribu',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [4, 'guaraimirim','Guaraí-Mirim',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [5, 'imbui','Caceribu / Imbuí',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [6, 'guaxindiba','Guaxindiba',new Date().getTime()] ],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [1, 'Av', 'Avicennia schaueriana', new Date().getTime()] ],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [2, 'Lg', 'Laguncularia racemosa', new Date().getTime()] ],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [3, 'Rh', 'Rhizophora mangle', new Date().getTime()] ]
];

const POPULATE_TABLES_LOCAL = [
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [1, 'guapi','Guapimirim',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [2, 'gaurai','Gauraí',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [3, 'caceribu','Caceribu',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [4, 'guaraimirim','Guaraí-Mirim',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [5, 'imbui','Caceribu / Imbuí',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [6, 'guaxindiba','Guaxindiba',new Date().getTime()] ]
];

const POPULATE_TABLES_ESPECIE = [
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [1, 'Av', 'Avicennia schaueriana', new Date().getTime()] ],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [2, 'Lg', 'Laguncularia racemosa', new Date().getTime()] ],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [3, 'Rh', 'Rhizophora mangle', new Date().getTime()] ]
];

/*
  Generated class for the SqLiteWrapperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqLiteWrapperProvider {

  database: SQLiteObject;

  dbScriptDone: boolean = false;
  
  constructor(
    //public http: HttpClient, 
    public sqlite: SQLite,
    public platform: Platform,
    public util: UtilityProvider
  ) 
  {
    console.log('Hello SqLiteWrapperProvider Provider');

    this.dbScriptResolve().then( ()=>{
      console.log('SCRIPT DONE',this.dbScriptDone);
    } )
  }

  // returns instance SQLite DB Promise 
  getSQLiteInstance():Promise<SQLiteObject>{
    if(!!this.database){
      return new Promise(resolve => {
        if(!!this.database)
          resolve(this.database);
      });
    }


    // return this.dbScriptResolve().then( () => {

      // console.log('dbScriptResolve')

      return this.sqlite.create({
        name: 'meioambiente.db',
        location: 'default'
      });

    // })

    

  
  }

  // Creates DB and inserts records
  createDatabase():Promise<any>{

    return this.getSQLiteInstance()
      .then( (db: SQLiteObject) => {

        // singleTon Pattern
        this.database = db;

        /* DOM/BROWSER SQLiteMock*/
        // if(readySource == 'dom'){
        if(!this.util.mobilecheck()){
          
          console.log('BROWSER MODE',this.database);  
          return this.createTablesMockSQL();
          // return this.createTableForBrowser();
          
        } else {

          /* BATCH TO EXECUTE IN DEVICES/EMULATORS */
          console.log('DEVICE/EMULATOR MODE');     
          return this.database.sqlBatch(DATABASE_SCHEMA).then( () =>{
            this.dbScriptDone = true;
            console.log(JSON.stringify(this.dbScriptDone), 'fim de script');
          })
        }
      }
    );
  }

  dbScriptResolve(){

    return new Promise( resolve => {

      if(this.dbScriptDone === true){
        resolve(this.dbScriptDone);
      }

    });
    
  }

  getLocais(id?:number):Promise<Local[]>{

    return new Promise( (resolve,reject)=>{

      return this.getSQLiteInstance()
        .then( (db: SQLiteObject) => {  // Returns Instance of SQLiteObject. To do Transactions
              
          let where = '';
          if(id){
            where = `WHERE id = ${id}`;
          }

          // Returns Promise with statament SQL executed. Equal results.rows array objects
          // return db.executeSql(`SELECT * FROM local ${where}` ,[])
          return db.executeSql(`SELECT * FROM local ${where}` ,[])
        })
        .then( (results) => {
            
            let array_results: Local[] = [];

            // iterates results rows SQL and push into 'Local' array 
            for (let index = 0; index < results.rows.length; index++) {
              let local:Local = results.rows.item(index);
              array_results.push(local);
            }
            
            // Resolve array of 'LOCAL' objects
            resolve(array_results);
          });

        });
  }

  getEstacaos(local_id?:number):Promise<Estacao[]>{

    return new Promise( (resolve,reject)=>{

      this.getSQLiteInstance()
        .then( (db: SQLiteObject) => {  // Returns Instance of SQLiteObject. To do Transactions
              
          let where = '';
          if(local_id){
            where = `WHERE local_id = ${local_id}`;
          }

          // Returns Promise with statament SQL executed. Equal results.rows array objects
          return db.executeSql(`SELECT * FROM estacao ${where}` ,[])
        })
        .then( (results) => {
            
            let array_results: Estacao[] = [];

            // iterates results rows SQL and push into 'Estacao' array 
            for (let index = 0; index < results.rows.length; index++) {
              let estacao:Estacao = results.rows.item(index);
              array_results.push(estacao);
            }
            
            // Resolve array of 'LOCAL' objects
            resolve(array_results);
          });

        });

  }

  getEspecies():Promise<Especie[]>{

    return new Promise( (resolve,reject)=>{

      this.getSQLiteInstance()
        .then( (db: SQLiteObject) => {  // Returns Instance of SQLiteObject. To do Transactions
          // Returns Promise with statament SQL executed. Equal results.rows array objects
          return db.executeSql(`SELECT * FROM especie ` ,[])
        })
        .then( (results) => {
            
            let array_results: Especie[] = [];

            // iterates results rows SQL and push into 'Estacao' array 
            for (let index = 0; index < results.rows.length; index++) {
              let especie:Especie = results.rows.item(index);
              array_results.push(especie);
            }
            
            // Resolve array of 'LOCAL' objects
            resolve(array_results);
          });

        });

  }

  getIndividuos(estacao_id:number):Promise<Individuo[]>{

    return new Promise( (resolve,reject)=>{

      this.getSQLiteInstance()
        .then( (db: SQLiteObject) => {  // Returns Instance of SQLiteObject. To do Transactions
              
          let where = '';
          if(estacao_id){
            where = `WHERE estacao_id = ${estacao_id}`;
          }

          // Returns Promise with statament SQL executed. Equal results.rows array objects
          // return db.executeSql(`SELECT * FROM individuo ${where}` ,[]);
          return db.executeSql(`SELECT * FROM individuo ${where}` ,[]);
        })
        .then( (results) => {
            
            let array_results: Individuo[] = [];

            // iterates results rows SQL and push into 'Estacao' array 
            for (let index = 0; index < results.rows.length; index++) {
              let individuo:Individuo = Object.assign(results.rows.item(index), Individuo);
              array_results.push(individuo);
            }
            // Resolve array of 'Individuos' objects
            resolve(array_results);
          });
        });
  }

  storeEstacao(estacao:Estacao):Promise<Estacao>{

    return this.getSQLiteInstance()
      .then( (db:SQLiteObject) => {
        
        estacao.datacriacao = new Date().getTime();
        
        console.log('Dados prepados para query', JSON.stringify(estacao));

        return db.executeSql('INSERT INTO estacao (local_id,codigo,data,parcela,obs,datacriacao) VALUES (?,?,?,?,?,?);',
          [
            estacao.local_id, 
            estacao.codigo, 
            estacao.data, 
            estacao.parcela, 
            estacao.obs,
            estacao.datacriacao
          ]);

      })
      .then( (results) => {
        console.log(results);
        return estacao;
      });
      

  }
  
  storeIndividuo(individuo:Individuo):Promise<Individuo>{

    return this.getSQLiteInstance()
      .then( (db:SQLiteObject) => {

        individuo.codigo =  parseInt(individuo.especie_id + '' +individuo.estacao_id);
        individuo.datacriacao = new Date().getTime();
        
        console.log('Dados prepados para query', JSON.stringify(individuo));

        // get object {query,values} formatted
        const obj_query = this.objectToInsertQuery(individuo);

        return db.executeSql(obj_query.query, obj_query.values);

      })
      .then( (result) => {

        if(result.rows[0]){
          individuo.id = result.rows[0].id;
        }

        return individuo;
      });
      

  }

  private objectToInsertQuery(object: Object):{query:string,values:any[]}{
    
    let array_columns = [];
        let array_values = [];
        let array_binds = [];
        for(let x in object){
          array_columns.push(x);
          array_values.push(object[x]);
          array_binds.push('?');
        }
        let string_columns = array_columns.join(',');
        let string_binds = array_binds.join(',');

        return {
          query: `INSERT INTO individuo (${string_columns}) VALUES (${string_binds});`
          , 
          values: array_values
        };
  }

  // platform plugins ready to use
  private playPlatform(){
    return this.platform.ready();
  }

  // used to mock creates simulations in browser
  private createTablesMockSQL():Promise<any>{

      // this.database.executeSql(`drop table estacao;`,{});

      return Promise.all([
        this.database.executeSql(`
          CREATE TABLE IF NOT EXISTS local 
          (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            codigo	VARCHAR(200) UNIQUE,
            descricao	TEXT NOT NULL UNIQUE,
            datacriacao	VARCHAR(50)
          );`
        ,{})
        .then( (results) => {

          console.log('local Table created');

          for(let i=0; i<POPULATE_TABLES_LOCAL.length; i++){

            let insertQuery:string = POPULATE_TABLES_LOCAL[i][0] as string;
            let params = POPULATE_TABLES_LOCAL[i][1];

            this.database.executeSql(insertQuery , params)
              .then(() => {
                console.log('registro inserido  !');
              })
              .catch( (error) => console.log(insertQuery,params,'ja existe') )
          }

        })
        ,
        this.database.executeSql(`
          CREATE TABLE IF NOT EXISTS especie (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            codigo VARCHAR(200) UNIQUE,
            descricao	TEXT NOT NULL UNIQUE,
            datacriacao	VARCHAR(50)
          );`
        ,{})
        .then( (results) => {
          console.log('especie Table created');

          for(let i=0; i<POPULATE_TABLES_ESPECIE.length; i++){

            let insertQuery:string = POPULATE_TABLES_ESPECIE[i][0] as string;
            let params = POPULATE_TABLES_ESPECIE[i][1];

            this.database.executeSql(insertQuery , params)
              .then((row) => {
                console.log('registro inserido  !', row, insertQuery,params);
              })
              .catch( (error) => console.log(insertQuery,params,'ja existe') )
          }

        }),
        // /* FIX TO DO DELETE FIELD 'descricao' AND HOLD USER DATA */
        // this.database.executeSql(`
        //   /* BEGIN TRANSACTION;
            
        //     CREATE TEMPORARY TABLE estacao_backup(id,codigo,data,local_id,parcela,obs,datacriacao);
        //     INSERT INTO estacao_backup SELECT * FROM estacao;
        //     DROP TABLE estacao; */

        //     CREATE TABLE IF NOT EXISTS estacao (
        //       id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        //       codigo TEXT UNIQUE,
        //       data TEXT NOT NULL,
        //       local_id INTEGER NOT NULL,
        //       parcela	TEXT,
        //       obs	TEXT,
        //       datacriacao	TEXT,
        //       FOREIGN KEY (local_id) REFERENCES local (id)
        //     );

        //     /*
        //     INSERT INTO estacao SELECT * FROM estacao_backup;
        //     DROP TABLE estacao_backup;

        //   COMMIT; */
        //   `
        // ,{})
        // .then( (results) => {
        //   console.log('estacao Table created');
        // }); 
        this.database.executeSql(`
            CREATE TABLE IF NOT EXISTS estacao (
              id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
              codigo TEXT UNIQUE,
              data TEXT NOT NULL,
              local_id INTEGER NOT NULL,
              parcela	TEXT,
              obs	TEXT,
              datacriacao	TEXT,
              FOREIGN KEY (local_id) REFERENCES local (id)
            );
          `
        ,{})
        .then( (results) => {
          console.log('estacao Table created');
        })
        ,
        this.database.executeSql(`
          CREATE TABLE IF NOT EXISTS individuo 
          ( 
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            codigo INTEGER NOT NULL ,
            estacao_id INTEGER NOT NULL ,
            especie_id INTEGER NOT NULL,
            numero_de_troncos INTEGER NOT NULL,
            altura INTEGER NOT NULL,
            observacao TEXT,
            datacriacao TEXT,
            FOREIGN KEY (estacao_id) REFERENCES estacao (id),
            FOREIGN KEY (especie_id) REFERENCES especie (id)
          );`
        ,{})
        .then( (results) => {
          console.log('individuo Table created');
        })
      ]);
    }
}