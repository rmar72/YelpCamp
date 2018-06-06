const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Schema Setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

const Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', (req, res) => res.render('landing'));

app.get('/campgrounds', (req, res) =>
   
    Campground.find({}, (err, allCampgrounds) => {
        if(err)
            console.log(err);
        else
            res.render("campgrounds", {campgrounds: allCampgrounds});
    })
);

app.post('/campgrounds', (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = { name: name, image: image }
    Campground.create(newCampground, (err, newCampground) => {
        if(err)
            console.log(err);
        else
            res.redirect('campgrounds');
    });
    
});

app.get('/campgrounds/new', (req, res) => res.render("new"));

app.listen(3000, () =>
    console.log("Yelp Camp Server up and running")
);