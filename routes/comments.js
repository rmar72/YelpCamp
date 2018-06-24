const   express = require('express'),
        router = express.Router({mergeParams:true}),
        Campground = require('../models/campground'),
        Comment = require('../models/comment'),
        middleware = require('../middleware');

// ================== 
//  COMMENTS
// ==================

router.get('/new', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campg)=> {
        if(err) console.log(err);
        else{
            res.render("comments/new", { campground: campg});
        }
    });
    
});

router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err)
            res.redirect("back");
        else
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err)
            res.redirect("back");
        else
            res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment)=>{
        if(err)
            console.log(err);
        else
            res.redirect(`/campgrounds/${req.params.id}`);
    })
});

module.exports = router;