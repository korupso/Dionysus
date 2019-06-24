var mongoose = require('mongoose');

module.exports = mongoose.model('vocs', {
    username: String,
    password: String
});