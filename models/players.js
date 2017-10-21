const mongoose = require('mongoose');
const Library = require('./libraryPlayer');
const Friend = require('./friends');

const playerSchema = new mongoose.Schema({
steamID: String, //we will be using the id numbers to concatenate urls
name: String,
avatar: String,
library: [Library.schema]
friends: [Friend.schema]
});

module.exports = mongoose.model('Player', playerSchema);
