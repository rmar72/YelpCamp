var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}))
mongoose.connect('mongodb://localhost/yelp_camp');
app.set('view engine', 'ejs');

// Schema Setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

app.get('/campgrounds', function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});
const Campground = mongoose.model('Campground', campgroundSchema);

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