const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require("mongoose"),
        passport = require("passport"),
        LocalStrategy = require("passport-local"),
        Campground = require('./models/campground'),
        Comment = require('./models/comment'),
        User = require('./models/user'),
        seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//seedDB();

//Passport Configuration
app.use(require('express-session')({
        secret:'Rusty Wins',
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Landing
app.get('/', (req, res) => res.render('landing'));

// INDEX
app.get('/campgrounds', (req, res) =>
    Campground.find({}, (err, allCampgrounds) => {
        if(err)
            console.log(err);
        else
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
app.get('/campgrounds/new', (req, res) => res.render("campgrounds/new"));

// SHOW
app.get('/campgrounds/:id', (req, res) => {

    Campground.findById(req.params.id).populate('comments').exec( (err, campg) => {
        if(err)
            console.log(err);
        else {
            console.log(campg)
            res.render('campgrounds/show', {campground:campg});
        }
    });
});

// ================== 
//  COMMENTS
// ==================

app.get('/campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id, (err, campg)=> {
        if(err) console.log(err);
        else{
            res.render("comments/new", { campground: campg});
        }
    });
    
});

app.post('/campgrounds/:id/comments', (req, res) => {
    Campground.findById(req.params.id, (err, campg) => {
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) console.log(err);
                else{
                    campg.comments.push(comment);
                    campg.save();
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            });
        }
    });
});


// ====== Auth Routes
// register
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, ()=>{
            res.redirect("/campgrounds");
        });
    });
});

//login/logout
app.get('/login', (req, res)=>{
    res.render('login');
});

app.post('/login', passport.authenticate('local',
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res)=>{});

app.listen(3000, () =>
    console.log("Yelp Camp Server up and running")
);