const mongoose = require("mongoose");

// Schema Setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model('Campground', campgroundSchema);