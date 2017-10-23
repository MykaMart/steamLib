const mongoose = require('mongoose');
const Library = require('./libraryModel');
const Friends = require('./friendsModel');

const playerSchema = new mongoose.Schema({
steamID: String, //we will be using the id numbers to concatenate urls
name: String,
avatar: String,
library: [Library.schema],
friends: [Friends.schema]
});

module.exports = mongoose.model('Player', playerSchema);
