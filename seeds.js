const   mongoose = require('mongoose'),
        Campground = require('./models/campground'),
        Comment = require("./models/comment");

const data = [
    {
        name: "Dragons Nest",
        image: "https://wallpapers.walldevil.com/wallpapers/a78/preview/wallpaper-beautiful-creek-little.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Clouds Rest",
        image: "https://thumbs.dreamstime.com/z/beautiful-view-mountain-creek-summer-54336475.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Oak Creek",
        image: "http://www.cypressspringsadventures.com/wp-content/uploads/2016/04/cypressspringsropeswing.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
];

function seedDB(){
    Campground.remove({}, err => {
        if(err) console.log(err);
        else{
            console.log('removed campgrounds!');

            data.forEach(seed => {
                Campground.create(seed, (err, campground) => {
                    if(err) console.log(err);
                    else{ 
                        console.log('added Campground');

                        Comment.create(
                            {
                                text: 'This is great, but I wish there was internet',
                                author: 'Homer'
                            }, (err, comment) => {
                                if(err) console.log(err);
                                else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log('Comment created');
                                }
                        });
                    }
                });
            });
        }
    });

    
}


module.exports = seedDB;