const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require("mongoose"),
        passport = require("passport"),
        LocalStrategy = require("passport-local"),
        Campground = require('./models/campground'),
        Comment = require('./models/comment'),
        User = require('./models/user'),
        methodOverride = require('method-override'),
        flash = require('connect-flash'),
        port = process.env.PORT || 3000;
        seedDB = require('./seeds');

const   indexRoutes = require('./routes/index'),
        campgroundRoutes = require('./routes/campgrounds'),
        commentRoutes = require('./routes/comments');        

//mongoose.connect('mongodb://localhost/yelp_camp');
mongoose.connect('mongodb://rmar7:yelpcamp101@ds123181.mlab.com:23181/yelp-camp-db-practice');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
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
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, () => console.log('YelpCamp Server has started'));