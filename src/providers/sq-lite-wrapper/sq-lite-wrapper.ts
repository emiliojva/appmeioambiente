// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { DateTime, Platform } from 'ionic-angular';
import { Estacao } from '../../model/estacao.class';

const DATABASE_SCHEMA = [
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
    id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    codigo TEXT UNIQUE,
    data TEXT NOT NULL,
    local_id INTEGER NOT NULL,
    parcela	TEXT,
    obs	TEXT,
    datacriacao	TEXT,
    FOREIGN KEY (local_id) REFERENCES local (id)
  );  
  `
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
    datacriacao TEXT,
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
    login_id INTEGER NOT NULL
  )`
  ]
  ,
  ['DELETE FROM local'],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [1, 'guapi','Guapimirim',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [2, 'gaurai','Gauraí',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [3, 'caceribu','Caceribu',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [4, 'guaraimirim','Guaraí-Mirim',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [5, 'imbui','Caceribu / Imbuí',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [6, 'guaxindiba','Guaxindiba',new Date().getTime()] ]
  ,
  ['DELETE FROM especie'],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [1, 'Av', 'Avicennia schaueriana', new Date().getTime()] ],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [2, 'Lg', 'Laguncularia racemosa', new Date().getTime()] ],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [3, 'Rh', 'Rhizophora mangle', new Date().getTime()] ]
];

const POPULATE_TABLES = [
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [1, 'guapi','Guapimirim',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [2, 'gaurai','Gauraí',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [3, 'caceribu','Caceribu',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [4, 'guaraimirim','Guaraí-Mirim',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [5, 'imbui','Caceribu / Imbuí',new Date().getTime()] ],
  ['INSERT INTO local(id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [6, 'guaxindiba','Guaxindiba',new Date().getTime()] ]
  ,
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [1, 'Av', 'Avicennia schaueriana', new Date().getTime()] ],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [2, 'Lg', 'Laguncularia racemosa', new Date().getTime()] ],
  ['INSERT INTO especie (id,codigo,descricao,datacriacao) VALUES (?,?,?,?)', [3, 'Rh', 'Rhizophora mangle', new Date().getTime()] ]
]

/*
  Generated class for the SqLiteWrapperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqLiteWrapperProvider {

  // db: any;
  database: SQLiteObject;
  
  constructor(
    //public http: HttpClient, 
    public sqlite: SQLite,
    public platform: Platform,
  ) 
  {
    console.log('Hello SqLiteWrapperProvider Provider');

    this.playPlatform()
      .then( (readySource) => {

        this.getSQLiteInstance().then( (db: SQLiteObject) => {
          
          this.database = db;

          this.createDatabase()
            .then( () => {
              console.log('SQLService Constructor - Banco Created');
            })

        });

      })
    
  }

  onInit(){
    
  }

  private getSQLiteInstance(){

    return this.sqlite.create({
      name: 'meioambienteDB.db',
      location: 'default'
    });

  
  }

  

  createDatabase(){

      console.log('### DATABASE CREATED ###',this.database);

      return this.platform.ready()
      .then( (readySource) => {

        console.log('PLATFORM BEGINS',readySource);  
        
        /* DOM/BROWSER SQLiteMock*/
        if(readySource == 'dom'){
          
          console.log('BROWSER MODE',this.database);  
          
          return this.createTableForBrowser();
          
        } else {

          console.log('DEVICE/EMULATOR MODE');     
          
          /* DEVICES/EMULATORS */
          return this.database.sqlBatch(DATABASE_SCHEMA)
            .then( () => {
              console.log('### TABLES CREATED ###');
              //this.getLocais();
            })
            .catch( (error) => {
              console.log(error.message);
            });
        }


      })
      .catch( (error) => {
        console.log(error);   
      })
        
        
  }

  /**
   * 
   * @param id 
   */
  getLocais(id?:number){

    return this.playPlatform()
      .then( (readySource) => {

        let where = '';
        if(id){
          where = `WHERE id = ${id}`;
        }

        return this.playPlatform()
        .then( (readySource) => {
            return this.database.executeSql(`SELECT * FROM local ${where}` ,[])
        });

      });
  }

  getEstacao(){
    
    return this.playPlatform()
      .then( (readySource) => {
          return this.database.executeSql(`SELECT * FROM estacao` ,[])
      });
    
    
  }

  getIndividuos(){

    return this.playPlatform()
      .then( (readySource) => {
          return this.database.executeSql(`SELECT * FROM individuos` ,[])
      });
  }

  storeEstacao(estacao:Estacao){

    return this.playPlatform()
      .then( (readySource) => {
        
        estacao.datacriacao = new Date().getTime();

        var sql = "INSERT INTO estacao (descricao,codigo,data,local_id,parcela,obs,datacriacao) " +
                " VALUES (?,?,?,?,?,?,?);";

        return this.database.executeSql(sql,[estacao.descricao,estacao.codigo,estacao.data,estacao.local_id,estacao.parcela,estacao,estacao.obs,estacao.datacriacao]);

      });

  }

  // platform plugins ready to use
  playPlatform(){
    return this.platform.ready();
  }

  // used to mock creates simulations in browser
  createTableForBrowser(){

    return this.database.executeSql(`
      CREATE TABLE IF NOT EXISTS local 
      (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        codigo	VARCHAR(200) UNIQUE,
        descricao	TEXT NOT NULL UNIQUE,
        datacriacao	VARCHAR(50)
      );      

      CREATE TABLE IF NOT EXISTS especie (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        codigo VARCHAR(200) UNIQUE,
        descricao	TEXT NOT NULL UNIQUE,
        datacriacao	VARCHAR(50)
     );

     CREATE TABLE IF NOT EXISTS estacao (
      id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      descricao TEXT NOT NULL,
      codigo TEXT UNIQUE,
      data TEXT NOT NULL,
      local_id INTEGER NOT NULL,
      parcela	TEXT,
      obs	TEXT,
      datacriacao	TEXT,
      FOREIGN KEY (local_id) REFERENCES local (id)
    );

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
    );

    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      telefone VARCHAR(255) NOT NULL,
      login_id INTEGER NOT NULL
    );

    DELETE FROM local;
    DELETE FROM especie;

    `, {})
    .then(() => {
        
      console.log('Tables created !');


      this.database.executeSql("DELETE FROM local; DELETE FROM especie;",{} )
          .then(() => {
            console.log('Limpei tabelas local e especie  !');

            for(let i=0; i<POPULATE_TABLES.length; i++){

              let insertQuery:string = POPULATE_TABLES[i][0] as string;
              let params = POPULATE_TABLES[i][1];
      
              this.database.executeSql(insertQuery , params)
                .then(() => {
                  console.log('registro inserido  !');
                })
                .catch( (error) => console.log(error,insertQuery,params,'ja existe') )
            }

          })
          .catch( (error) => console.log(error,'Não Limpou') );

    })
    .catch(e => console.log(e));    

        
  }

}