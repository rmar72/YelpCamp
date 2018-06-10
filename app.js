const   app = require('express')(),
        bodyParser = require('body-parser'),
        mongoose = require("mongoose"),
        Campground = require('./models/campground');

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Landing
app.get('/', (req, res) => res.render('landing'));

// INDEX
app.get('/campgrounds', (req, res) =>
    Campground.find({}, (err, allCampgrounds) => {
        if(err)
            console.log(err);
        else
            res.render("index", {campgrounds: allCampgrounds});
    })
);

// CREATE
app.post('/campgrounds', (req, res) => {
    let newCampground = { 
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }

    Campground.create(newCampground, (err, newCampground) => {
        if(err)
            console.log(err);
        else
            res.redirect('/campgrounds');
    });
    
});

// NEW
app.get('/campgrounds/new', (req, res) => res.render("new"));

// SHOW
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id, (err, campg) => {
        if(err)
            console.log(err);
        else
            res.render('show', {campground:campg});
    });
});

app.listen(3000, () =>
    console.log("Yelp Camp Server up and running")
);