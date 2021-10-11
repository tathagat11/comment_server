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
    var count = 0;
    let sql2 = `SELECT * FROM comments LIMIT 0,50`;
    let query = db.query(sql2, (err, results) => {
        if(err) throw err;
        results.push(count);
        res.send(results);
    });
});

app.listen(PORT);
//${req.body.start}