var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');

var campgrounds = [
    {name: "Salmon Creek", image:"https://www.nps.gov/noca/planyourvisit/images/Thunder_Creek_Bridge_1.jpg?maxwidth=650&autorotate=false"},
    {name: "Alpine Creek", image:"http://www.wandernorthgeorgia.com/wp-content/uploads/2016/09/dickscreek5.jpg"},
    {name: "Bear Creek", image:"https://www.steamboatchamber.com/media/549263/Fish-Creek-Falls-Overlook.jpg"},
];

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image }
    campgrounds.push(newCampground);
    res.redirect('campgrounds');
});

app.get('/campgrounds/new', function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("Yelp Camp Server up and running");
});