const   express = require('express'),
        router = express.Router({mergeParams:true}),
        Campground = require('../models/campground'),
        Comment = require('../models/comment');

// ================== 
//  COMMENTS
// ==================

router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campg)=> {
        if(err) console.log(err);
        else{
            res.render("comments/new", { campground: campg});
        }
    });
    
});

router.post('/', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campg) => {
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) console.log(err);
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campg.comments.push(comment);
                    campg.save();
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            });
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