export abstract class Table {

    constructor(){}

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


      

}