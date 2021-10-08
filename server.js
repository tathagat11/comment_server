const express  = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index.js')
const mysql = require('mysql');

app.set('view engine','ejs');
app.set('views',__dirname+ '/views');
app.set('layout','./layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

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

app.use('/',indexRouter);

app.listen(process.env.PORT || 3000);