const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;
app.use(express.static(__dirname));
app.use(express.json());
app.set('view engine', 'html');

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

app.get('',(req,res) => {
    res.sendFile(__dirname+"/Map.html");
});

app.route("/getcomments")
.get(function(req,res){
    let sql2 = `SELECT * FROM comments LIMIT 0,50`;
    let query = db.query(sql2, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

app.route("/postcomments")
.post(function(req,res){
   console.log(req);
});



app.listen(PORT);
//${req.body.start}