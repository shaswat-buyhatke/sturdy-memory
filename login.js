const express = require("express");
let router = express.Router();
var mySqlConnection = require('./DB_CONNECTION');

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

router.post('/' , async (req,res) => {
    try {
        console.log(req.session.id);
        // if(typeof(req.session.cookie_recieved) == "undefined"){
        //     return res.status(500).send('Please go to home route first');
        // }
        // console.log(req.session.);
        let {username , password} = req.body; 
        let admin_id = req.body.admin_id ? req.body.admin_id : '';

        let admin_password = req.body.admin_password ? req.body.admin_password : '';
        let key = req.body.key ? req.body.key : '';    
        let admin_mode = 0;
        // console.log('FIRST' , res);
        if(username == null || password == null){
            return res.status(400).send('Bad Request');
        }

        if(admin_id && admin_password) admin_mode = 1;
        
        if(req.session.username === username && req.session.password === password && req.session.admin_id === admin_id && req.session.admin_password === admin_password && req.body.key === MASTERPASSWORD){
            if(req.session.login_count && !isNaN(parseInt(req.session.login_count))){
                req.session.login_count += 1;
            }else{
                req.session.login_count = 1; 
            }
            console.log(`Login Count : `, req.session.login_count);
            return res.status(200).send(`SUCCESSFULLY LOGGED IN. Welcome ${admin_mode ? 'ADMIN' : 'USER'}`); 
        }
                
        const userData = await dbCheck2(username, password);
        if(Object.keys(userData).length === 0){
            return res.status(400).send('WRONG USERNAME OR PASSWORD');
        }
        let adminData = {};
        if(admin_mode){ 
            adminData = await dbCheck2(admin_id, admin_password);
            if(Object.keys(adminData).length === 0 || key !== MASTERPASSWORD){
                return res.status(400).send('WRONG ADMIN USERNAME , PASSWORD OR MASTERPASSWORD');
            }
        }
        // write the code to set values in session 
        req.session.username = username;
        req.session.admin_id = admin_id;
        req.session.password = password;
        req.session.admin_password = admin_password;

        if(req.session.login_count && !isNaN(parseInt(req.session.login_count))){
            req.session.login_count += 1;
        }else{
            req.session.login_count = 1; 
        }
        // console.log(`Login Count : `, req.session.login_count);
        
        return res.status(200).send(`SUCCESSFULLY LOGGED IN. Welcome ${admin_mode ? 'ADMIN' : 'USER'}`); 
    } catch (error) {

        console.log(error);
        return res.status(500).send(`SORRY ! Internal Error`); 
        
    }         
});

module.exports = router;