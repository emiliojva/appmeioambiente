// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { DateTime } from 'ionic-angular';
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

/*
  Generated class for the SqLiteWrapperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqLiteWrapperProvider {

  db: any;
  
  constructor(
    //public http: HttpClient, 
    public sqlite: SQLite) 
  {
    console.log('Hello SqLiteWrapperProvider Provider');
  }

  getSQLiteInstance(){

    return this.sqlite.create({
      name: 'meioambienteDB.db',
      location: 'default'
    });

  
  }

  createDatabase(){

    return this.getSQLiteInstance()
      .then( (db: SQLiteObject) => {

        console.log('### DATABASE CREATED ###',db);

        
        db.sqlBatch(DATABASE_SCHEMA)
          .then( () => {
            console.log('### TABLES CREATED ###');
            //this.getLocais();
          })
          .catch( (error) => {
            console.log(error.message);
          });
      })
  }

  /**
   * 
   * @param id 
   */
  getLocais(id?:number){

    let where = '';
    if(id){
      where = `WHERE id = ${id}`;
    }

    return this.getSQLiteInstance()
      .then( (db: SQLiteObject) => {
        return db.executeSql(`SELECT * FROM local ${where}` ,[])
      });
  }

  getEstacao(){
    return this.getSQLiteInstance()
      .then( (db: SQLiteObject) => {
        return db.executeSql(`SELECT * FROM individuos` ,[])
      });
  }

  getIndividuos(){
    return this.getSQLiteInstance()
      .then( (db: SQLiteObject) => {
        return db.executeSql(`SELECT * FROM individuos` ,[])
      });
  }

  storeEstacao(estacao:Estacao){

    return this.getSQLiteInstance()
      .then( (db: SQLiteObject) => {

        estacao.datacriacao = new Date().getTime();

        var sql = "INSERT INTO estacao (descricao,codigo,data,local_id,parcela,obs,datacriacao) " +
                " VALUES (?,?,?,?,?,?,?);";
        return db.executeSql(sql,[estacao.descricao,estacao.codigo,estacao.data,estacao.local_id,estacao.parcela,estacao,estacao.obs,estacao.datacriacao]);
        
      });

  }

}


  // this.getSQLiteInstance()
    //       .then( (db: SQLiteObject) => {
    //         console.log(db,'Platform SQLite avaliable');    
    //       })
    //       .catch( (error) => {
    //         console.log(error,'NO Platform SQLite avaliable');    
    //       });


    // this.sqlite.selfTest()
    //   .then( (res) => {
    //     console.log('Platform SQLite avaliable');
    //   })
    //   .catch( (error) => {
    //     console.log(error,'NO Platform SQLite avaliable');
    //   });


   
