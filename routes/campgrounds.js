const   express = require('express'),
        router = express.Router({mergeParams:true}),
        Campground = require('../models/campground'),
        middleware = require('../middleware');

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
router.post('/', middleware.isLoggedIn, (req, res) => {
    let newCampground = { 
        name: req.body.name,
        image: req.body.image,
        author: {
            id: req.user._id,
            username: req.user.username
        },
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
router.get('/new', middleware.isLoggedIn, (req, res) => res.render("campgrounds/new"));

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

// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function(err, campg){
        res.render("campgrounds/edit", {campground: campg});
    });
});

// UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampg) => {
        if(err)
            res.redirect("/campgrounds");
        else
            res.redirect(`/campgrounds/${req.params.id}`);
        
    });
});

// DELETE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => Campground.findByIdAndRemove(req.params.id, (err) => {
    res.redirect("/campgrounds");
}));

module.exports = router;