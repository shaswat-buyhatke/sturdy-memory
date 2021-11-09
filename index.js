const express = require('express');
const session = require('express-session');
// var cookieParser = require('cookie-parser');
const Filestore = require('session-file-store')(session);
const mysql = require('mysql');
const { query } = require('express');
var login = require('./login');
var db_commands = require('./db_commands');
app = express();
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
const MASTERPASSWORD = 'password';



// app.use(session({secret: "Shh, its a secret!"}));

var fo = {};
app.use(session({
    name : 'sid',
    resave : true,
    saveUninitialized : true,
    secret : 's;kdng;lsk4056s|}dng3209@32580932', 
    store  : new Filestore(fo), 
    cookie : {
        maxAge: 1000 * 60 * 60 * 24 * 10,
        sameSite : true,
    } 
}))

app.get('/' , (req,res) => {
    // req.session.cookie_recieved = 1;
    return res.status(200).send('WELCOME ^_^ ');
})
app.use("/login" , login);
// app.post('/login' , async (req,res) => {
//     try {
//         console.log(req.session.id);
//         // if(typeof(req.session.cookie_recieved) == "undefined"){
//         //     return res.status(500).send('Please go to home route first');
//         // }
//         // console.log(req.session.);
//         let {username , password} = req.body; 
//         let admin_id = req.body.admin_id ? req.body.admin_id : '';

//         let admin_password = req.body.admin_password ? req.body.admin_password : '';
//         let key = req.body.key ? req.body.key : '';    
//         let admin_mode = 0;
//         // console.log('FIRST' , res);
//         if(username == null || password == null){
//             return res.status(400).send('Bad Request');
//         }

//         if(admin_id && admin_password) admin_mode = 1;
        
//         if(req.session.username === username && req.session.password === password && req.session.admin_id === admin_id && req.session.admin_password === admin_password && req.body.key === MASTERPASSWORD){
//             if(req.session.login_count && !isNaN(parseInt(req.session.login_count))){
//                 req.session.login_count += 1;
//             }else{
//                 req.session.login_count = 1; 
//             }
//             console.log(`Login Count : `, req.session.login_count);
//             return res.status(200).send(`SUCCESSFULLY LOGGED IN. Welcome ${admin_mode ? 'ADMIN' : 'USER'}`); 
//         }
                
//         const userData = await dbCheck2(username, password);
//         if(Object.keys(userData).length === 0){
//             return res.status(400).send('WRONG USERNAME OR PASSWORD');
//         }
//         let adminData = {};
//         if(admin_mode){ 
//             adminData = await dbCheck2(admin_id, admin_password);
//             if(Object.keys(adminData).length === 0 || key !== MASTERPASSWORD){
//                 return res.status(400).send('WRONG ADMIN USERNAME , PASSWORD OR MASTERPASSWORD');
//             }
//         }
//         // write the code to set values in session 
//         req.session.username = username;
//         req.session.admin_id = admin_id;
//         req.session.password = password;
//         req.session.admin_password = admin_password;

//         if(req.session.login_count && !isNaN(parseInt(req.session.login_count))){
//             req.session.login_count += 1;
//         }else{
//             req.session.login_count = 1; 
//         }
//         // console.log(`Login Count : `, req.session.login_count);
        
//         return res.status(200).send(`SUCCESSFULLY LOGGED IN. Welcome ${admin_mode ? 'ADMIN' : 'USER'}`); 
//     } catch (error) {

//         console.log(error);
//         return res.status(500).send(`SORRY ! Internal Error`); 
        
//     }         
// });

// we can only register normal users, to mark admin we will do it from panel.
// we can use masterkey to verify admin but then it breaks the whole assumption that it can be comprimised.
app.post('/register' , async (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    // let is_admin = req.is_admin;
    // if(is_admin === null) is_admin = 0;
    if(username==null || password==null){
        return res.status(400).send('Bad Request');
    }
    try{
        let obj = await db_commands.dbCheck1(username);
        if(Object.keys(obj).length !== 0){
            return res.status(400).send('USERNAME TAKEN');
        }
        else {
            await db_commands.dbInsert1(username,password);
            return res.status(200).send('Registered Successfully :) ');
        }
    }catch(e){
        return res.status(500).send('INTERNAL SERVER ERROR');
    };
})

app.post('/insert' , async (req,res) => {
    try{
        if(typeof(req.session.username) === "undefined"){
            return res.status(400).send('Please login first');
        }
        if(req.session.admin_id){
            res.status(400).send('Admins can\'t do this :( ');
        }
        let content = req.body.content;
        if(content === null){
            return res.status(400).send('Content can\'t be empty');
        }
        await db_commands.dbUpdate1(req.session.username , content);
        res.status(200).send('Inserted Successfully :)');

    }catch(e){
        console.log(e);
        return res.status(500).send('Internal server error');
    };
});

app.get('/logout' , (req,res) => {
    if(typeof(req.session.username) === 'undefined'){
        return res.status(400).send('Please login first');
    }
    console.log(req.session.username);
    req.session.destroy();
    return res.status(200).send('Do Revisit us again ^_^ ');
})

app.post('/delete' , async (req,res) => {
    try{
        if(req.session.username === null){
            return res.status(400).send('Please login first');
        }
        if(req.session.admin_id){
            res.status(400).send('Admins can\'t do this :( ');
        }
        await db_commands.dbUpdate1(req.session.username , '');
        res.status(200).send('Deleted Successfully :)');

    }catch(e){
        return res.status(500).send('Internal server error');
    };
});

app.listen(3000 , () =>{
    console.log('Server is up and running on port 3000');
});