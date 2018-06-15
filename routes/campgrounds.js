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
router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, (err, campg)=>{
        if(err)
            console.log(err);
        else {
             res.render("campgrounds/edit", {campground: campg});
        }
    });
   
});

// UPDATE
router.put('/:id', (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampg)=>{
        if(err) console.log(err);
        else{
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;