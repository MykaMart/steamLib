const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
gameID: String,
name: String,
genres: [String],
description: String,
about: String,
publisher: String,
multiplayer: Boolean,
score: Number,
recommendations: Number,
achievements: [{achievement: String, achieved: Boolean}],
stats: [{stat: String, value: Number}],
banner: String,
screenshots: [String]
});



module.exports = mongoose.model('Library', librarySchema);
