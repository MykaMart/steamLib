const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
steamID: String
});


module.exports = mongoose.model('Friends', friendSchema);
