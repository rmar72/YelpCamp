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

//EDIT
router.get("/:comment_id/edit", checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err)
            res.redirect("back");
        else
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    });
});

// UPDATE
router.put("/:comment_id", checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err)
            res.redirect("back");
        else
            res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// DELETE
router.delete("/:comment_id", checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment)=>{
        if(err)
            console.log(err);
        else
            res.redirect(`/campgrounds/${req.params.id}`);
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err)
                res.redirect("back");
            else {
                if(foundComment.author.id.equals(req.user._id)){
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