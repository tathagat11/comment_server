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
    database : 'test'
});

db.connect((err) => {
    if(err){
        throw err;
    }
});

app.get('',(req,res) => {
    res.sendFile(__dirname+"/Map.html");
});

app.route("/getcomments")
.post(function(req,res){
    let sql2 = `SELECT * FROM comments WHERE (commentor='${req.body.sessionUser}' OR self_common='common') AND resolved = 0`;
    let query = db.query(sql2, (err, results) => {
        if(err) throw err;
        res.send(results);
        console.log(results);
    });
});

app.route("/rescomments")
.post(function(req,res){
    let sql = `UPDATE comments SET resolved = 1 WHERE id = ${req.body.id}`
    let query = db.query(sql,(err,results) => {
        if(err) throw err;
    });
    res.send('put method called');
});

app.route("/postcomments")
.post(function(req,res){ 
    var id;  
    let sql = `SELECT COUNT (id) AS count FROM comments `; 
    let query = db.query(sql,(err,results) => {
        if(err) throw err;
        else {
            id = results[0].count+1;
            let sql2 = `INSERT INTO comments VALUES (${id},'${req.body.commentor}','${req.body.self_common}','${req.body.comment_}','${req.body.ToC}',${0},'${req.body.name}','${req.body.latt}','${req.body.longg}','${req.body.currentZoom}');`;
            let query2 = db.query(sql2,(err,results)=>{
                if(err) throw err;
                else {
                    let sql3 = `SELECT * FROM comments WHERE (commentor='${req.body.commentor}' OR self_common='common') AND resolved = 0`;
                    let query3 = db.query(sql3,(err,results)=>{
                        if(err) throw err;
                        else{
                            res.send(results);
                        }
                    })
                };
            });
        }
    });
});


app.listen(PORT);
//${req.body.start}