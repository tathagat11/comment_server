const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;
app.use(express.static(__dirname));
app.use(express.json());
 
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'abc12345',
    database : 'localdb'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    else console.log('MySQL Connected');
});




app.listen(process.env.PORT || 3000);