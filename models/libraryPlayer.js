const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
gameID: String,
name: String,
genres: Array,
description: String,
about: String,
publisher: String,
multiplayer: Boolean,
score: Number,
recommendations: Number,
achievements: Array,
stats: Array,
banner: String,
screenshots: Array
});


module.exports = mongoose.model('libraryPlayer', librarySchema);
