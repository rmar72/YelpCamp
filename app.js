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

const   indexRoutes = require('./routes/index'),
        campgroundRoutes = require('./routes/campgrounds'),
        commentRoutes = require('./routes/comments');        

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

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, () =>
    console.log("Yelp Camp Server up and running")
);