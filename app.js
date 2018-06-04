var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('landing');
});

app.listen(3000, function(){
    console.log("Yelp Camp Server up and running");
});