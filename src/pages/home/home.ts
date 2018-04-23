import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { MatButton  } from '@angular/material';
import { SQLiteMock } from '../../model/mock.sqlite';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { Page } from 'ionic-angular/navigation/nav-util';
import { LocalPage } from '../local/local';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public database: SQLiteObject;
  public invoices: Array<Object>;
  public counter : number = 0;
  public navPage: Page;

  constructor(
    public navCtrl: NavController, 
    menu: MenuController,
    private sqlite : SQLite) {
    menu.enable(true);
    this.navPage = LocalPage;
  }


  ionViewDidEnter(){
    console.log('view did enter');
        
    // this.sqlite.create({name: "data.db", location: "default"})
    //   .then((db : SQLiteObject) => {
    //     this.database = db;
    //       this.createTable();
    //   }, (error) => {
    //       console.log("ERROR: ", error);
    //   });    

  }

  public createTable(){
    this.database.executeSql('create table if not exists invoices(name VARCHAR(32))', {})
        .then(() => {
            console.log('Table Invoice created !');

        })
        .catch(e => console.log(e));    
  }


  public insertInvoice(){
      var c = 'INV' + this.counter; 
      this.database.executeSql("INSERT INTO invoices (name) VALUES (?)", [c]).then((data) => {
              console.log("INSERTED: ");
              this.counter++;
              this.showInvoices();
          }, (error) => {
              console.log("ERROR: " + JSON.stringify(error.err));
          });    
  }

  public showInvoices(){
    this.database.executeSql("SELECT * FROM invoices", []).then((data) => {
            this.invoices = [];
            if(data.rows.length > 0) {
                for(var i = 0 ; i < data.rows.length ; i++) {
                    this.invoices.push({ name: data.rows.item(i).name });
                }
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });    
}

}
