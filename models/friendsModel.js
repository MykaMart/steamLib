const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
steamID: String,
avatar: String,
library: [{game: String, banner: String}]
});


module.exports = mongoose.model('Friends', friendsSchema);