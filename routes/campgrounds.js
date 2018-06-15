const   express = require('express'),
        router = express.Router({mergeParams:true}),
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
router.post('/', isLoggedIn, (req, res) => {
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
router.get('/new', isLoggedIn, (req, res) => res.render("campgrounds/new"));

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
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function(err, campg){
        res.render("campgrounds/edit", {campground: campg});
    });
});

// UPDATE
router.put('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampg) => {
        if(err)
            res.redirect("/campgrounds");
        else
            res.redirect(`/campgrounds/${req.params.id}`);
        
    });
});

// DELETE
router.delete('/:id', checkCampgroundOwnership, (req, res) => Campground.findByIdAndRemove(req.params.id, (err) => {
    res.redirect("/campgrounds");
}));

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, campg) => {
            if(err)
                res.redirect("back");
            else {
                if(campg.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
         });
    }
    else {
         res.redirect("back");
    }
}

module.exports = router;