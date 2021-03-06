// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { DateTime, Platform } from 'ionic-angular';
import { Estacao } from '../../model/estacao.class';
import { Local } from '../../model/local.class';
import { UtilityProvider } from '../utility/utility';
import { Individuo } from '../../model/individuo.class';
import { Especie } from '../../model/especie.class';
import { Parcela } from '../../model/parcela.class';
import { Tronco } from '../../model/tronco.class';
import { Table } from '../../model/table.class';

const DATABASE_SCHEMA = [
  // [`DROP TABLE IF EXISTS tronco`],
  // [`DROP TABLE IF EXISTS individuo`],
  // [`DROP TABLE IF EXISTS parcela`],
  // [`DROP TABLE IF EXISTS estacao`],
  // [`DROP TABLE IF EXISTS local`],
  // [`DROP TABLE IF EXISTS especie`],
  // [`DROP TABLE IF EXISTS usuario`],
  // /*Table local */
  [`
  CREATE TABLE IF NOT EXISTS local 
  (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    codigo	VARCHAR(200) UNIQUE,
    descricao	TEXT NOT NULL UNIQUE,
    datacriacao	VARCHAR(150)
  );`
  ]
  ,
  /*Table Especie */
  [`
  CREATE TABLE IF NOT EXISTS especie (
     id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
     usuario_id INTEGER,
     codigo VARCHAR(200) UNIQUE,
     descricao	TEXT NOT NULL UNIQUE,
     datacriacao	VARCHAR(150)
  );`
  ]
  ,
  /*Table Estacao */
  [`
  CREATE TABLE IF NOT EXISTS estacao (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(200) UNIQUE,
    usuario_id INTEGER,
    data TEXT NOT NULL,
    local_id INTEGER NOT NULL,
    obs	TEXT,
    datacriacao	VARCHAR(150),
    FOREIGN KEY(local_id) REFERENCES local (id)
  );`
  ]
  ,
  /*Table Parcela */
  [`
  CREATE TABLE IF NOT EXISTS parcela (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    estacao_id INTEGER NOT NULL,
    usuario_id INTEGER,
    largura INTEGER NOT NULL,
    comprimento INTEGER NOT NULL,
    equipe	VARCHAR(254),
    descricao	TEXT,
    datacriacao	VARCHAR(150),
    FOREIGN KEY (estacao_id) REFERENCES estacao (id)
  );`
  ]
  ,
  /* Table Individuo */
  [`
  CREATE TABLE IF NOT EXISTS individuo 
  ( 
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    codigo INTEGER NOT NULL ,
    parcela_id INTEGER NOT NULL ,
    especie_id INTEGER NOT NULL,
    usuario_id INTEGER,
    numero_de_troncos INTEGER NOT NULL,
    altura INTEGER NOT NULL,
    observacao TEXT,
    datacriacao VARCHAR(150),
    FOREIGN KEY (parcela_id) REFERENCES parcela (id),
    FOREIGN KEY (especie_id) REFERENCES especie (id)
  );`
  ]
  ,
  /* Table Tronco */
  [`
  CREATE TABLE IF NOT EXISTS tronco (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    individuo_id INTEGER NOT NULL ,
    lacre VARCHAR(150) UNIQUE,
    dap VARCHAR(150),
    telemetro VARCHAR(150),
    vara VARCHAR(150),
    regua VARCHAR(150),
    alt_correcao VARCHAR(150),
    condicao BOOLEAN,
    flag VARCHAR(150),
    observacao TEXT,
    datacriacao VARCHAR(150),
    FOREIGN KEY (individuo_id) REFERENCES individuo (id)
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
    data_modificacao VARCHAR(150),
    datacriacao VARCHAR(150)
  )`
  ]
];
/* Carregar do banco todas os locais e atualizaar banco local */
const POPULATE_TABLES_LOCAL = [
  ['INSERT INTO local(codigo,descricao,datacriacao) VALUES (?,?,?)', ['guapi','Guapimirim',new Date().getTime()] ],
  ['INSERT INTO local(codigo,descricao,datacriacao) VALUES (?,?,?)', ['gaurai','Gauraí',new Date().getTime()] ],
  ['INSERT INTO local(codigo,descricao,datacriacao) VALUES (?,?,?)', ['caceribu','Caceribu',new Date().getTime()] ],
  ['INSERT INTO local(codigo,descricao,datacriacao) VALUES (?,?,?)', ['guaraimirim','Guaraí-Mirim',new Date().getTime()] ],
  ['INSERT INTO local(codigo,descricao,datacriacao) VALUES (?,?,?)', ['imbui','Caceribu / Imbuí',new Date().getTime()] ],
  ['INSERT INTO local(codigo,descricao,datacriacao) VALUES (?,?,?)', ['guaxindiba','Guaxindiba',new Date().getTime()] ],
  ['INSERT INTO local(codigo,descricao,datacriacao) VALUES (?,?,?)', ['turiacu','Turiaçu',new Date().getTime()] ]
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

  static instanceDB: SQLiteObject;
  
  constructor(
    //public http: HttpClient, 
    public sqlite: SQLite,
    public platform: Platform,
    public util: UtilityProvider
  ) 
  {
    console.log('Hello SqLiteWrapperProvider Provider');
  }

  // returns instance SQLite DB Promise 
  getSQLiteInstance():Promise<SQLiteObject>{

    console.log('database:',!!this.database);
    
    if(!!this.database){
      return new Promise(resolve => {
        if(!!this.database)
          resolve(this.database);
      });
    }
    

    console.log('meioambiente-v2.0.db');
    return this.sqlite.create({
      name: 'meioambiente-v2.0.db',
      location: 'default'
    });

  
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
          return this.database.sqlBatch(DATABASE_SCHEMA).then( (res) =>{
            this.dbScriptDone = true;
            console.log( 'fim de script' ,JSON.stringify(this.dbScriptDone));
          });
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

  getEstacaos(local_id?:number, associations: boolean = false):Promise<Estacao[]>{

    return new Promise( (resolve,reject)=>{

      if(local_id === undefined){
        resolve([]);
        return;
      }

      this.getSQLiteInstance()
        .then( (db: SQLiteObject) => {  // Returns Instance of SQLiteObject. To do Transactions

          var sql:string = '';
          var COLUMNS:string = '*';
          var JOIN: Array<string> = [];
          var WHERE:Array<string> = [];

          if(associations === true){

            COLUMNS = `
            e.*,
            l.codigo as local_codigo,
            l.descricao as local_descricao,
            l.datacriacao as local_datacriacao
          `;

            JOIN.push( `INNER JOIN local l ON l.id = e.local_id`  );
             
          }

          if(local_id){
            WHERE.push(` WHERE e.local_id = ${local_id} `);
          }

          sql = ` SELECT ${COLUMNS} FROM estacao e
                  ${JOIN.join(' ')}
                  ${WHERE.join(' ')}` ;
                  
          // Returns Promise with statament SQL executed. Equal results.rows array objects
          // return db.executeSql(`SELECT * FROM individuo ${where}` ,[]);
          console.log(sql);
          return db.executeSql(sql ,[]);

          // let where = '';
          // if(local_id){
          //   where = `WHERE local_id = ${local_id}`;
          // }

          // // Returns Promise with statament SQL executed. Equal results.rows array objects
          // return db.executeSql(`SELECT * FROM estacao ${where}` ,[])
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

  getIndividuos(parcela_id:number, associations: boolean = false):Promise<Individuo[]>{

    console.log(parcela_id);

    return new Promise( (resolve,reject)=>{

      this.getSQLiteInstance()
        .then( (db: SQLiteObject) => {  // Returns Instance of SQLiteObject. To do Transactions

          var sql:string = '';
          var COLUMNS:string = '*';
          var JOIN: Array<string> = [];
          var WHERE:Array<string> = [];

          if(associations === true){

            COLUMNS = `
            i.*,
            p.largura as parcela_largura,
            p.comprimento as parcela_comprimento,
            p.equipe as parcela_equipe,
            p.descricao as parcela_descricao,
            p.datacriacao as parcela_datacriacao,
            esp.codigo as especie_codigo,
            esp.descricao as especie_descricao,
            esp.datacriacao as especie_datacriacao
          `;

            JOIN.push( `INNER JOIN parcela p ON p.id = i.parcela_id`  );
            JOIN.push( `INNER JOIN especie esp ON esp.id = i.especie_id` );
             
          }

          if(parcela_id){
            WHERE.push(` WHERE i.parcela_id = ${parcela_id} `);
          }

          sql = ` SELECT ${COLUMNS} FROM individuo i
                  ${JOIN.join(' ')}
                  ${WHERE.join(' ')}` ;
                  
          // Returns Promise with statament SQL executed. Equal results.rows array objects
          // return db.executeSql(`SELECT * FROM individuo ${where}` ,[]);
          console.log(sql);
          return db.executeSql(sql ,[]);
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

  getTroncos(individuo_id:number, associations: boolean = false):Promise<Tronco[]>{

    console.log(individuo_id);

    return new Promise( (resolve,reject)=>{

      this.getSQLiteInstance()
        .then( (db: SQLiteObject) => {  // Returns Instance of SQLiteObject. To do Transactions

          var sql:string = '';
          var COLUMNS:string = '*';
          var JOIN: Array<string> = [];
          var WHERE:Array<string> = [];

          if(associations === true){

            COLUMNS = `
            t.*,
            i.numero_de_troncos as individuo_numero_de_troncos,
            i.altura as individuo_altura,
            i.especie_id as individuo_especie_id,
            i.parcela_id as individuo_parcela_id,
            i.observacao as individuo_observacao,
            i.datacriacao as individuo_datacriacao,
          `;

            JOIN.push( `INNER JOIN individuo i ON i.id = t.individuo_id` );
             
          }

          if(individuo_id){
            WHERE.push(` WHERE t.individuo_id = ${individuo_id} `);
          }

          sql = ` SELECT ${COLUMNS} FROM tronco t
                  ${JOIN.join(' ')}
                  ${WHERE.join(' ')}` ;
                  
          // Returns Promise with statament SQL executed. Equal results.rows array objects
          // return db.executeSql(`SELECT * FROM individuo ${where}` ,[]);
          console.log(sql);
          return db.executeSql(sql ,[]);
        })
        .then( (results) => {
            
            let array_results: Tronco[] = [];

            // iterates results rows SQL and push into '' array 
            for (let index = 0; index < results.rows.length; index++) {
              let tronco:Tronco = Object.assign(results.rows.item(index), Tronco);
              array_results.push(tronco);
            }
            // Resolve array of 'troncos' objects
            resolve(array_results);
          });
        });
  }


  


  getParcelas(estacao_id:number, associations: boolean = false):Promise<Parcela[]>{

    console.log(estacao_id);

    return new Promise( (resolve,reject)=>{

      this.getSQLiteInstance()
        .then( (db: SQLiteObject) => {  // Returns Instance of SQLiteObject. To do Transactions

          var sql:string = '';
          var COLUMNS:string = '*';
          var JOIN: Array<string> = [];
          var WHERE:Array<string> = [];

          if(associations === true){

            COLUMNS = `
            p.*,
            e.local_id as estacao_local_id,
            e.codigo as estacao_codigo,
            e.data as estacao_data,
            e.obs as estacao_obs,
            e.datacriacao as estacao_datacriacao
          `;

            JOIN.push( `INNER JOIN estacao e ON e.id = p.estacao_id`  );
          }

          if(estacao_id){
            WHERE.push(` WHERE p.estacao_id = ${estacao_id} `);
          }

          sql = ` SELECT ${COLUMNS} FROM parcela p
                  ${JOIN.join(' ')}
                  ${WHERE.join(' ')}` ;
                  
          // Returns Promise with statament SQL executed. Equal results.rows array objects
          // return db.executeSql(`SELECT * FROM individuo ${where}` ,[]);
          console.log(sql);
          return db.executeSql(sql ,[]);
        })
        .then( (results) => {
            
            let array_results: Parcela[] = [];

            // iterates results rows SQL and push into 'Estacao' array 
            for (let index = 0; index < results.rows.length; index++) {
              // let parcela:Parcela = Object.assign(results.rows.item(index), Parcela);
              let parcela:Parcela = this.fromJSON(results.rows.item(index),Parcela);
              array_results.push(parcela);
            }
            // Resolve array of 'Individuos' objects
            resolve(array_results);
          });
        });

  }
  
  storeEstacao(estacao:Estacao):Promise<Estacao>{

    let obj_estacao:Estacao = this.fromJSON(estacao,Estacao);

    return this.getSQLiteInstance()
      .then( (db:SQLiteObject) => {
        
        obj_estacao.datacriacao = new Date().getTime();
        // console.log('Dados prepados para query', JSON.stringify(obj_estacao));

        // convert Object to  Query
        const obj_query = obj_estacao.objectToInsertQuery();
        return db.executeSql( obj_query.query, obj_query.values );
      })
      .then( (results) => {
        
        return this.database.executeSql('SELECT max(id) as maxID FROM estacao WHERE local_id = ?',[estacao.local_id]);
        
      })
      .then( (dataset) => {
        console.log(dataset.rows.item(0));
        
        if(dataset.rows.item(0).maxID>0){
          estacao.id = dataset.rows.item(0).maxID;
        }
          
        return estacao;
      })
      

  }

  storeParcela(parcela: Parcela):Promise<Parcela>{

    let obj_parcela:Parcela = this.fromJSON(parcela,Parcela);

    return this.getSQLiteInstance()
      .then( (db:SQLiteObject) => {
        
        obj_parcela.datacriacao = new Date().getTime();

        // convert Object to  Query
        const obj_query = obj_parcela.objectToInsertQuery();

        return db.executeSql( obj_query.query, obj_query.values );
      })
      .then( (results) => {
        
        return this.database.executeSql('SELECT max(id) as maxID FROM parcela WHERE estacao_id = ?',[parcela.estacao_id]);
        
      })
      .then( (dataset) => {
        console.log(dataset.rows.item(0));
        
        if(dataset.rows.item(0).maxID>0){
          parcela.id = dataset.rows.item(0).maxID;
        }
          
        return parcela;
      });

  }
  
  storeIndividuo(individuo:Individuo):Promise<Individuo>{

    return this.getSQLiteInstance()
      .then( (db:SQLiteObject) => {

        let obj_individuo:Individuo = this.fromJSON(individuo,Individuo);

        obj_individuo.codigo =  parseInt(individuo.especie_id + '' +individuo.parcela_id);
        obj_individuo.datacriacao = new Date().getTime();
        
        console.log('Dados prepados para query', JSON.stringify(individuo));

        // get object {query,values} formatted
        // convert Object to  Query
        const obj_query = obj_individuo.objectToInsertQuery();

        return db.executeSql(obj_query.query, obj_query.values);

      })
      .then( (results) => {
        
        let table = individuo.constructor.name.toLocaleLowerCase();
        let foreignKey = 'parcela_id';

        return this.database.executeSql('SELECT max(id) as maxID FROM '+table+' WHERE '+foreignKey+' = ?',[individuo.parcela_id]);
        
      })
      .then( (dataset) => {
        console.log(dataset.rows.item(0));
        
        if(dataset.rows.item(0).maxID>0){
          individuo.id = dataset.rows.item(0).maxID;
        }
          
        return individuo;
      });
      
      

  }

  storeTronco(tronco:Tronco):Promise<Tronco>{

    var obj_tronco:Tronco = new Tronco();

    return this.getSQLiteInstance()
      .then( (db:SQLiteObject) => {

        // return db.executeSql(obj_tronco.toGetQueryMaxID(),[]).then(res => {
          
          // console.log(JSON.stringify(tronco));

          // let maxID = res.rows.item(0).maxID == null ? 0 : res.rows.item(0).lastID;
          
          // console.log(res);
          // console.log('tentativa 1 de pegar ID', maxID);
          
          // tronco.id = maxID;

          obj_tronco = this.fromJSON(tronco,Tronco);

          // obj_tronco.codigo =  parseInt(tronco.especie_id + '' +tronco.estacao_id);
          obj_tronco.datacriacao = new Date().getTime();
        
          console.log('Dados prepados para query', JSON.stringify(obj_tronco));

          // get object {query,values} formatted
          
        // })
      
      })
      .then( () => {
        // convert Object to  Query
        const obj_query = obj_tronco.objectToInsertQuery();
        // console.log(obj_query);
        return this.database.executeSql(obj_query.query, obj_query.values);
      })
      // .then( (result) => {

      //   if(result.rows.length>0){

      //     tronco.id = result.rows[0].id;

      //     console.log('tentativa 1 de pegar ID', tronco.id);

      //     return tronco;

      //   } else {


      //     // return this.database.executeSql(obj_tronco.lastID(),[]).then(res => {
      //     //     // console.log(res);
      //     //     console.log('tentativa 2 de pegar ID', res.rows.item(0).lastID);

      //     //     return res.rows.item(0).lastID;
      //     //   });
      //     return tronco;

      //   }

        
      // });
      

  }

  
  // used to mock creates simulations in browser
  private createTablesMockSQL():Promise<any>{

      console.log('Starting Script Creates DB...');

      let array_promises = [];
      DATABASE_SCHEMA.forEach( (sql_create_table:Array<string>) => {
        
        let promise = this.database.executeSql(sql_create_table[0],{}).then( () => {
          console.log(sql_create_table[0]);
        });

        array_promises.push(promise);

      });

      return Promise.all(array_promises).then( () =>{
        this.dbScriptDone = true;
        console.log('End Script Creates DB! - Tables created');
      });
  }



    public populateLocal():Promise<any>{
      
      console.log('local Table created');

      let array_promises = [];

      for(let i=0; i<POPULATE_TABLES_LOCAL.length; i++){

        let insertQuery:string = POPULATE_TABLES_LOCAL[i][0] as string;
        let params = POPULATE_TABLES_LOCAL[i][1];
        // return this.database.executeSql(insertQuery , params)
        let aux_promise = this.database.executeSql(insertQuery , params)
          .then(() => {
            console.log('registro inserido  !');
          })
          .catch( (error) => console.log(insertQuery,params,'ja existe') );

          array_promises.push(aux_promise);
      }

      return Promise.all(array_promises);
    }

    public populateEspecie():Promise<any>{
      
      console.log('especie Table created');
      let array_promises = [];
      for(let i=0; i<POPULATE_TABLES_ESPECIE.length; i++){

        let insertQuery:string = POPULATE_TABLES_ESPECIE[i][0] as string;
        let params = POPULATE_TABLES_ESPECIE[i][1];
        // return this.database.executeSql(insertQuery , params)
        let aux_promise = this.database.executeSql(insertQuery , params)
          .then((row) => {
            console.log('registro inserido  !', row, insertQuery,params);
          })
          .catch( (error) => console.log(insertQuery,params,'ja existe') )
      }
      return Promise.all(array_promises);
    }


    /**
     * Return Object loaded with params of another Object/json
     * 
     * @param json 
     * @param classe 
     */
    fromJSON(json,classe) {
      let obj = Object.create(classe.prototype);
      return Object.assign(obj,json);

      // let obj_estacao = new Estacao();
    // for(let key in estacao){
    //   obj_estacao[key] = estacao[key];
    // }
    }

  }

  














  // private objectToInsertQuery(object: {}):{query:string,values:any[]}{

  //   let entity = object.constructor.name;
    
  //   let array_columns = [];
  //       let array_values = [];
  //       let array_binds = [];
  //       for(let x in object){
  //         array_columns.push(x);
  //         array_values.push(object[x]);
  //         array_binds.push('?');
  //       }
  //       let string_columns = array_columns.join(',');
  //       let string_binds = array_binds.join(',');

  //       return {
  //         query: `INSERT INTO ${entity} (${string_columns}) VALUES (${string_binds});`
  //         , 
  //         values: array_values
  //       };
  // }

  // // platform plugins ready to use
  // private playPlatform(){
  //   return this.platform.ready();
  // }





//////////////////////////////////////


  // return Promise.all([
  //   this.database.executeSql(`
  //     CREATE TABLE IF NOT EXISTS local 
  //     (
  //       id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  //       codigo	VARCHAR(200) UNIQUE,
  //       descricao	TEXT NOT NULL UNIQUE,
  //       datacriacao	VARCHAR(50)
  //     );`
  //   ,{})
  //   .then( (results) => {

  //     // this.populateLocal();
  //     console.log('local Table created');
      
  //   })
  //   ,
  //   this.database.executeSql(`
  //     CREATE TABLE IF NOT EXISTS especie (
  //       id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  //       codigo VARCHAR(200) UNIQUE,
  //       descricao	TEXT NOT NULL UNIQUE,
  //       datacriacao	VARCHAR(50)
  //     );`
  //   ,{})
  //   .then( (results) => {

  //     console.log('especie Table created');
     
  //     // this.populateEspecie();

  //   }),
  //   // /* FIX TO DO DELETE FIELD 'descricao' AND HOLD USER DATA */
  //   // this.database.executeSql(`
  //   //   /* BEGIN TRANSACTION;
        
  //   //     CREATE TEMPORARY TABLE estacao_backup(id,codigo,data,local_id,parcela,obs,datacriacao);
  //   //     INSERT INTO estacao_backup SELECT * FROM estacao;
  //   //     DROP TABLE estacao; */

  //   //     CREATE TABLE IF NOT EXISTS estacao (
  //   //       id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  //   //       codigo TEXT UNIQUE,
  //   //       data TEXT NOT NULL,
  //   //       local_id INTEGER NOT NULL,
  //   //       parcela	TEXT,
  //   //       obs	TEXT,
  //   //       datacriacao	TEXT,
  //   //       FOREIGN KEY (local_id) REFERENCES local (id)
  //   //     );

  //   //     /*
  //   //     INSERT INTO estacao SELECT * FROM estacao_backup;
  //   //     DROP TABLE estacao_backup;

  //   //   COMMIT; */
  //   //   `
  //   // ,{})
  //   // .then( (results) => {
  //   //   console.log('estacao Table created');
  //   // }); 
  //   this.database.executeSql(`
  //       CREATE TABLE IF NOT EXISTS estacao (
  //         id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  //         codigo TEXT UNIQUE,
  //         data TEXT NOT NULL,
  //         local_id INTEGER NOT NULL,
  //         parcela	TEXT,
  //         obs	TEXT,
  //         datacriacao	TEXT,
  //         FOREIGN KEY (local_id) REFERENCES local (id)
  //       );
  //     `
  //   ,{})
  //   .then( (results) => {
  //     console.log('estacao Table created');
  //   })
  //   ,
  //   this.database.executeSql(`
  //     CREATE TABLE IF NOT EXISTS individuo 
  //     ( 
  //       id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  //       codigo INTEGER NOT NULL ,
  //       estacao_id INTEGER NOT NULL ,
  //       especie_id INTEGER NOT NULL,
  //       numero_de_troncos INTEGER NOT NULL,
  //       altura INTEGER NOT NULL,
  //       observacao TEXT,
  //       datacriacao TEXT,
  //       FOREIGN KEY (estacao_id) REFERENCES estacao (id),
  //       FOREIGN KEY (especie_id) REFERENCES especie (id)
  //     );`
  //   ,{})
  //   .then( (results) => {
  //     console.log('individuo Table created');
  //   })
  // ]);