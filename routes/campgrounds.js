const   express = require('express'),
        router = express.Router(),
        Campground = require('../models/campground');

// INDEX
router.get('/', (req, res) =>
    Campground.find({}, (err, allCampgrounds) => {
        if(err)
            console.log(err);
        else
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
    })
);

// CREATE
router.post('/', (req, res) => {
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
router.get('new', (req, res) => res.render("campgrounds/new"));

// SHOW
router.get('/:id', (req, res) => {

    Campground.findById(req.params.id).populate('comments').exec( (err, campg) => {
        if(err)
            console.log(err);
        else {
            console.log(campg)
            res.render('campgrounds/show', {campground:campg});
        }
    });
});

module.exports = router;