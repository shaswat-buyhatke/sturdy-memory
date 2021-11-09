const mySqlConnection = require('./DB_CONNECTION');

const dbCheck1 = (username) => { 
    return new Promise((resolve,reject) => {
        mySqlConnection.query(`SELECT * from user where username = '${username}'` , (e , r , f) =>{
            if(!e){
                var obj = Object.assign({} , r[0]);
                resolve(obj)
            } 
            reject({});                                                              
            
        })
    }) 
};

const dbCheck2 = (username, password) => { 
    return new Promise((resolve,reject) => {
        mySqlConnection.query(`SELECT * from user where username = '${username}' and password = '${password}'` , (e , r , f) =>{
            if(!e){
                var obj = Object.assign({} , r[0]);
                resolve(obj)
            }
            reject(e);                                                              
        })
    }) 
};

const dbInsert1 = (username , password) => {
    return new Promise((resolve,reject) => {
        mySqlConnection.query(`INSERT into user(username , password) values('${username}' , '${password}')` , (e) =>{
            if(e){
                reject(e);
            } 
            resolve();                                                              
            
        })
    })
}

// Having integer ids will improve performance as this query would happen a lot ! 
const dbUpdate1 = (username , info) => {
    return new Promise((resolve,reject) => {
        mySqlConnection.query(`UPDATE user set info = (${info}) where username = '${username}''` , (e) =>{
            if(!e){
                reject();
            } 
            resolve();                                                              
            
        })
    })
}

module.exports = {dbCheck1,dbCheck2,dbInsert1,dbUpdate1};