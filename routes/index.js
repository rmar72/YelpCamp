const   express = require('express'),
        router = express.Router(),
        passport = require('passport'),
        User = require('../models/user');


// Landing
router.get('/', (req, res) => res.render('landing'));

// ====== Auth Routes
// register
router.get('/register', (req, res) => {
    if(req.user) {
        req.flash("error", "You are already logged in, you cannot register.");
        return res.redirect("back");
    }else{
        res.render("register", {page: 'register'});
    }
});

router.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//login/logout
router.get('/login', (req, res)=>{
    res.render("login", {page: 'login'}); 
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res)=>{});

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect('/campgrounds');
});

module.exports = router;